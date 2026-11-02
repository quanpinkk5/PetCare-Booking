import {
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Tag,
  ShieldCheck,
  Star,
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
