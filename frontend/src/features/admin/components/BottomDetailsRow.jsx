import { Link } from "react-router-dom";

import {
  Building2,
  Check,
  Plus,
  Users,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CreditCard,
  Star,
} from "lucide-react";

// ========================================
// FORMAT NGÀY GIỜ VIỆT NAM
// ========================================
const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

// ========================================
// CẤU HÌNH ICON HOẠT ĐỘNG
// ========================================
const ACTIVITY_CONFIG = {
  BUSINESS_CREATED: {
    icon: Building2,
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  BOOKING_CREATED: {
    icon: Calendar,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  BOOKING_COMPLETED: {
    icon: Check,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  USER_CREATED: {
    icon: Users,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  PAYMENT_PAID: {
    icon: CreditCard,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  REVIEW_CREATED: {
    icon: Star,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
};

const getActivityConfig = (type) =>
  ACTIVITY_CONFIG[type] || {
    icon: AlertTriangle,
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
  };

const getActivityLink = (activity) => {
  if (!activity.referenceId) return null;

  const id = activity.referenceId;

  switch (activity.referenceType) {
    case "BUSINESS":
      return `/admin/facilities/${id}`;

    case "BOOKING":
      return `/admin/bookings/${id}`;

    case "USER":
      return `/admin/users/${id}`;

    case "PAYMENT":
      // Trang Payment hiện dùng modal chi tiết,
      // chưa có route /admin/payments/:id.
      return "/admin/payments";

    case "REVIEW":
      // Trang Review hiện dùng modal chi tiết.
      return "/admin/reviews";

    default:
      return null;
  }
};

export default function BottomDetailsRow({
  pendingBusinesses = [],
  pendingTotal = 0,
  activities = [],
  isLoading = false,
}) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ====================================
          PENDING BUSINESSES
      ===================================== */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-6">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Cơ sở chờ duyệt{" "}
              <span className="text-xs font-normal text-slate-400">
                ({Number(pendingTotal || 0).toLocaleString("vi-VN")})
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-medium text-slate-400">
                  <th className="pb-2.5 font-medium">Cơ sở</th>

                  <th className="pb-2.5 font-medium">Chủ cơ sở</th>

                  <th className="pb-2.5 font-medium">Dịch vụ chính</th>

                  <th className="pb-2.5 font-medium">Đăng ký lúc</th>

                  <th className="pb-2.5 text-center font-medium">Trạng thái</th>

                  <th className="pb-2.5 text-right font-medium">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      Đang tải cơ sở chờ duyệt...
                    </td>
                  </tr>
                ) : pendingBusinesses.length > 0 ? (
                  pendingBusinesses.map((item) => {
                    const mainServices = Array.isArray(item.mainServices)
                      ? item.mainServices.join(", ")
                      : "";

                    return (
                      <tr
                        key={item._id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        {/* CƠ SỞ */}
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {item.logo ? (
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="h-7 w-7 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Building2 className="h-4 w-4" />
                              </div>
                            )}

                            <span className="font-medium text-slate-800">
                              {item.name || "—"}
                            </span>
                          </div>
                        </td>

                        {/* OWNER */}
                        <td className="py-3 text-slate-600">
                          {item.owner?.fullName || "—"}
                        </td>

                        {/* SERVICE */}
                        <td className="py-3 text-slate-500">
                          {mainServices || "—"}
                        </td>

                        {/* CREATED AT */}
                        <td className="whitespace-nowrap py-3 text-slate-400">
                          {formatDateTime(item.createdAt)}
                        </td>

                        {/* STATUS */}
                        <td className="py-3 text-center">
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                            Chờ duyệt
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="space-x-1 whitespace-nowrap py-3 text-right">
                          <Link
                            to={`/admin/facilities/${item._id}`}
                            className="inline-block rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 transition hover:bg-slate-100"
                          >
                            Xem
                          </Link>

                          <Link
                            to={`/admin/facilities/${item._id}`}
                            className="inline-block rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-emerald-700"
                            title="Mở chi tiết để phê duyệt cơ sở"
                          >
                            Duyệt
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      Không có cơ sở nào đang chờ duyệt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link
            to="/admin/facilities"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Xem tất cả cơ sở chờ duyệt
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ====================================
          RECENT ACTIVITIES
      ===================================== */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-6">
        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-800">
            Hoạt động gần đây
          </h3>

          <div className="space-y-4">
            {isLoading ? (
              <p className="py-10 text-center text-xs text-slate-400">
                Đang tải hoạt động gần đây...
              </p>
            ) : activities.length > 0 ? (
              activities.map((activity) => {
                const config = getActivityConfig(activity.type);

                const Icon = config.icon;

                const targetLink = getActivityLink(activity);

                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    {/* ICON */}
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bgColor} ${config.textColor}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      {targetLink ? (
                        <Link
                          to={targetLink}
                          className="text-xs font-medium leading-snug text-slate-800 transition-colors hover:text-emerald-600"
                        >
                          {activity.text}
                        </Link>
                      ) : (
                        <p className="text-xs font-medium leading-snug text-slate-800">
                          {activity.text}
                        </p>
                      )}

                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-10 text-center text-xs text-slate-400">
                Chưa có hoạt động nào.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link
            to="/admin/notifications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Xem thông báo hệ thống
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
