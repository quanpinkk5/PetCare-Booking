import { formatAddress, imageUrl, openingHoursText } from "../../customer/services/businessData.js";

export function branchToRow(branch, business) {
  const hours = openingHoursText(branch.openingHours);
  const current = branch.monthlyBookings ?? 0;
  const previous = branch.previousMonthBookings ?? 0;
  const change = previous > 0 ? ((current - previous) / previous) * 100 : null;
  return {
    ...branch, id: branch._id, addressData: branch.address,
    address: formatAddress(branch.address) || "Chưa cập nhật địa chỉ",
    district: branch.address?.district || "",
    phone: branch.phone || "Chưa cập nhật", img: imageUrl(branch.images, business?.logo),
    hours: hours[0], days: hours.length > 1 ? `+${hours.length - 1} khung giờ khác` : "",
    hoursDetail: hours.join("\n"), services: branch.serviceCount ?? 0, bookings: current,
    trend: change === null || change === 0 ? "neutral" : change > 0 ? "up" : "down",
    trendVal: change === null ? "Chưa có số liệu so sánh" : `${change > 0 ? "+" : ""}${change.toFixed(1)}% so với tháng trước`,
    statusCode: branch.status, status: branch.status === "ACTIVE" ? "Đang hoạt động" : "Tạm dừng",
    statusClass: branch.status === "ACTIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600",
  };
}

export function filterBranchRows(branches, keyword, status, district) {
  const query = keyword.trim().toLocaleLowerCase("vi-VN");
  return branches.filter((branch) => (!query || `${branch.name} ${branch.address}`.toLocaleLowerCase("vi-VN").includes(query)) &&
    (status === "all" || branch.statusCode === status) && (district === "all" || branch.district === district));
}

export function normalizeBranchHours(hours = []) {
  return hours.filter(Boolean).map((item, index) => typeof item === "string" ? { day: `Ngày ${index + 1}`, time: item } : ({
    day: String(item.day ?? item.dayOfWeek ?? `Ngày ${index + 1}`),
    time: item.closed || item.isClosed ? "Đóng cửa" : item.time || [item.openTime || item.open, item.closeTime || item.close].filter(Boolean).join(" - "),
  }));
}
