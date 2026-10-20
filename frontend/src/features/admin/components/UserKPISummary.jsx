
import {
  Users,
  User,
  Store,
  ShieldCheck,
  Lock,
} from "lucide-react";

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("vi-VN");

export default function UserKPISummary({
  statistics,
  isLoading = false,
}) {
  const kpis = [
    {
      title: "Tổng người dùng",
      value: statistics?.totalUsers,
      icon: Users,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Khách hàng",
      value: statistics?.totalCustomers,
      icon: User,
      bgColor: "bg-sky-50",
      textColor: "text-sky-500",
    },
    {
      title: "Chủ cơ sở",
      value: statistics?.totalBusinessOwners,
      icon: Store,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Quản trị viên",
      value: statistics?.totalAdmins,
      icon: ShieldCheck,
      bgColor: "bg-amber-50",
      textColor: "text-amber-500",
    },
    {
      title: "Tài khoản bị khóa",
      value: statistics?.lockedUsers,
      icon: Lock,
      bgColor: "bg-red-50",
      textColor: "text-red-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.title}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5"
          >
            <div
              className={`w-12 h-12 rounded-xl ${kpi.bgColor} ${kpi.textColor} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <span className="text-xs text-slate-500 font-medium truncate block">
                {kpi.title}
              </span>

              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {isLoading
                  ? "..."
                  : statistics
                    ? formatNumber(kpi.value)
                    : "—"}
              </h3>

              <span className="text-[11px] font-normal text-slate-400 block mt-0.5">
                Tổng cộng trong hệ thống
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
