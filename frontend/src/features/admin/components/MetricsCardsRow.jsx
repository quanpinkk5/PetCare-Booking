import {
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";

import StatCard from "./StatCard";

const formatNumber = (value) => Number(value || 0).toLocaleString("vi-VN");

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function MetricsCardsRow({ metrics = {}, isLoading = false }) {
  const items = [
    {
      title: "Tổng người dùng",
      value: formatNumber(metrics.totalUsers),
      icon: Users,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Cơ sở hoạt động",
      value: formatNumber(metrics.activeBusinesses),
      icon: Building2,
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      title: "Chờ duyệt",
      value: formatNumber(metrics.pendingBusinesses),
      icon: Clock,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Tổng booking",
      value: formatNumber(metrics.totalBookings),
      icon: Calendar,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Doanh thu thanh toán",
      value: formatMoney(metrics.totalPaidRevenue),
      icon: DollarSign,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      isValueSmall: true,
    },
    {
      title: "Tổng đánh giá",
      value: formatNumber(metrics.totalReviews),
      icon: Star,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <StatCard
          key={item.title}
          {...item}
          value={isLoading ? "..." : item.value}
        />
      ))}
    </section>
  );
}
