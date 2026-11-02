import {
  CreditCard,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";

export const METRICS_DATA = [
  {
    id: "total_revenue",
    title: "Tổng doanh thu",
    trendColor: "text-emerald-600",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    icon: CreditCard,
  },
  {
    id: "successful_payments",
    title: "Đã thanh toán",
    trendColor: "text-emerald-600",
    bg: "bg-blue-50",
    color: "text-blue-600",
    icon: CheckCircle2,
  },
  {
    id: "pending_payments",
    title: "Chờ thanh toán",
    trendColor: "text-amber-600",
    bg: "bg-amber-50",
    color: "text-amber-600",
    icon: Clock,
  },
  {
    id: "refunds",
    title: "Hoàn tiền",
    trendColor: "text-slate-400",
    bg: "bg-purple-50",
    color: "text-purple-600",
    icon: RotateCcw,
  },
];
