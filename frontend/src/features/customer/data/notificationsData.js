import {
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Tag,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle
} from "lucide-react";

export const NOTIFICATION_CATEGORIES = [
  { id: "all", label: "Tất cả", icon: null },
  { id: "booking", label: "Lịch hẹn", icon: CalendarCheck, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "pet_care", label: "Sức khỏe thú cưng", icon: HeartPulse, color: "text-rose-600 bg-rose-50 border-rose-200" },
  { id: "payment", label: "Thanh toán", icon: CreditCard, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "promotion", label: "Khuyến mãi", icon: Tag, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "review", label: "Đánh giá", icon: Star, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "system", label: "Hệ thống", icon: ShieldCheck, color: "text-slate-600 bg-slate-50 border-slate-200" },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-2026-001",
    type: "booking",
    title: "Xác nhận lịch hẹn Grooming thành công!",
    message: "Lịch hẹn làm đẹp cho bé Milo tại Happy Pet - Chi nhánh Cầu Giấy vào lúc 14:00 - 16:00 (25/08/2026) đã được cơ sở phê duyệt.",
    detail: "Cơ sở Happy Pet đã chuẩn bị sẵn phòng chăm sóc và chuyên viên cho bé Milo. Vui lòng đưa bé đến trước giờ hẹn 5-10 phút để chuyên viên kiểm tra lông và da trước khi tắm sấy.",
    timeAgo: "15 phút trước",
    createdAt: "2026-10-11T21:30:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/booking-detail/BK20260825001",
    actionLabel: "Xem chi tiết lịch hẹn",
    petName: "Milo",
    petAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
    metadata: {
      bookingId: "BK20260825001",
      service: "Grooming & Cắt tỉa tạo kiểu",
      facility: "Happy Pet - Chi nhánh Cầu Giấy",
      appointmentTime: "14:00 - 16:00, 25/08/2026",
      price: "300.000đ"
    }
  },
  {
    id: "NOTIF-2026-002",
    type: "pet_care",
    title: "Nhắc nhở: Lịch tiêm phòng dại định kỳ cho bé Mimi",
    message: "Đã 11 tháng kể từ mũi tiêm vắc-xin dại gần nhất của Mimi. Hãy đặt lịch tiêm phòng bổ sung trước ngày 30/10 để đảm bảo an toàn cho bé.",
    detail: "Theo hướng dẫn của bác sĩ thú y, vắc-xin phòng bệnh dại và bệnh truyền nhiễm 4 bệnh ở mèo cần tiêm nhắc lại mỗi năm một lần. Đặt lịch sớm sẽ giúp bé Mimi duy trì miễn dịch bảo vệ tối đa.",
    timeAgo: "2 giờ trước",
    createdAt: "2026-10-11T19:45:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/booking?pet=Mimi&service=vaccine",
    actionLabel: "Đặt lịch tiêm ngay",
    petName: "Mimi",
    petAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
    metadata: {
      vaccineName: "Vắc-xin phòng Dại (Rabies) & 4 Bệnh mèo",
      dueDate: "30/10/2026",
      facilityRecommendation: "Bệnh viện Thú y 24/7 PetCare"
    }
  },
  {
    id: "NOTIF-2026-003",
    type: "promotion",
    title: "Ưu đãi độc quyền: Tặng mã PETCARE20 giảm 20% Spa cuối tuần",
    message: "Cuối tuần thảnh thơi dành cho bé cưng! Giảm ngay 20% tối đa 100.000đ cho mọi dịch vụ tắm sấy, spa và trông giữ khi đặt lịch qua app.",
    detail: "Mã giảm giá có hiệu lực từ thứ Sáu đến Chủ nhật tuần này. Áp dụng cho tất cả cơ sở đối tác trong hệ thống PetCare Booking. Số lượng lượt dùng có hạn!",
    timeAgo: "5 giờ trước",
    createdAt: "2026-10-11T16:20:00Z",
    isRead: false,
    priority: "normal",
    actionUrl: "/services",
    actionLabel: "Khám phá dịch vụ & Đặt ngay",
    metadata: {
      couponCode: "PETCARE20",
      discountValue: "20%",
      maxDiscount: "100.000đ",
      expiryDate: "Chủ nhật, 18/10/2026"
    }
  },
  {
    id: "NOTIF-2026-004",
    type: "booking",
    title: "Bé Milo đã hoàn thành dịch vụ làm đẹp!",
    message: "Chuyên viên tại Happy Pet đã hoàn tất buổi tắm sấy và cắt tỉa cho Milo. Bé đang nghỉ ngơi thư giãn tại phòng chờ, mời bạn ghé đón bé nhé!",
    detail: "Bé Milo rất ngoan và hợp tác trong suốt quá trình chăm sóc. Nhân viên đã xịt dưỡng lông hương lavender cao cấp và kiểm tra kẽ móng sạch sẽ.",
    timeAgo: "Hôm qua lúc 17:15",
    createdAt: "2026-10-10T17:15:00Z",
    isRead: true,
    priority: "normal",
    actionUrl: "/booking-detail/BK20260825001",
    actionLabel: "Xem trạng thái buổi hẹn",
    petName: "Milo",
    metadata: {
      bookingId: "BK20260825001",
      status: "Đã hoàn thành",
      notes: "Bé đã được massage và sấy thơm tho"
    }
  },
  {
    id: "NOTIF-2026-005",
    type: "payment",
    title: "Thanh toán thành công: Hóa đơn #TXN20260825001",
    message: "Giao dịch 300.000đ cho lịch hẹn BK20260825001 qua VNPAY-QR đã được xác nhận thành công. Cảm ơn bạn đã tin tưởng dịch vụ!",
    detail: "Biên lai thanh toán điện tử đã được ghi nhận vào hệ thống. Bạn có thể tra cứu lịch sử giao dịch và tải hóa đơn VAT bất cứ lúc nào.",
    timeAgo: "Hôm qua lúc 14:10",
    createdAt: "2026-10-10T14:10:00Z",
    isRead: true,
    priority: "normal",
    actionUrl: "/billing?txn=TXN20260825001",
    actionLabel: "Xem hóa đơn thanh toán",
    metadata: {
      transactionId: "TXN20260825001",
      amount: "300.000đ",
      paymentMethod: "VNPAY-QR",
      bookingId: "BK20260825001"
    }
  },
  {
    id: "NOTIF-2026-006",
    type: "review",
    title: "Mời bạn đánh giá: Dịch vụ Tắm Spa Thảo Dược của bé Mimi",
    message: "Trải nghiệm làm đẹp của Mimi tại PetSpa Deluxe thế nào? Hãy chia sẻ cảm nhận để nhận ngay 50 xu thưởng PetPoints tích lũy!",
    detail: "Đánh giá chân thực kèm hình ảnh của bạn sẽ giúp cộng đồng người yêu thú cưng có thêm gợi ý hữu ích và giúp cơ sở cải thiện chất lượng dịch vụ ngày một tốt hơn.",
    timeAgo: "3 ngày trước",
    createdAt: "2026-10-08T09:30:00Z",
    isRead: true,
    priority: "normal",
    actionUrl: "/reviews?tab=pending&bookingId=BK20260824002&action=write",
    actionLabel: "Viết đánh giá ngay (+50 xu)",
    petName: "Mimi",
    metadata: {
      bookingId: "BK20260824002",
      facilityName: "PetSpa Deluxe - Đống Đa",
      reward: "+50 PetPoints"
    }
  },
  {
    id: "NOTIF-2026-007",
    type: "pet_care",
    title: "Nhắc nhở: Lịch tẩy giun định kỳ cho bé Milo",
    message: "Đã 3 tháng kể từ lần tẩy giun gần nhất của Milo. Đừng quên cho bé dùng thuốc giun theo liều lượng bác sĩ để bảo vệ đường tiêu hóa.",
    detail: "Duy trì lịch tẩy giun 3 tháng/lần với chó trưởng thành giúp phòng ngừa các bệnh nguy hiểm từ ký sinh trùng đường ruột và lây nhiễm sang người.",
    timeAgo: "5 ngày trước",
    createdAt: "2026-10-06T10:00:00Z",
    isRead: true,
    priority: "normal",
    actionUrl: "/my-pets",
    actionLabel: "Xem sổ sức khỏe của bé",
    petName: "Milo",
    metadata: {
      petName: "Milo",
      careType: "Tẩy giun định kỳ (Deworming)",
      lastDate: "10/07/2026"
    }
  },
  {
    id: "NOTIF-2026-008",
    type: "system",
    title: "Nâng hạng thành viên Thân Thiết: Hạng Bạc (Silver Member)",
    message: "Chúc mừng bạn đã đạt 500 điểm tích lũy! Bạn được thăng hạng Silver và nhận ưu đãi giảm thêm 5% trọn đời cho mọi đơn đặt lịch.",
    detail: "Đặc quyền hạng Bạc: Tích lũy 1.5x PetPoints cho mỗi hóa đơn thanh toán, ưu tiên giữ chỗ vào khung giờ cao điểm và quà tặng sinh nhật bất ngờ cho bé cưng.",
    timeAgo: "1 tuần trước",
    createdAt: "2026-10-04T08:00:00Z",
    isRead: true,
    priority: "normal",
    actionUrl: "/profile",
    actionLabel: "Xem quyền lợi hạng Bạc",
    metadata: {
      memberTier: "Hạng Bạc (Silver)",
      accumulatedPoints: "520 PetPoints",
      discountPercent: "5%"
    }
  }
];

export const NOTIFICATION_TYPE_CONFIG = {
  booking: {
    label: "Lịch hẹn",
    icon: CalendarCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200"
  },
  pet_care: {
    label: "Sức khỏe thú cưng",
    icon: HeartPulse,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200"
  },
  payment: {
    label: "Thanh toán",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  promotion: {
    label: "Khuyến mãi",
    icon: Tag,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200"
  },
  review: {
    label: "Đánh giá",
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200"
  },
  system: {
    label: "Hệ thống",
    icon: ShieldCheck,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200"
  }
};
