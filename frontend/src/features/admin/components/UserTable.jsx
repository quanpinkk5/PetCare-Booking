import { useEffect, useState } from "react";
import {
  MoreVertical,
  Eye,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminUserApi } from "../services/adminUserApi";
import UserAvatar from "./UserAvatar";
// Hiển thị vai trò theo thiết kế cũ
const ROLE_CONFIG = {
  CUSTOMER: {
    label: "Khách hàng",
    className: "bg-sky-50 text-sky-700 border-sky-200",
    Icon: UserCheck,
  },
  BUSINESS_OWNER: {
    label: "Chủ cơ sở",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    Icon: Store,
  },
  ADMIN: {
    label: "Quản trị viên",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: Shield,
  },
};

// Ngày tạo tài khoản hiển thị theo giờ Việt Nam
const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const PAGE_SIZE = 10;

export default function UserTable({ filters, onStatusChanged }) {
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Reset về trang 1 khi Admin thay đổi bộ lọc
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Lấy danh sách người dùng từ MongoDB
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminUserApi.getUsers({
          search: filters?.search || "",
          role: filters?.role || "all",
          status: filters?.status || "all",
          timeRange: filters?.timeRange || "all",
          startDate: filters?.startDate || "",
          endDate: filters?.endDate || "",
          page,
          limit: PAGE_SIZE,
        });

        if (cancelled) return;

        setUsers(response.data?.users || []);

        setPagination(
          response.data?.pagination || {
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        if (cancelled) return;

        setUsers([]);
        setPagination({
          page,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        });

        setError(err.message || "Không thể tải danh sách người dùng");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  // Chuyển trang
  const changePage = (nextPage) => {
    if (
      isLoading ||
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const totalPages = pagination.totalPages;
  const total = pagination.total;

  const startItem = total === 0 ? 0 : (pagination.page - 1) * PAGE_SIZE + 1;

  const endItem =
    total === 0 ? 0 : Math.min(pagination.page * PAGE_SIZE, total);

  const handleToggleStatus = async (user) => {
    // Không cho thao tác trên tài khoản ADMIN
    if (user.role === "ADMIN") {
      setError("Không được khóa hoặc mở khóa tài khoản ADMIN.");
      return;
    }

    const nextStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

    const action = nextStatus === "LOCKED" ? "khóa" : "mở khóa";

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${action} tài khoản "${user.fullName}" không?`,
    );

    if (!confirmed) return;

    setUpdatingUserId(user._id);
    setError("");

    try {
      const response = await adminUserApi.updateUserStatus(
        user._id,
        nextStatus,
      );

      // Chỉ cập nhật bảng sau khi backend trả thành công
      if (response.success) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === user._id
              ? {
                  ...item,
                  status: response.data.user.status,
                }
              : item,
          ),
        );

        // Yêu cầu UserList cập nhật KPI và biểu đồ
        onStatusChanged?.();
      }
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái tài khoản");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="xl:col-span-8 2xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
      <div>
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Danh sách tài khoản{" "}
              <span className="text-xs font-normal text-slate-400">
                ({total} người dùng)
              </span>
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý phân quyền và trạng thái người dùng trong hệ thống
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-medium bg-slate-50/50">
                <th className="py-3 px-5 font-medium">Người dùng</th>

                <th className="py-3 px-4 font-medium">Vai trò</th>

                <th className="py-3 px-4 font-medium">Số điện thoại</th>

                <th className="py-3 px-4 font-medium">Ngày tham gia</th>

                <th className="py-3 px-4 font-medium text-center">
                  Trạng thái
                </th>

                <th className="py-3 px-5 font-medium text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-sm"
                  >
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => {
                  const roleConfig =
                    ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;

                  const RoleIcon = roleConfig.Icon;

                  const isActive = user.status === "ACTIVE";

                  const displayName = user.fullName || "Chưa cập nhật tên";

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <UserAvatar avatar={user.avatar} name={displayName} />

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {displayName}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${roleConfig.className}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {roleConfig.label}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {user.phone || "Chưa cập nhật"}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Xem chi tiết */}
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Khóa/mở khóa: chờ API thật */}

                          {/* Khóa / Mở khóa tài khoản */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            disabled={
                              updatingUserId !== null || user.role === "ADMIN"
                            }
                            className={`p-1.5 rounded-lg border transition-colors ${
                              user.role === "ADMIN" || updatingUserId !== null
                                ? "border-slate-200 text-slate-300 opacity-50 cursor-not-allowed"
                                : isActive
                                  ? "border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 cursor-pointer"
                                  : "border-emerald-200 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100/50 cursor-pointer"
                            }`}
                            title={
                              user.role === "ADMIN"
                                ? "Không thể thay đổi trạng thái tài khoản ADMIN"
                                : isActive
                                  ? "Khóa tài khoản"
                                  : "Mở khóa tài khoản"
                            }
                          >
                            {updatingUserId === user._id ? (
                              <span className="block w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-emerald-600 animate-spin" />
                            ) : isActive ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Thao tác khác: chờ triển khai */}
                          <button
                            type="button"
                            disabled
                            className="p-1.5 rounded-lg text-slate-400 opacity-50 cursor-not-allowed"
                            title="Chức năng đang được phát triển"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-sm"
                  >
                    {error
                      ? "Không thể tải dữ liệu người dùng."
                      : "Không tìm thấy người dùng nào phù hợp."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Hiển thị {startItem} - {endItem} trên {total} người dùng
        </span>

        <div className="flex items-center gap-1.5">
          {/* Previous */}
          <button
            type="button"
            onClick={() => changePage(page - 1)}
            disabled={isLoading || page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Số trang hiện tại */}
          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-medium">
            {totalPages === 0 ? "0 / 0" : `${page} / ${totalPages}`}
          </span>

          {/* Next */}
          <button
            type="button"
            onClick={() => changePage(page + 1)}
            disabled={isLoading || page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
            title="Trang tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
