import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  RotateCcw,
  Filter,
  UserRound,
} from "lucide-react";

const STATUS_CONFIG = {
  VISIBLE: {
    label: "HIỂN THỊ",
    className: "bg-emerald-100 text-emerald-700",
  },
  HIDDEN: {
    label: "ĐÃ ẨN",
    className: "bg-slate-100 text-slate-600",
  },
};

const SPECIES_LABELS = {
  DOG: "Chó",
  CAT: "Mèo",
};

const formatDate = (value) => {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    time: date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  };
};

const getPetType = (pet) => {
  if (!pet) return "—";

  const species = SPECIES_LABELS[pet.species] || pet.species || "";

  return [species, pet.breed].filter(Boolean).join(" - ") || "—";
};

export default function ReviewTable({
  reviews = [],
  facilities = [],
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  starFilter,
  setStarFilter,
  facilityFilter,
  setFacilityFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onApply,
  onReset,
  pagination = {},
  isLoading = false,
  selectedReviewId,
  onOpenDetail,
  onPageChange,
  onPageSizeChange,
}) {
  const currentPage = Number(pagination.page || 1);
  const pageSize = Number(pagination.limit || 10);
  const total = Number(pagination.total || 0);
  const totalPages = Number(pagination.totalPages || 0);

  const from = total ? (currentPage - 1) * pageSize + 1 : 0;

  const to = total ? Math.min(currentPage * pageSize, total) : 0;

  const hasFilters = Boolean(
    searchQuery ||
    statusFilter !== "all" ||
    starFilter !== "all" ||
    facilityFilter !== "all" ||
    fromDate ||
    toDate,
  );

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    return Array.from({ length: 5 }, (_, index) => start + index);
  };

  return (
    <div className="space-y-4">
      {/* ===========================
          FILTER BAR
      ============================ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-start gap-3">
        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onApply?.();
              }
            }}
            placeholder="Tìm kiếm đánh giá, khách hàng, cơ sở..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TRẠNG THÁI */}
          <div className="flex items-center text-xs">
            <label
              htmlFor="review-status-filter"
              className="text-slate-500 mr-2 font-medium"
            >
              Trạng thái:
            </label>

            <select
              id="review-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="py-2 pl-3 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="VISIBLE">HIỂN THỊ</option>
              <option value="HIDDEN">ĐÃ ẨN</option>
            </select>
          </div>

          {/* SỐ SAO */}
          <div className="flex items-center text-xs">
            <label
              htmlFor="review-star-filter"
              className="text-slate-500 mr-2 font-medium"
            >
              Số sao:
            </label>

            <select
              id="review-star-filter"
              value={starFilter}
              onChange={(event) => setStarFilter(event.target.value)}
              className="py-2 pl-3 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>

          {/* CƠ SỞ */}
          <div className="flex items-center text-xs">
            <label
              htmlFor="review-facility-filter"
              className="text-slate-500 mr-2 font-medium"
            >
              Cơ sở:
            </label>

            <select
              id="review-facility-filter"
              value={facilityFilter}
              onChange={(event) => setFacilityFilter(event.target.value)}
              className="py-2 pl-3 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer max-w-44"
            >
              <option value="all">Tất cả</option>

              {facilities.map((facility) => (
                <option key={facility._id} value={facility._id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>

          {/* KHOẢNG NGÀY */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700">
            <CalendarDays className="w-4 h-4 shrink-0 text-slate-400" />

            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              aria-label="Từ ngày"
              className="w-[112px] text-xs outline-none"
            />

            <span className="text-slate-400">-</span>

            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              aria-label="Đến ngày"
              className="w-[112px] text-xs outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Lọc
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-slate-500 hover:text-rose-600 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* ===========================
          REVIEW TABLE
      ============================ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Cơ sở</th>
                <th className="py-3 px-4">Dịch vụ</th>
                <th className="py-3 px-3">Số sao</th>
                <th className="py-3 px-4">Nội dung đánh giá</th>
                <th className="py-3 px-3">Ngày tạo</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Đang tải danh sách đánh giá...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((item) => {
                  const isSelected = item._id === selectedReviewId;

                  const status = STATUS_CONFIG[item.status] || {
                    label: item.status || "—",
                    className: "bg-slate-100 text-slate-600",
                  };

                  const customerName =
                    item.customer?.fullName || "Không có thông tin";

                  const created = formatDate(item.createdAt);

                  return (
                    <tr
                      key={item._id}
                      onClick={() => onOpenDetail?.(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      {/* KHÁCH HÀNG */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {item.customer?.avatar ? (
                            <img
                              src={item.customer.avatar}
                              alt={customerName}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <UserRound className="w-4 h-4" />
                            </div>
                          )}

                          <div className="truncate max-w-[130px]">
                            <p className="font-bold text-slate-800 leading-tight truncate">
                              {customerName}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                              {item.customer?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CƠ SỞ */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          {item.branch?.name || "—"}
                        </p>

                        <p className="text-[11px] text-slate-400 max-w-[180px] truncate">
                          {item.branch?.address || "—"}
                        </p>
                      </td>

                      {/* DỊCH VỤ */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          {item.service?.name || "—"}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {getPetType(item.pet)}
                        </p>
                      </td>

                      {/* SỐ SAO */}
                      <td className="py-3 px-3 whitespace-nowrap text-amber-400">
                        {"★".repeat(Math.max(0, Math.min(5, item.rating || 0)))}

                        <span className="text-slate-200">
                          {"★".repeat(
                            5 - Math.max(0, Math.min(5, item.rating || 0)),
                          )}
                        </span>
                      </td>

                      {/* NỘI DUNG */}
                      <td
                        className="py-3 px-4 max-w-[160px] truncate"
                        title={item.comment || ""}
                      >
                        {item.comment || "Không có nội dung"}
                      </td>

                      {/* NGÀY TẠO */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-medium text-slate-700">
                          {created.date}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {created.time}
                        </p>
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* THAO TÁC */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          aria-label={`Xem đánh giá ${item._id}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenDetail?.(item);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Không tìm thấy đánh giá phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===========================
            PHÂN TRANG
        ============================ */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>

            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange?.(event.target.value)}
              disabled={isLoading}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

            <span>trên mỗi trang</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isLoading || currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              aria-label="Trang trước"
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 disabled:opacity-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {getVisiblePages().map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange?.(pageNumber)}
                className={`w-7 h-7 rounded font-semibold flex items-center justify-center disabled:opacity-50 ${
                  currentPage === pageNumber
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={
                isLoading || totalPages === 0 || currentPage >= totalPages
              }
              onClick={() => onPageChange?.(currentPage + 1)}
              aria-label="Trang tiếp theo"
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            {from} - {to} của {total.toLocaleString("vi-VN")} đánh giá
          </div>
        </div>
      </div>
    </div>
  );
}
