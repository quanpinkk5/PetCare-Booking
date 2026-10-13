import {
  GitFork,
  CheckCircle2,
  Sparkles,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

export const METRICS = [
  {
    id: "total_branches",
    label: "Tổng chi nhánh",
    value: "3",
    subtext: "chi nhánh",
    icon: GitFork,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    hover: "hover:border-emerald-300",
  },
  {
    id: "active_branches",
    label: "Đang hoạt động",
    value: "3/3",
    subtext: "chi nhánh mở cửa",
    icon: CheckCircle2,
    bg: "bg-teal-50",
    text: "text-teal-600",
    hover: "hover:border-teal-300",
  },
];

export const TOTAL_BOOKINGS = {
  value: "1.250",
  growth: "+15.8%",
};

export const BRANCHES = [
  {
    id: "BR001",
    name: "Happy Pet - Cầu Giấy",
    address: "Số 12 Dịch Vọng Hậu, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    district: "Cầu Giấy",
    phone: "0912 345 678",
    img: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80",
    imgClass: "",
    isHighlight: true,
    hours: "08:00 - 21:00",
    days: "Thứ 2 - Chủ nhật",
    services: 24,
    bookings: 520,
    trend: "up",
    trendVal: "+14.2%",
    status: "Đang hoạt động",
    statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    id: "BR002",
    name: "Happy Pet - Hà Đông",
    address: "Số 88 Quang Trung, Quang Trung, Hà Đông, Hà Nội",
    district: "Hà Đông",
    phone: "0988 234 567",
    img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80",
    imgClass: "",
    isHighlight: false,
    hours: "08:00 - 21:00",
    days: "Thứ 2 - Chủ nhật",
    services: 18,
    bookings: 410,
    trend: "up",
    trendVal: "+8.5%",
    status: "Đang hoạt động",
    statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    id: "BR003",
    name: "Happy Pet - Thanh Xuân",
    address: "Số 45 Nguyễn Trãi, Khương Trung, Thanh Xuân, Hà Nội",
    district: "Thanh Xuân",
    phone: "0904 567 890",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80",
    imgClass: "",
    isHighlight: false,
    hours: "08:30 - 20:30",
    days: "Thứ 2 - Chủ nhật",
    services: 16,
    bookings: 320,
    trend: "down",
    trendVal: "-2.1%",
    status: "Đang hoạt động",
    statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export const ALERTS = [
  {
    id: 1,
    branch: "Happy Pet - Cầu Giấy",
    desc: "Lượng đặt lịch Spa cuối tuần đạt 95% công suất, cần bổ sung thêm kỹ thuật viên.",
  },
  {
    id: 2,
    branch: "Happy Pet - Hà Đông",
    desc: "Có 2 phản hồi mới từ khách hàng cần xem và xử lý trong vòng 24 giờ.",
  },
  {
    id: 3,
    branch: "Happy Pet - Thanh Xuân",
    desc: "Phòng lưu trú khách sạn VIP gần kín chỗ cho kỳ nghỉ lễ sắp tới.",
  },
];

export const TIPS = [
  {
    id: 1,
    icon: Sparkles,
    desc: "Đồng bộ bảng giá và danh mục dịch vụ giữa các chi nhánh giúp tăng độ tin cậy và sự hài lòng của khách hàng.",
  },
  {
    id: 2,
    icon: CalendarCheck,
    desc: "Cập nhật chính xác khung giờ hoạt động và thông báo dịp lễ trên trang công khai để khách chủ động đặt lịch.",
  },
  {
    id: 3,
    icon: TrendingUp,
    desc: "Thường xuyên theo dõi phân bổ booking giữa các chi nhánh để tối ưu việc điều phối nhân sự và trang thiết bị.",
  },
];
