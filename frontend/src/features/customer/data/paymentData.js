import { QrCode, Wallet, Landmark, Banknote } from "lucide-react";

export const bookingData = {
  bookingCode: "BK20260825001",
  petName: "Milo",
  petBreed: "Golden Retriever (2 tuổi)",
  serviceName: "Grooming & Cắt tỉa tạo kiểu",
  facilityName: "Happy Pet - Chi nhánh Cầu Giấy",
  facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
  facilityPhone: "0988 123 456",
  bookingDate: "25/08/2026",
  bookingTime: "14:00 - 16:00",
  customerName: "Nguyễn Văn An",
  customerPhone: "0912 345 678",
  customerEmail: "nguyenvanan@gmail.com",
  customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
  basePrice: 300000,
  platformFee: 15000,
};

export const discountCodes = {
  PETCARE10: 30000,
  FREESHIP: 15000,
  GIAM50K: 50000,
  PETCARE20: 60000,
};

export const availableCoupons = [
  {
    code: "PETCARE10",
    discount: 30000,
    title: "Giảm 30.000đ",
    description: "Áp dụng cho mọi dịch vụ spa & chăm sóc thú cưng",
    badge: "Phổ biến nhất",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    expiry: "30/11/2026",
  },
  {
    code: "FREESHIP",
    discount: 15000,
    title: "Miễn phí tiện ích 15.000đ",
    description: "Miễn 100% phí dịch vụ & bảo hiểm an toàn",
    badge: "Tiết kiệm",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    expiry: "31/12/2026",
  },
  {
    code: "GIAM50K",
    discount: 50000,
    title: "Giảm sâu 50.000đ",
    description: "Ưu đãi cho đơn đặt lịch chăm sóc tổng hợp",
    badge: "Hot Deal",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    expiry: "15/12/2026",
  },
  {
    code: "PETCARE20",
    discount: 60000,
    title: "Voucher VIP 60.000đ",
    description: "Đặc quyền tri ân dành riêng cho thành viên Bạc",
    badge: "Hạng Bạc+",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    expiry: "20/12/2026",
  },
];

export const bankTransferDetails = {
  bankName: "MB Bank (Ngân hàng TMCP Quân Đội)",
  accountNumber: "8888 6688 9999",
  accountHolder: "CONG TY CP PETCARE BOOKING VIET NAM",
  branch: "Hà Nội",
  qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0912345678|CONG%20TY%20CP%20PETCARE|billing@petcare.vn|0|0|",
};

export const paymentMethods = [
  {
    id: "vnpay",
    name: "VNPay / VNPAY-QR",
    tag: "Khuyên dùng",
    tagColor: "bg-blue-100 text-blue-700",
    description: "Quét mã VNPAY-QR qua ứng dụng ngân hàng hoặc ví điện tử VNPay",
    icon: QrCode,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    ringColor: "ring-blue-500/30",
  },
  {
    id: "momo",
    name: "Ví điện tử MoMo",
    tag: "Siêu tốc",
    tagColor: "bg-pink-100 text-pink-700",
    description: "Thanh toán siêu tốc, an toàn qua ứng dụng ví điện tử MoMo",
    icon: Wallet,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-500",
    ringColor: "ring-pink-500/30",
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng 24/7",
    tag: "Miễn phí",
    tagColor: "bg-emerald-100 text-emerald-700",
    description: "Chuyển khoản nhanh 24/7 qua số tài khoản hoặc mã QR Napas247",
    icon: Landmark,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    ringColor: "ring-emerald-500/30",
  },
  {
    id: "cash",
    name: "Thanh toán tại cơ sở",
    tag: "Linh hoạt",
    tagColor: "bg-amber-100 text-amber-800",
    description: "Thanh toán bằng tiền mặt hoặc quẹt thẻ khi đưa bé đến cơ sở",
    icon: Banknote,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
    ringColor: "ring-amber-500/30",
  },
];
