import {
  ShieldCheck,
  UserRound,
  Clock3,
  Monitor,
  Store,
  Shield,
} from "lucide-react";

const ROLE_CONFIG = {
  CUSTOMER: {
    label: "Khách hàng",
    Icon: UserRound,
    background: "bg-blue-50",
    iconColor: "text-blue-500",
  },

  BUSINESS_OWNER: {
    label: "Chủ cơ sở",
    Icon: Store,
    background: "bg-purple-50",
    iconColor: "text-purple-500",
  },

  ADMIN: {
    label: "Quản trị viên",
    Icon: Shield,
    background: "bg-amber-50",
    iconColor: "text-amber-500",
  },
};
const formatDateTime = (value) => {
  if (!value) return "Chưa từng đăng nhập";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có dữ liệu";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
};
export default function AccountStatusCard({ user, sessionStats }) {
  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] || {
    label: "Không xác định",
    Icon: UserRound,
    background: "bg-slate-100",
    iconColor: "text-slate-500",
  };

  const RoleIcon = roleConfig.Icon;

  const isActive = user.status === "ACTIVE";
  const isLocked = user.status === "LOCKED";

  const statusLabel = isActive
    ? "Hoạt động"
    : isLocked
      ? "Đã khóa"
      : "Không xác định";

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
          <ShieldCheck size={15} className="text-emerald-600" />
        </div>

        <h3 className="text-sm font-bold text-slate-800">
          Trạng thái tài khoản
        </h3>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          {/* VAI TRÒ */}
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5">Vai trò</p>

            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full ${roleConfig.background} flex items-center justify-center`}
              >
                <RoleIcon size={12} className={roleConfig.iconColor} />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                {roleConfig.label}
              </span>
            </div>
          </div>

          {/* TRẠNG THÁI */}
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5">Trạng thái</p>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive
                    ? "bg-emerald-500"
                    : isLocked
                      ? "bg-red-500"
                      : "bg-slate-400"
                }`}
              />

              <span
                className={`text-xs font-semibold ${
                  isActive
                    ? "text-emerald-600"
                    : isLocked
                      ? "text-red-600"
                      : "text-slate-500"
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          {/* PHIÊN ĐĂNG NHẬP GẦN NHẤT */}
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5">
              Phiên đăng nhập gần nhất
            </p>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock3 size={12} className="text-slate-500" />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                {sessionStats
                  ? formatDateTime(sessionStats.lastLoginAt)
                  : "Chưa có dữ liệu"}
              </span>
            </div>
          </div>

          {/* SỐ PHIÊN HOẠT ĐỘNG */}
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5">
              Số phiên hoạt động
            </p>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                <Monitor size={12} className="text-purple-500" />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                {sessionStats
                  ? `${sessionStats.activeSessionCount} phiên`
                  : "Chưa có dữ liệu"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
