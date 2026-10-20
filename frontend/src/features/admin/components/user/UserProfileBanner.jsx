import { useState } from "react";
import { Edit3, Send, Lock, Unlock, CalendarDays } from "lucide-react";

import { adminUserApi } from "../../services/adminUserApi";

const ROLE_CONFIG = {
  CUSTOMER: {
    label: "Khách hàng",
    className: "bg-blue-50 text-blue-600",
  },
  BUSINESS_OWNER: {
    label: "Chủ cơ sở",
    className: "bg-purple-50 text-purple-600",
  },
  ADMIN: {
    label: "Quản trị viên",
    className: "bg-amber-50 text-amber-600",
  },
};

function formatDate(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function UserProfileBanner({ user, onStatusChanged }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const displayName = user.fullName || "Chưa cập nhật tên";
  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;

  const isActive = user.status === "ACTIVE";
  const isAdmin = user.role === "ADMIN";

  const handleToggleStatus = async () => {
    if (isAdmin || isUpdating) return;

    const nextStatus = isActive ? "LOCKED" : "ACTIVE";
    const action = isActive ? "khóa" : "mở khóa";

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ${action} tài khoản "${displayName}" không?`,
    );

    if (!confirmed) return;

    setIsUpdating(true);
    setError("");

    try {
      const response = await adminUserApi.updateUserStatus(
        user._id,
        nextStatus,
      );

      if (!response.success || !response.data?.user) {
        throw new Error(
          response.message || "Không thể cập nhật trạng thái tài khoản",
        );
      }

      // Giữ nguyên dữ liệu chi tiết, chỉ cập nhật
      // những trường backend trả về
      onStatusChanged?.({
        ...user,
        ...response.data.user,
      });
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái tài khoản");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* LEFT - USER */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User information */}
          <div>
            <h1 className="text-base font-bold text-slate-900">
              {displayName}
            </h1>

            <p className="text-[11px] text-slate-400 mt-0.5">
              {user.email || "Chưa cập nhật email"}
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              {/* Role */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleConfig.className}`}
              >
                {roleConfig.label}
              </span>

              {/* Status */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                ● {isActive ? "Hoạt động" : "Đã khóa"}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER - JOIN DATE */}
        <div className="flex items-center gap-2 xl:mr-auto xl:ml-16">
          <CalendarDays size={16} className="text-slate-500" />

          <div>
            <p className="text-[10px] text-slate-500">Ngày tham gia:</p>

            <p className="text-[11px] font-semibold text-slate-700">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chỉnh sửa: chưa triển khai */}
          <button
            type="button"
            disabled
            title="Chức năng chỉnh sửa đang được phát triển"
            className="h-9 px-4 rounded-lg border border-emerald-300 text-emerald-600 bg-white text-xs font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
          >
            <Edit3 size={14} />
            Chỉnh sửa
          </button>

          {/* Gửi thông báo: chưa triển khai */}
          <button
            type="button"
            disabled
            title="Chức năng gửi thông báo đang được phát triển"
            className="h-9 px-4 rounded-lg border border-slate-300 text-slate-600 bg-white text-xs font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
          >
            <Send size={14} />
            Gửi thông báo
          </button>

          {/* Khóa / Mở khóa */}
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={isAdmin || isUpdating}
            title={
              isAdmin
                ? "Không thể thay đổi trạng thái tài khoản ADMIN"
                : isActive
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"
            }
            className={`h-9 px-4 rounded-lg border bg-white text-xs font-semibold flex items-center gap-2 ${
              isAdmin || isUpdating
                ? "border-slate-300 text-slate-400 opacity-50 cursor-not-allowed"
                : isActive
                  ? "border-red-300 text-red-500 hover:bg-red-50"
                  : "border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {isUpdating ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-emerald-600 animate-spin" />
            ) : isActive ? (
              <Lock size={14} />
            ) : (
              <Unlock size={14} />
            )}

            {isUpdating
              ? "Đang xử lý..."
              : isActive
                ? "Khóa tài khoản"
                : "Mở khóa"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs"
        >
          {error}
        </div>
      )}
    </div>
  );
}
