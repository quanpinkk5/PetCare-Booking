
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Ban,
} from "lucide-react";

import UserAvatar from "./UserAvatar";

// =========================
// TRẠNG THÁI THƯƠNG HIỆU
// =========================
const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-600",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-emerald-50 text-emerald-600",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-rose-50 text-rose-500",
  },
  SUSPENDED: {
    label: "Tạm khóa",
    className: "bg-rose-50 text-rose-500",
  },
};

// =========================
// NGÀY GIỜ
// =========================
function formatDateTime(value) {
  if (!value) {
    return { date: "—", time: "" };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    time: date.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }),
  };
}

// =========================
// LOGO THƯƠNG HIỆU
// =========================
function BusinessLogo({ logo, name }) {
  const [failedUrl, setFailedUrl] = useState("");

  const hasImage =
    typeof logo === "string" &&
    logo.trim() !== "" &&
    failedUrl !== logo;

  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold overflow-hidden">
      {hasImage ? (
        <img
          src={logo}
          alt={name || "Thương hiệu"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(logo)}
        />
      ) : (
        <span>
          {name?.charAt(0)?.toUpperCase() || "C"}
        </span>
      )}
    </div>
  );
}

// =========================
// ĐỊNH DẠNG SỐ
// =========================
function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}

// =========================
// SỐ TRANG HIỂN THỊ
// =========================
function getPageItems(currentPage, totalPages) {
  if (totalPages <= 0) return [];

  const visible = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const pages = [...visible]
    .filter(
      (page) => page >= 1 && page <= totalPages
    )
    .sort((a, b) => a - b);

  const result = [];

  pages.forEach((page, index) => {
    const previous = pages[index - 1];

    if (index > 0 && page - previous > 1) {
      result.push(`dots-${previous}-${page}`);
    }

    result.push(page);
  });

  return result;
}

// =========================
// MENU BA CHẤM
// =========================
function BusinessActionMenu({
  business,
  disabled,
  onSuspend,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect =
      buttonRef.current.getBoundingClientRect();

    const menuWidth = 160;
    const menuHeight = 48;
    const margin = 8;

    const left = Math.max(
      margin,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - margin
      )
    );

    const showAbove =
      rect.bottom + menuHeight + margin >
        window.innerHeight &&
      rect.top >= menuHeight + margin;

    setPosition({
      left,
      top: showAbove
        ? rect.top - menuHeight - 4
        : rect.bottom + 4,
    });
  };

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen) {
      updatePosition();
    }

    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      const target = event.target;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    window.addEventListener(
      "resize",
      handleScrollOrResize
    );

    window.addEventListener(
      "scroll",
      handleScrollOrResize,
      true
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      window.removeEventListener(
        "resize",
        handleScrollOrResize
      );

      window.removeEventListener(
        "scroll",
        handleScrollOrResize,
        true
      );
    };
  }, [isOpen]);

  // Chỉ thương hiệu APPROVED có chức năng tạm khóa
  if (business.status !== "APPROVED") {
    return (
      <button
        type="button"
        disabled
        title="Chưa có thao tác khác"
        className="p-1 text-slate-400 opacity-50 cursor-not-allowed"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={`Thao tác với ${business.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={`Thao tác với ${business.name}`}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: 160,
              zIndex: 1000,
            }}
            className="bg-white border border-slate-200 rounded-xl shadow-lg p-1"
          >
            <button
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={() => {
                setIsOpen(false);
                onSuspend?.(business);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Tạm khóa</span>
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

// =========================
// BẢNG BUSINESS
// =========================
export default function BusinessTable({
  data = [],
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading = false,
  hasError = false,
  onPageChange,
  onPageSizeChange,
  onApprove,
  onReject,
  onSuspend,
  onUnblock,
  updatingBusinessId = null,
}) {
  const page = pagination.page || 1;
  const pageSize = pagination.limit || 10;
  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 0;

  const startItem =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endItem =
    total === 0 ? 0 : Math.min(page * pageSize, total);

  const pageItems = getPageItems(page, totalPages);
  const isUpdating = Boolean(updatingBusinessId);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* TABLE HEADER */}
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">
                Cơ sở
              </th>

              <th className="py-3.5 px-4">
                Chủ sở hữu
              </th>

              <th className="py-3.5 px-4 text-center">
                Số chi nhánh
              </th>

              <th className="py-3.5 px-4">
                Khu vực
              </th>

              <th className="py-3.5 px-4">
                Trạng thái
              </th>

              <th className="py-3.5 px-4">
                Đánh giá
              </th>

              <th className="py-3.5 px-4">
                Ngày đăng ký
              </th>

              <th className="py-3.5 px-5 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  Đang tải danh sách thương hiệu...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  {hasError
                    ? "Không thể tải danh sách thương hiệu."
                    : "Không tìm thấy cơ sở nào phù hợp."}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const status =
                  STATUS_CONFIG[item.status] ?? {
                    label:
                      item.status || "Không xác định",
                    className:
                      "bg-slate-50 text-slate-600",
                  };

                const registered = formatDateTime(
                  item.createdAt
                );

                const rating = Number(
                  item.averageRating ?? 0
                );

                const reviewCount =
                  item.totalReviews ?? 0;

                const isThisBusinessUpdating =
                  updatingBusinessId === item._id;

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* CƠ SỞ */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <BusinessLogo
                          logo={item.logo}
                          name={item.name}
                        />

                        <div className="min-w-0">
                          <Link
                            to={`/admin/facilities/${item._id}`}
                            className="font-semibold text-slate-800 text-sm hover:text-emerald-600 transition-colors"
                          >
                            {item.name ||
                              "Chưa cập nhật"}
                          </Link>

                          <div className="text-[11px] text-slate-400">
                            {item.email ||
                              "Chưa có email"}
                          </div>

                          <div className="text-[11px] text-slate-400">
                            {item.phone ||
                              "Chưa có SĐT"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CHỦ SỞ HỮU */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar
                          avatar={item.owner?.avatar}
                          name={
                            item.owner?.fullName
                          }
                        />

                        <span className="font-medium text-slate-700">
                          {item.owner?.fullName ||
                            "Không xác định"}
                        </span>
                      </div>
                    </td>

                    {/* SỐ CHI NHÁNH */}
                    <td className="py-4 px-4 text-center font-medium text-slate-700">
                      {formatNumber(
                        item.branchCount
                      )}
                    </td>

                    {/* KHU VỰC */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />

                        <span>
                          {item.location ||
                            "Chưa cập nhật"}
                        </span>
                      </div>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* ĐÁNH GIÁ */}
                    <td className="py-4 px-4">
                      {reviewCount > 0 ? (
                        <>
                          <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <span>
                              {rating.toFixed(1)}
                            </span>

                            <Star
                              className="w-3.5 h-3.5 text-amber-400"
                              fill="currentColor"
                            />
                          </div>

                          <div className="text-[11px] text-slate-400">
                            (
                            {formatNumber(
                              reviewCount
                            )}{" "}
                            đánh giá)
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Chưa có đánh giá
                        </span>
                      )}
                    </td>

                    {/* NGÀY ĐĂNG KÝ */}
                    <td className="py-4 px-4">
                      <div className="text-slate-700 font-medium">
                        {registered.date}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {registered.time}
                      </div>
                    </td>

                    {/* THAO TÁC */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* XEM CHI TIẾT */}
                        <Link
                          to={`/admin/facilities/${item._id}`}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg text-xs font-medium transition inline-flex items-center whitespace-nowrap"
                        >
                          Xem chi tiết
                        </Link>

                        {/* DUYỆT / TỪ CHỐI */}
                        {item.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onApprove?.(item)
                              }
                              disabled={isUpdating}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isThisBusinessUpdating
                                ? "Đang xử lý..."
                                : "Duyệt"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onReject?.(item)
                              }
                              disabled={isUpdating}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isThisBusinessUpdating
                                ? "Đang xử lý..."
                                : "Từ chối"}
                            </button>
                          </>
                        )}

                        {/* MỞ KHÓA */}
                        {item.status === "SUSPENDED" && (
                          <button
                            type="button"
                            onClick={() =>
                              onUnblock?.(item)
                            }
                            disabled={isUpdating}
                            className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {isThisBusinessUpdating
                              ? "Đang xử lý..."
                              : "Mở khóa"}
                          </button>
                        )}

                        {/* MENU BA CHẤM */}
                        <BusinessActionMenu
                          business={item}
                          disabled={isUpdating}
                          onSuspend={onSuspend}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="text-slate-500">
          Hiển thị{" "}
          <span className="font-semibold text-slate-800">
            {startItem} - {endItem}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-slate-800">
            {formatNumber(total)}
          </span>{" "}
          cơ sở
        </div>

        <div className="flex items-center gap-3">
          {/* SỐ DÒNG / TRANG */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange?.(
                  Number(e.target.value)
                )
              }
              disabled={isLoading || isUpdating}
              className="text-xs bg-white border border-slate-200 rounded-lg py-1.5 pl-3 pr-7 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none disabled:opacity-50"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* CÁC NÚT CHUYỂN TRANG */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                onPageChange?.(page - 1)
              }
              disabled={
                isLoading ||
                isUpdating ||
                page <= 1
              }
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageItems.map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onPageChange?.(item)
                  }
                  disabled={isLoading || isUpdating}
                  aria-current={
                    item === page
                      ? "page"
                      : undefined
                  }
                  className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition disabled:cursor-not-allowed ${
                    item === page
                      ? "bg-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  className="px-1 text-slate-400"
                >
                  ...
                </span>
              )
            )}

            <button
              type="button"
              onClick={() =>
                onPageChange?.(page + 1)
              }
              disabled={
                isLoading ||
                isUpdating ||
                page >= totalPages
              }
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
