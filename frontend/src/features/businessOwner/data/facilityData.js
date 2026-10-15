import {
  GitFork,
  Sparkles,
  Users,
  Building2,
  Tag,
  FileText,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  Award,
  Clock,
  UserCheck,
} from "lucide-react";

export const STATS = [
  {
    id: "branches",
    label: "Tổng chi nhánh",
    value: "3 Chi nhánh",
    subtext: "Đang hoạt động tại HN",
    icon: GitFork,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    hover: "hover:border-emerald-200 hover:shadow-md",
    hasStar: false,
  },
  {
    id: "services",
    label: "Dịch vụ cung cấp",
    value: "28 Dịch vụ",
    subtext: "Grooming, Spa, Y tế, Khách sạn",
    icon: Sparkles,
    bg: "bg-blue-50",
    text: "text-blue-600",
    hover: "hover:border-blue-200 hover:shadow-md",
    hasStar: false,
  },
  {
    id: "rating",
    label: "Đánh giá cơ sở",
    value: "4.9",
    subtext: "180+ lượt đánh giá",
    icon: Award,
    bg: "bg-amber-50",
    text: "text-amber-600",
    hover: "hover:border-amber-200 hover:shadow-md",
    hasStar: true,
  },
  {
    id: "staff",
    label: "Đội ngũ nhân sự",
    value: "16 Nhân viên",
    subtext: "Bác sĩ thú y & KTV Spa",
    icon: Users,
    bg: "bg-purple-50",
    text: "text-purple-600",
    hover: "hover:border-purple-200 hover:shadow-md",
    hasStar: false,
  },
];

export const FACILITY_INFO = [
  {
    label: "Tên cơ sở",
    value: "Happy Pet - Cầu Giấy",
    icon: Building2,
  },
  {
    label: "Mã cơ sở",
    value: "HP-CG-001",
    icon: Tag,
  },
  {
    label: "Loại hình",
    value: "Phòng khám thú y & Spa chăm sóc thú cưng",
    icon: Sparkles,
  },
  {
    label: "Giấy phép KD",
    value: "GPKD-2024-HN/089",
    icon: FileText,
  },
  {
    label: "Ngày thành lập",
    value: "22/05/2024",
    icon: Calendar,
  },
  {
    label: "Trạng thái",
    value: "Đã xác thực & Đang hoạt động",
    icon: ShieldCheck,
  },
];

export const FACILITY_DESCRIPTION =
  "Happy Pet - Cầu Giấy cung cấp các dịch vụ chăm sóc thú cưng chuyên nghiệp với đội ngũ yêu thú cưng và không gian thân thiện. Cơ sở được trang bị thiết bị y tế hiện đại, phòng spa vô trùng và khu vực lưu trú đạt tiêu chuẩn quốc tế.";

export const CONTACT_INFO = [
  {
    label: "Hotline",
    value: "0988 777 666",
    icon: Phone,
  },
  {
    label: "Email",
    value: "petspa.caugiay@gmail.com",
    icon: Mail,
  },
  {
    label: "Website",
    value: "www.happypet.vn",
    icon: Globe,
  },
  {
    label: "Địa chỉ",
    value: "Số 88 Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    icon: MapPin,
  },
  {
    label: "Mạng xã hội",
    value: "facebook.com/happypet.caugiay",
    icon: Share2,
  },
];

export const QUICK_INFO = [
  {
    label: "Trạng thái hoạt động",
    value: "Đang mở cửa",
    icon: ShieldCheck,
    isBadge: true,
  },
  {
    label: "Người quản lý",
    icon: UserCheck,
    isManager: true,
    managerName: "Nguyễn Văn An",
    managerEmail: "petspa.caugiay@gmail.com",
    managerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    label: "Khu vực hoạt động",
    value: "Cầu Giấy, Hà Nội",
    icon: MapPin,
  },
  {
    label: "Hạng đối tác",
    value: "Đối tác Kim Cương 💎",
    icon: Award,
  },
  {
    label: "Thời gian phản hồi",
    value: "< 5 phút (98%)",
    icon: Clock,
  },
];

export const SCHEDULE = [
  { day: "Thứ 2 - Thứ 6", time: "08:00 - 20:30" },
  { day: "Thứ 7", time: "08:00 - 21:00" },
  { day: "Chủ nhật", time: "08:30 - 20:30" },
  { day: "Ngày lễ, Tết", time: "09:00 - 18:00" },
];

export const GALLERY = [
  "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=80",
];

export const POLICIES = [
  "Thú cưng cần được tiêm phòng bệnh dại và bệnh truyền nhiễm cơ bản trước khi spa/khách sạn.",
  "Khách hàng vui lòng đặt hẹn trước tối thiểu 1 giờ để đảm bảo không phải chờ đợi.",
  "Miễn phí kiểm tra lông da và vệ sinh móng cơ bản khi sử dụng dịch vụ Grooming toàn diện.",
  "Bảo hành dịch vụ tạo kiểu trong vòng 24 giờ kể từ khi hoàn tất dịch vụ.",
  "Cam kết môi trường sạch sẽ vô trùng 100%, khử khuẩn buồng phòng mỗi ngày.",
];

export const FACILITY_NOTE =
  "Vui lòng thông báo trước với lễ tân nếu bé có tiền sử hung dữ, bệnh tim, hen suyễn hoặc dị ứng hóa chất spa để chuyên viên chuẩn bị quy trình chăm sóc đặc biệt.";
