import {
  SquarePen,
  Eye,
  Lock,
  LockOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
} from "lucide-react";

const ICON_MAP = {
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
};

const ICON_BG_MAP = {
  Scissors: "bg-emerald-50 text-emerald-600",
  Bath: "bg-sky-50 text-sky-600",
  Sparkles: "bg-purple-50 text-purple-600",
  HeartHandshake: "bg-amber-50 text-amber-600",
  Hotel: "bg-blue-50 text-blue-600",
  ShieldAlert: "bg-rose-50 text-rose-600",
  Ear: "bg-teal-50 text-teal-600",
  PawPrint: "bg-orange-50 text-orange-600",
};

export default function ServiceCategoryTable({
  categories = [],
  pagination = {},
  isLoading = false,
  hasError = false,
  updatingCategoryId = null,
  onEdit,
  onViewDetail,
  onToggleStatus,
  onPageChange,
  onPageSizeChange,
}) {
  const page = pagination.page || 1;
  const limit = pagination.limit || 20;
  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 0;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;

  const to = total === 0 ? 0 : Math.min(page * limit, total);

  const isUpdating = Boolean(updatingCategoryId);

  return (
    <>
      {/* TABLE HEADER */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Danh sách danh mục ({total})
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
            <tr>
              <th className="py-3 px-4">Danh mục dịch vụ</th>

              <th className="py-3 px-4">Mã danh mục</th>

              <th className="py-3 px-4">Mô tả</th>

              <th className="py-3 px-4">Trạng thái</th>

              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-normal">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  Đang tải danh mục dịch vụ...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || PawPrint;

                const iconBg =
                  ICON_BG_MAP[item.icon] || "bg-emerald-50 text-emerald-600";

                const isActive = item.status === "ACTIVE";

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* DANH MỤC */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* MÃ DANH MỤC */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {item.code}
                    </td>

                    {/* MÔ TẢ */}
                    <td
                      className="py-3.5 px-4 max-w-[200px] text-slate-500 text-[11px]"
                      title={item.description || ""}
                    >
                      <span className="block max-w-[200px] truncate">
                        {item.description || "Chưa có mô tả"}
                      </span>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="py-3.5 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Tạm ẩn
                        </span>
                      )}
                    </td>

                    {/* THAO TÁC */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-400">
                        {/* CHỈNH SỬA */}
                        <button
                          type="button"
                          onClick={() => onEdit?.(item)}
                          disabled={isUpdating}
                          className="p-1 hover:text-emerald-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Chỉnh sửa"
                          aria-label={`Chỉnh sửa danh mục ${item.name}`}
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>

                        {/* XEM CHI TIẾT */}
                        <button
                          type="button"
                          onClick={() => onViewDetail?.(item)}
                          disabled={isUpdating}
                          className="p-1 hover:text-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xem chi tiết"
                          aria-label={`Xem chi tiết danh mục ${item.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* KHÓA / MỞ KHÓA */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus?.(item)}
                          disabled={isUpdating}
                          className={`p-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            isActive
                              ? "text-amber-500 hover:text-amber-700"
                              : "text-emerald-600 hover:text-emerald-700"
                          }`}
                          title={
                            isActive ? "Tạm ẩn danh mục" : "Kích hoạt danh mục"
                          }
                          aria-label={
                            isActive
                              ? `Tạm ẩn danh mục ${item.name}`
                              : `Kích hoạt danh mục ${item.name}`
                          }
                        >
                          {isActive ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <LockOpen className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  {hasError
                    ? "Không thể tải danh sách danh mục."
                    : "Không tìm thấy danh mục phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Hiển thị {from} đến {to} trong tổng số {total} danh mục
        </div>

        <div className="flex items-center gap-3">
          {/* CHUYỂN TRANG */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={isLoading || isUpdating || page <= 1}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              disabled
              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold flex items-center justify-center"
              aria-label={`Trang ${page}`}
            >
              {page}
            </button>

            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={isLoading || isUpdating || page >= totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SỐ DÒNG MỖI TRANG */}
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              disabled={isLoading || isUpdating}
              className="bg-white border border-slate-200 text-xs rounded-lg pl-2 pr-6 py-1 text-slate-600 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value={20}>20 / trang</option>

              <option value={50}>50 / trang</option>
            </select>

            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}
