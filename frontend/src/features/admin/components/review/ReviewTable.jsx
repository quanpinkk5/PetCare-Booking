import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';

export default function ReviewTable({
  reviews,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  starFilter,
  setStarFilter,
  facilityFilter,
  setFacilityFilter,
  selectedReviewId,
  setSelectedReviewId,
  activeReview,
  onOpenDetail,
}) {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm đánh giá, khách hàng, cơ sở..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status */}
          <div className="flex items-center text-xs">
            <label className="text-slate-500 mr-2 font-medium">
              Trạng thái:
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option>Tất cả</option>
              <option>HIỂN THỊ</option>
              <option>BỊ BÁO CÁO</option>
              <option>ĐÃ ẨN</option>
            </select>
          </div>

          {/* Star */}
          <div className="flex items-center text-xs">
            <label className="text-slate-500 mr-2 font-medium">
              Số sao:
            </label>

            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option>Tất cả</option>
              <option>5 sao</option>
              <option>4 sao</option>
              <option>3 sao</option>
              <option>2 sao</option>
              <option>1 sao</option>
            </select>
          </div>

          {/* Facility */}
          <div className="flex items-center text-xs">
            <label className="text-slate-500 mr-2 font-medium">
              Cơ sở:
            </label>

            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option>Tất cả</option>
              <option>Happy Paws Spa</option>
              <option>PetCare Center</option>
              <option>Mew & Woof House</option>
              <option>Paw Paradise</option>
            </select>
          </div>

          {/* Time */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 cursor-pointer hover:border-slate-300">
            <span className="text-slate-500 mr-1.5">
              Thời gian:
            </span>

            <span className="font-semibold text-slate-800 mr-2">
              30 ngày qua
            </span>

            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Review Table */}
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
              {reviews.length > 0 ? (
                reviews.map((item) => {
                  const isSelected = item.id === activeReview?.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedReviewId(item.id);
                        if (onOpenDetail) onOpenDetail(item);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.customer.avatar}
                            alt={item.customer.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />

                          <div className="truncate max-w-[110px]">
                            <p className="font-bold text-slate-800 leading-tight">
                              {item.customer.name}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                              {item.customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Facility */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          {item.facility.name}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {item.facility.location}
                        </p>
                      </td>

                      {/* Service */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          {item.service}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {item.petType}
                        </p>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 whitespace-nowrap text-amber-400">
                        {'★'.repeat(item.rating)}

                        <span className="text-slate-200">
                          {'★'.repeat(5 - item.rating)}
                        </span>
                      </td>

                      {/* Content */}
                      <td
                        className="py-3 px-4 max-w-[160px] truncate"
                        title={item.content}
                      >
                        {item.content}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-medium text-slate-700">
                          {item.createdDate}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {item.createdTime}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.status === 'HIỂN THỊ' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            HIỂN THỊ
                          </span>
                        )}

                        {item.status === 'BỊ BÁO CÁO' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">
                            BỊ BÁO CÁO
                          </span>
                        )}

                        {item.status === 'ĐÃ ẨN' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            ĐÃ ẨN
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReviewId(item.id);
                            if (onOpenDetail) onOpenDetail(item);
                          }}
                          title="Xem chi tiết"
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

        {/* Pagination */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>

            <select className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>

            <span>trên mỗi trang</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded bg-emerald-600 text-white font-semibold flex items-center justify-center"
            >
              1
            </button>

            {[2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className="w-7 h-7 rounded hover:bg-slate-100 font-medium flex items-center justify-center"
              >
                {page}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            <button
              type="button"
              className="w-7 h-7 rounded hover:bg-slate-100 font-medium flex items-center justify-center"
            >
              125
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <span>
              1 - {Math.min(reviews.length, 10)} của 1.248 đánh giá
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}