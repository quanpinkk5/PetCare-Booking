// Run from backend: node scripts/seedOwnerDemoImages.js [--apply]
// Only fills empty image arrays for the three demo owners; repeat runs are safe.
require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Business = require('../src/models/Business');
const Service = require('../src/models/Service');
const images = require('./ownerDemoImages');

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const emails = ['maiducthanh@petcare.com', 'nguyenducminh@petcare.com', 'nguyenngochong@petcare.com'];
  const users = await User.find({ email: { $in: emails }, role: 'BUSINESS_OWNER' }).select('email').lean();
  if (users.length !== emails.length) throw new Error('Expected all three business owners');
  const businesses = await Business.find({ ownerId: { $in: users.map(u => u._id) } }).lean();
  if (businesses.length !== emails.length) throw new Error('Expected all three businesses');
  const services = await Service.find({ businessId: { $in: businesses.map(b => b._id) } }).lean();
  const changes = services.filter(s => !s.images?.length).map(s => {
    if (!images[s.name]) throw new Error(`No suitable image for ${s.name}`);
    return { id: s._id, businessId: s.businessId, name: s.name, previous: s.images || [], image: images[s.name] };
  });
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', total: services.length, toUpdate: changes.length }));
  if (!apply || !changes.length) return;
  // Fail before any writes if a stock image no longer loads.
  const checks = await Promise.allSettled([...new Set(changes.map(c => c.image.url))].map(async url => {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image unavailable: ${url}`);
    await response.arrayBuffer();
  }));
  for (const check of checks) if (check.status === 'rejected') throw check.reason;
  const reportPath = path.join(__dirname, '..', 'artifacts', `owner-demo-images-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ state: 'prepared', changes }, null, 2));
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const change of changes) {
        const updated = await Service.updateOne({
          _id: change.id, businessId: change.businessId, 'images.0': { $exists: false },
        }, { $set: { images: [change.image.url] } }, { session, runValidators: true });
        if (updated.matchedCount !== 1) throw new Error(`Service changed concurrently: ${change.name}`);
      }
    });
    fs.writeFileSync(reportPath, JSON.stringify({ state: 'committed', changes }, null, 2));
    console.log(JSON.stringify({ updated: changes.length, preserved: services.length - changes.length, reportPath }));
  } finally { await session.endSession(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
