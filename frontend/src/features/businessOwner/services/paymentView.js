export const PAYMENT_STATUSES = {
  PAID: "Đã thanh toán", PENDING: "Chờ thanh toán", PROCESSING: "Đang xử lý",
  FAILED: "Thất bại", EXPIRED: "Hết hạn", REFUNDED: "Đã hoàn tiền",
};
export const PAYMENT_METHODS = {
  CASH: "Tiền mặt", VNPAY: "VNPay", MOMO: "Ví MoMo", BANK_TRANSFER: "Chuyển khoản",
};
export const formatMoney = (amount) => `${Number(amount || 0).toLocaleString("vi-VN")} đ`;
const dateText = (value) => value && !Number.isNaN(new Date(value).getTime())
  ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value)) : "—";
const defaultAvatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e2e8f0"/><circle cx="40" cy="28" r="14" fill="#94a3b8"/><path d="M12 80v-8a28 28 0 0156 0v8" fill="#94a3b8"/></svg>')}`;

export function mapOwnerPayment(payment) {
  const booking = payment.bookingId || {};
  const offering = booking.branchServiceId || {};
  const customer = payment.customerId || {};
  const status = PAYMENT_STATUSES[payment.status] || "Chưa xác định";
  const statusClass = payment.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : ["PENDING", "PROCESSING"].includes(payment.status) ? "bg-amber-50 text-amber-700 border-amber-200"
    : payment.status === "REFUNDED" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-red-50 text-red-700 border-red-200";
  const timeline = [{ id: "created", date: dateText(payment.createdAt), title: "Khởi tạo yêu cầu thanh toán", desc: "Giao dịch được tạo trong hệ thống", color: "bg-slate-400" }];
  const eventDate = payment.status === "PAID" ? payment.paidAt : payment.status === "REFUNDED" ? payment.refundedAt : payment.status === "FAILED" ? payment.failedAt : null;
  if (payment.status === "REFUNDED" && payment.paidAt) timeline.unshift({ id: "paid", date: dateText(payment.paidAt), title: PAYMENT_STATUSES.PAID, desc: "Thanh toán đã được ghi nhận", color: "bg-emerald-500" });
  if (payment.status !== "PENDING") timeline.unshift({ id: "status", date: dateText(eventDate), title: status, desc: payment.failureReason || "Trạng thái giao dịch được ghi nhận trong hệ thống", color: payment.status === "PAID" ? "bg-emerald-500" : "bg-blue-500" });
  return {
    id: payment.paymentCode || payment._id, paymentId: payment._id,
    bookingCode: booking.bookingCode || "—", customer: customer.fullName || "—", phone: customer.phone || "—",
    avatar: customer.avatar || defaultAvatar, service: offering.serviceId?.name || "Dịch vụ không còn khả dụng",
    branch: offering.branchId?.name || "—", branchId: offering.branchId?._id || "",
    icon: offering.serviceId?.serviceType === "BOARDING" ? "🏨" : "🐾", color: "text-emerald-600",
    method: PAYMENT_METHODS[payment.method] || payment.method || "—", methodBadge: payment.method === "BANK_TRANSFER" ? "BANK" : payment.method,
    badgeClass: payment.method === "MOMO" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700",
    rawStatus: payment.status, amountValue: Number(payment.amount || 0), amount: formatMoney(payment.amount),
    subtotal: formatMoney(booking.totalPrice ?? payment.amount),
    received: formatMoney(payment.status === "PAID" ? payment.amount : 0),
    rawDate: payment.paidAt || payment.createdAt, date: dateText(payment.paidAt || payment.createdAt),
    status, statusClass, timeline,
    reconciliation: payment.status === "PAID" ? "Đã ghi nhận thanh toán" : status,
  };
}

export function matchesPaymentDates(payment, from, to) {
  if (!from && !to) return true;
  const date = new Date(payment.rawDate).getTime();
  return Number.isFinite(date) && (!from || date >= new Date(`${from}T00:00:00+07:00`).getTime())
    && (!to || date <= new Date(`${to}T23:59:59.999+07:00`).getTime());
}

export function summarizePayments(payments) {
  const sum = (statuses) => payments.filter((p) => statuses.includes(p.rawStatus)).reduce((total, p) => total + p.amountValue, 0);
  const count = (statuses) => payments.filter((p) => statuses.includes(p.rawStatus)).length;
  const paid = sum(["PAID"]);
  const pending = sum(["PENDING", "PROCESSING"]);
  return [
    { value: formatMoney(paid), trend: `${payments.length} giao dịch`, sub: "theo bộ lọc, chỉ tính tiền đã thu" },
    { value: formatMoney(paid), trend: `${count(["PAID"])} giao dịch`, sub: "thành công" },
    { value: formatMoney(pending), trend: `${count(["PENDING", "PROCESSING"])} giao dịch`, sub: "chờ thanh toán / đang xử lý" },
    { value: formatMoney(sum(["REFUNDED"])), trend: `${count(["REFUNDED"])} giao dịch`, sub: "đã hoàn tiền" },
  ];
}
