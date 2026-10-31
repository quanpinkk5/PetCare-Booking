const fields = ["name", "description", "phone", "email", "businessType", "licenseNumber", "website", "socialUrl", "logo"];
const addressFields = ["detail", "ward", "district", "province"];

module.exports = (body) => {
  const invalid = (error) => ({ error });
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => ![...fields, "address", "images"].includes(key))) return invalid("Thông tin đăng ký không hợp lệ");
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined && (typeof body[field] !== "string" || body[field].length > 5000)) return invalid(`${field} không hợp lệ`);
    data[field] = body[field]?.trim() || "";
  }
  for (const field of ["name", "description", "phone", "email"]) {
    if (!data[field]) return invalid("Vui lòng điền tên cơ sở, mô tả, số điện thoại và email liên hệ");
  }
  if (data.name.length > 300) return invalid("Tên cơ sở tối đa 300 ký tự");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return invalid("Email liên hệ không hợp lệ");
  if (!/^[+\d()\s.-]{7,25}$/.test(data.phone)) return invalid("Số điện thoại liên hệ không hợp lệ");
  data.email = data.email.toLowerCase();
  for (const field of ["logo", "website", "socialUrl"]) {
    if (data[field] && !/^https?:\/\/[^\s]+$/i.test(data[field])) return invalid("Đường dẫn phải bắt đầu bằng http:// hoặc https://");
  }
  if (!body.address || typeof body.address !== "object" || Array.isArray(body.address) || Object.entries(body.address).some(([key, value]) => !addressFields.includes(key) || typeof value !== "string" || value.length > 1000)) return invalid("Địa chỉ cơ sở không hợp lệ");
  data.address = Object.fromEntries(addressFields.map((key) => [key, body.address[key]?.trim() || ""]));
  if (!data.address.detail || !data.address.province) return invalid("Vui lòng nhập địa chỉ và tỉnh/thành phố của cơ sở");
  if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length > 100 || !body.images.every((url) => typeof url === "string" && url.length <= 5000 && /^https?:\/\/[^\s]+$/i.test(url.trim())))) return invalid("Hình ảnh phải là mảng đường dẫn HTTP/HTTPS");
  data.images = (body.images || []).map((url) => url.trim());
  return { data };
};
