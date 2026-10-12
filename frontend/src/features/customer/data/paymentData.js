import { QrCode, Wallet, Landmark, Banknote } from "lucide-react";

export const bookingData = {
  bookingCode: "BK20260825001",
  petName: "Milo",
  petBreed: "Poodle (2 tuổi)",
  serviceName: "Grooming & Cắt tỉa tạo kiểu",
  facilityName: "Happy Pet - Chi nhánh Cầu Giấy",
  bookingDate: "25/08/2026",
  bookingTime: "14:00 - 16:00",
  customerName: "Nguyễn Văn A",
  customerPhone: "0987 654 321",
  customerEmail: "nguyenvana@gmail.com",
  basePrice: 300000,
  platformFee: 15000,
};

export const discountCodes = {
  PETCARE10: 30000,
  FREESHIP: 15000,
  GIAM50K: 50000,
  PETCARE20: 60000,
};

export const paymentMethods = [
  {
    id: "vnpay",
    name: "VNPay / VNPAY-QR",
    description: "Quét mã VNPAY-QR qua ứng dụng ngân hàng hoặc ví điện tử VNPay",
    icon: QrCode,
  },
  {
    id: "momo",
    name: "Ví điện tử MoMo",
    description: "Thanh toán siêu tốc an toàn qua ứng dụng ví MoMo",
    icon: Wallet,
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản nhanh 24/7 qua số tài khoản hoặc mã QR Napas247",
    icon: Landmark,
  },
  {
    id: "cash",
    name: "Thanh toán tại cơ sở",
    description: "Thanh toán bằng tiền mặt hoặc thẻ khi đến cơ sở chăm sóc",
    icon: Banknote,
  },
];
