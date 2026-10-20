import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const ROLE_CONFIG = [
  {
    role: "CUSTOMER",
    label: "Khách hàng",
    color: "#3b82f6",
    dotColor: "bg-blue-500",
  },
  {
    role: "BUSINESS_OWNER",
    label: "Chủ cơ sở",
    color: "#8b5cf6",
    dotColor: "bg-purple-500",
  },
  {
    role: "ADMIN",
    label: "Quản trị viên",
    color: "#f59e0b",
    dotColor: "bg-amber-500",
  },
];

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("vi-VN");

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export default function UserRightWidgets({
  statistics,
  isLoading = false,
}) {
  const totalUsers = statistics?.totalUsers ?? 0;
  const recentUsers = statistics?.recentUsers ?? [];

  // Lấy số lượng của từng vai trò từ API
  const distribution = ROLE_CONFIG.map((config) => {
    const item = statistics?.roleDistribution?.find(
      (entry) => entry.role === config.role
    );

    return {
      ...config,
      count: item?.count ?? 0,
      percentage:
        totalUsers > 0
          ? ((item?.count ?? 0) / totalUsers) * 100
          : 0,
    };
  });

  // Tính điểm bắt đầu của từng phần trên vòng tròn
  let accumulatedPercentage = 0;

  const donutSegments = distribution.map((item) => {
    const offset = accumulatedPercentage;
    accumulatedPercentage += item.percentage;

    return {
      ...item,
      offset,
    };
  });

  return (
    <div className="xl:col-span-4 2xl:col-span-3 space-y-5">
      {/* Role Distribution */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-4">
          Phân bố theo vai trò
        </h4>

        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 36 36"
              role="img"
              aria-label="Biểu đồ phân bố người dùng theo vai trò"
            >
              <circle
                cx="18"
                cy="18"
                r="14.32"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="3.8"
              />

              {!isLoading &&
                donutSegments.map((segment) => (
                  <circle
                    key={segment.role}
                    cx="18"
                    cy="18"
                    r="14.32"
                    pathLength="100"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="3.8"
                    strokeDasharray={`${segment.percentage} ${
                      100 - segment.percentage
                    }`}
                    strokeDashoffset={-segment.offset}
                  />
                ))}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-slate-400 font-medium">
                Tổng
              </span>

              <span className="text-xs font-bold text-slate-800 leading-tight">
                {isLoading
                  ? "..."
                  : statistics
                    ? formatNumber(totalUsers)
                    : "—"}
              </span>

              <span className="text-[9px] text-slate-400 leading-none">
                người dùng
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs flex-1 min-w-0">
            {distribution.map((item) => (
              <div
                key={item.role}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor}`}
                  />
                  {item.label}
                </span>

                <span className="font-bold text-slate-800 text-[11px] whitespace-nowrap">
                  {isLoading
                    ? "..."
                    : statistics
                      ? formatNumber(item.count)
                      : "—"}{" "}
                  <span className="font-normal text-slate-400 text-[10px]">
                    {isLoading || !statistics
                      ? ""
                      : `(${item.percentage.toFixed(1)}%)`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Users */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-slate-800 text-sm">
            Người dùng mới đăng ký
          </h4>

        </div>

        <div className="space-y-3.5 divide-y divide-slate-50">
          {isLoading ? (
            <p className="py-4 text-xs text-slate-400 text-center">
              Đang tải người dùng mới...
            </p>
          ) : recentUsers.length === 0 ? (
            <p className="py-4 text-xs text-slate-400 text-center">
              {statistics
                ? "Chưa có người dùng nào"
                : "Không thể tải danh sách người dùng"}
            </p>
          ) : (
            recentUsers.map((item, idx) => (
              <div
                key={item._id}
                className={`flex items-center justify-between ${
                  idx === 0 ? "pt-1" : "pt-2.5"
                }`}
              >
                <Link
                  to={`/admin/users/${item._id}`}
                  className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
                  title="Xem chi tiết tài khoản"
                >
                  <UserAvatar
                    avatar={item.avatar}
                    name={item.fullName}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {item.fullName || "Chưa cập nhật tên"}
                    </p>

                    <p className="text-[10px] text-slate-400 truncate">
                      {item.email}
                    </p>
                  </div>
                </Link>

                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
