import {
  SquarePen,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export default function ServiceCategoryTable({
  categories,
  filteredCategories,
  onEdit,
  onViewDetail,
}) {
  return (
    <>
      {/* Table Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Danh sách danh mục ({filteredCategories.length})
        </h2>
      </div>

      {/* Table */}
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
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => {
                const IconComponent = item.icon;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            item.iconBg || 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                        </span>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {item.code}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-500 text-[11px]">
                      {item.description || 'Chưa có mô tả'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === 'Hoạt động' ? (
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

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewDetail && onViewDetail(item)}
                          className="p-1 hover:text-sky-600 transition-colors cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          className="p-1 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Thao tác khác"
                        >
                          <MoreHorizontal className="w-4 h-4" />
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
                  Không tìm thấy danh mục phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          Hiển thị 1 đến {filteredCategories.length} trong tổng số{' '}
          {categories.length} danh mục
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold flex items-center justify-center cursor-pointer"
            >
              1
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <select className="bg-white border border-slate-200 text-xs rounded-lg pl-2 pr-6 py-1 text-slate-600 focus:outline-none appearance-none cursor-pointer">
              <option>20 / trang</option>
              <option>50 / trang</option>
            </select>

            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}