# Run in an Administrator PowerShell. Preserves the existing MongoDB data path.
$ErrorActionPreference = 'Stop'
$mongoPrincipal = [Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $mongoPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Open PowerShell with Run as administrator, then run this script again.'
}

$mongoConfigPath = 'C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg'
$mongoConfigText = Get-Content -LiteralPath $mongoConfigPath -Raw
if ($mongoConfigText -match '(?m)^replication\s*:') {
  if ($mongoConfigText -notmatch '(?m)^\s+replSetName:\s*rs0\s*$') {
    throw 'An existing replication configuration was found. It has not been changed.'
  }
} else {
  $mongoConfigBackup = "$mongoConfigPath.before-petcare-rs0-$(Get-Date -Format 'yyyyMMdd-HHmmss').bak"
  Copy-Item -LiteralPath $mongoConfigPath -Destination $mongoConfigBackup
  Write-Host "Configuration backup: $mongoConfigBackup"
  $mongoConfigNext = $mongoConfigText + "`r`nreplication:`r`n  replSetName: rs0`r`n"
  try {
    [IO.File]::WriteAllText($mongoConfigPath, $mongoConfigNext, [Text.UTF8Encoding]::new($false))
    Restart-Service -Name MongoDB
  } catch {
    Copy-Item -LiteralPath $mongoConfigBackup -Destination $mongoConfigPath -Force
    if ((Get-Service -Name MongoDB).Status -ne 'Running') {
      Start-Service -Name MongoDB
    }
    throw
  }
}

# Use the project's installed driver; no extra packages or database writes are needed
# except the replica-set initialization command itself.
$mongoSetupJs = @'
const { MongoClient } = require('mongodb');
(async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&retryWrites=false', { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const admin = client.db('admin');
    const hello = await admin.command({ hello: 1 });
    if (hello.setName && hello.setName !== 'rs0') throw new Error('A different replica set is already configured.');
    try {
      await admin.command({ replSetGetStatus: 1 });
    } catch (error) {
      if (error.code !== 94 && error.codeName !== 'NotYetInitialized') throw error;
      await admin.command({ replSetInitiate: { _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] } });
    }
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const state = await admin.command({ hello: 1 });
      if (state.setName === 'rs0' && state.isWritablePrimary) {
        console.log('MongoDB rs0 is PRIMARY. Restart the backend, then retry booking.');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error('rs0 was configured but has not elected a primary yet. Check the MongoDB log and rerun this script.');
  } finally { await client.close(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
'@

Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  $mongoSetupJs | node
  if ($LASTEXITCODE -ne 0) { throw 'Replica-set initialization did not complete. See the message above.' }
} finally {
  Pop-Location
}
