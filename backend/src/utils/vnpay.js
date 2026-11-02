const crypto = require("crypto");

const formatVnpDate = (date) =>
  new Date(date.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);

const encode = (value) =>
  encodeURIComponent(String(value))
    .replace(/[!'()*]/g, (char) =>
      `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    )
    .replace(/%20/g, "+");

const buildQuery = (params) =>
  Object.keys(params)
    .filter(
      (key) =>
        params[key] != null &&
        key !== "vnp_SecureHash" &&
        key !== "vnp_SecureHashType"
    )
    .sort()
    .map((key) => `${encode(key)}=${encode(params[key])}`)
    .join("&");

const signVnpay = (params) =>
  crypto
    .createHmac("sha512", process.env.VNP_HASH_SECRET)
    .update(buildQuery(params), "utf8")
    .digest("hex");

const verifyVnpay = (params) => {
  const received = params.vnp_SecureHash;

  if (
    typeof received !== "string" ||
    !/^[a-f0-9]{128}$/i.test(received)
  ) {
    return false;
  }

  const expected = signVnpay(params);

  return crypto.timingSafeEqual(
    Buffer.from(received, "hex"),
    Buffer.from(expected, "hex")
  );
};

module.exports = {
  formatVnpDate,
  buildQuery,
  signVnpay,
  verifyVnpay,
};