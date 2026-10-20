
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Coins,
  Star,
} from "lucide-react";

import { adminUserApi } from "../../services/adminUserApi";

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("vi-VN");
};

const formatCurrency = (value) => {
  return `${formatNumber(value)} đ`;
};

export default function KPIMetricsRow({ user }) {
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setKpis(null);
    setError("");

    if (!user?._id || user.role !== "CUSTOMER") {
      setIsLoading(false);
      return;
    }

    const fetchKPIs = async () => {
      setIsLoading(true);

      try {
        const response = await adminUserApi.getUserKPIs(
          user._id,
        );

        if (cancelled) return;

        if (!response.data) {
          throw new Error("Không nhận được dữ liệu thống kê");
        }

        setKpis(response.data);
      } catch (err) {
        if (cancelled) return;

        setKpis(null);
        setError(
          err.message || "Không thể tải thống kê khách hàng",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchKPIs();

    return () => {
      cancelled = true;
    };
  }, [user?._id, user?.role]);

  const metrics = [
    {
      title: "Tổng booking",
      value: formatNumber(kpis?.totalBookings),
      icon: CalendarCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Booking hoàn thành",
      value: formatNumber(kpis?.completedBookings),
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Tổng chi tiêu",
      value: formatCurrency(kpis?.totalSpent),
      icon: Coins,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Số đánh giá",
      value: formatNumber(kpis?.totalReviews),
      icon: Star,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div>
      {/* THÔNG BÁO LỖI */}
      {error && (
        <div
          role="alert"
          className="mb-3 p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-600"
        >
          {error}
        </div>
      )}

      {/* GIỮ NGUYÊN BỐ CỤC 4 KPI TRÊN MỘT HÀNG */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4 min-h-[100px] min-w-0"
            >
              <div className="flex items-center gap-3.5 h-full">
                {/* ICON */}
                <div
                  className={`w-11 h-11 rounded-full ${metric.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                    className={metric.iconColor}
                  />
                </div>

                {/* INFORMATION */}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-500 font-medium leading-4">
                    {metric.title}
                  </p>

                  <p
                    className="text-[18px] font-bold text-slate-800 leading-6 mt-0.5 break-words"
                    title={isLoading ? "Đang tải..." : metric.value}
                  >
                    {isLoading
                      ? "..."
                      : error
                        ? "—"
                        : metric.value}
                  </p>

                  <p className="text-[9px] text-slate-400 mt-1">
                    Tổng cộng từ trước đến nay
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
