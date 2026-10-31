import { STATS, FACILITY_INFO, CONTACT_INFO, QUICK_INFO } from "./facilityData.js";

const empty = "Chưa cập nhật";
export const formatAddress = (address) => typeof address === "string" ? address :
  [address?.detail || address?.street, address?.ward, address?.district, address?.province || address?.city].filter((value) => typeof value === "string" && value.trim()).join(", ");

export function buildFacilityProfile({ business, branches = [], owner = {}, stats }) {
  const date = business.createdAt ? new Date(business.createdAt).toLocaleDateString("vi-VN") : empty;
  const status = ({ PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Bị từ chối", SUSPENDED: "Tạm khóa" })[business.status] || empty;
  const info = [business.name, business._id, business.businessType, business.licenseNumber, date, status];
  const contact = [business.phone, business.email, business.website, formatAddress(business.address), business.socialUrl];
  const regions = [...new Set(branches.map((item) => item.address?.province || item.address?.city).filter(Boolean))].join(", ");
  const quick = [status, owner.fullName, regions, null, null];
  const values = [`${stats.branches} Chi nhánh`, `${stats.services} Dịch vụ`, stats.totalReviews ? stats.averageRating.toFixed(1) : "—", "—"];
  const subtexts = [`${stats.activeBranches} chi nhánh đang hoạt động`, "Dịch vụ đang hoạt động của cơ sở", `${stats.totalReviews} lượt đánh giá`, "Chưa có dữ liệu nhân sự"];
  return {
    name: business.name, id: business._id, businessId: business._id, logo: business.logo,
    description: business.description || empty, date, status,
    stats: STATS.map((item, index) => ({ ...item, value: values[index], subtext: subtexts[index] })),
    info: FACILITY_INFO.map((item, index) => ({ ...item, value: info[index] || empty })),
    contact: CONTACT_INFO.map((item, index) => ({ ...item, value: contact[index] || empty })),
    quick: QUICK_INFO.map((item, index) => ({ ...item, label: index === 0 ? "Trạng thái xét duyệt" : item.label, value: quick[index] || empty,
      managerName: owner.fullName || empty, managerEmail: owner.email || "", managerAvatar: owner.avatar || "" })),
    schedule: (business.openingHours || []).filter(Boolean).map((item, index) => typeof item === "string" ? { day: `Ngày ${index + 1}`, time: item } : ({
      day: String(item.day ?? item.dayOfWeek ?? `Ngày ${index + 1}`),
      time: item.time || (item.closed || item.isClosed ? "Đóng cửa" : [item.open || item.openTime, item.close || item.closeTime].filter(Boolean).join(" - ")) || empty,
    })),
    gallery: business.images || [], policies: business.policies || [], note: business.note || empty,
  };
}
