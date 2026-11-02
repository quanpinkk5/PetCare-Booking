import {
  Building2,
  GitFork,
  Sparkles,
  Layers,
  CalendarDays,
  CalendarCheck,
  Home,
  BookHeart,
  CreditCard,
  MessageSquare,
  Star,
  Bell,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "profile",
    label: "Hồ sơ cơ sở",
    path: "/business/profile",
    icon: Building2,
  },
  {
    id: "branches",
    label: "Chi nhánh",
    path: "/business/branches",
    icon: GitFork,
  },
  {
    id: "services",
    label: "Dịch vụ",
    path: "/business/services",
    icon: Sparkles,
  },
  {
    id: "branch-services",
    label: "Dịch vụ chi nhánh",
    path: "/business/branch-services",
    icon: Layers,
  },
  {
    id: "schedule",
    label: "Lịch làm việc",
    path: "/business/schedule",
    icon: CalendarDays,
  },
  {
    id: "bookings",
    label: "Đặt lịch",
    path: "/business/bookings",
    icon: CalendarCheck,
  },
  {
    id: "boarding",
    label: "Lưu trú",
    path: "/business/boarding",
    icon: Home,
  },
  {
    id: "pet-diary",
    label: "Nhật ký thú cưng",
    path: "/business/pet-diary",
    icon: BookHeart,
  },
  {
    id: "payments",
    label: "Thanh toán",
    path: "/business/payments",
    icon: CreditCard,
  },
  {
    id: "messages",
    label: "Tin nhắn",
    path: "/business/messages",
    icon: MessageSquare,
  },
  {
    id: "reviews",
    label: "Đánh giá",
    path: "/business/reviews",
    icon: Star,
  },
  {
    id: "notifications",
    label: "Thông báo",
    path: "/business/notifications",
    icon: Bell,
  },
];
