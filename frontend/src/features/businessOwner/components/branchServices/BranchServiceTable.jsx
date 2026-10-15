import {
    Eye,
    Edit,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function BranchServiceTable({
    services = [],
    currentPage = 1,
    onPageChange,
    onToggleStatus,
    onView,
    onEdit,
}) {
    const PAGE_SIZE = 5;
    const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
    const activePage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (activePage - 1) * PAGE_SIZE;
    const currentServices = services.slice(
        startIndex,
        startIndex + PAGE_SIZE,
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange?.(newPage);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Chi nhánh</th>
                            <th className="py-3 px-4">Tên dịch vụ</th>
                            <th className="py-3 px-3">Danh mục</th>
                            <th className="py-3 px-3">Giá dịch vụ</th>
                            <th className="py-3 px-3">Đơn vị</th>
                            <th className="py-3 px-3">Thời lượng</th>
                            <th className="py-3 px-3">Công suất</th>
                            <th className="py-3 px-3">Áp dụng</th>
                            <th className="py-3 px-3 text-center">Trạng thái</th>
                            <th className="py-3 px-4 text-center">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentServices.length > 0 ? (
                            currentServices.map((srv) => (
                                <tr
                                    key={srv.id}
                                    className="hover:bg-slate-50/60 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                alt={srv.branchName}
                                                src={srv.branchImg}
                                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                            />
                                            <div>
                                                <div className="font-bold text-slate-900 leading-tight">
                                                    {srv.branchName}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5 max-w-[160px] truncate">
                                                    {srv.branchAddress}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-slate-800">
                                            {srv.serviceName}
                                        </div>
                                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[220px]">
                                            {srv.serviceDesc}
                                        </div>
                                    </td>

                                    <td className="py-3 px-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${srv.catColor}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${srv.catDot}`}
                                            />
                                            {srv.category}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3 font-bold text-slate-800">
                                        {srv.price}
                                    </td>
                                    <td className="py-3 px-3 text-slate-500">{srv.unit}</td>
                                    <td className="py-3 px-3 text-slate-500">{srv.duration}</td>
                                    <td className="py-3 px-3 text-slate-600 font-medium">
                                        {srv.capacity}
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex gap-1 text-sm">
                                            {srv.pets}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3 text-center">
                                        {srv.isActive ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                                                Đang hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                                                Tạm dừng
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                title="Xem chi tiết"
                                                onClick={() => onView?.(srv)}
                                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Chỉnh sửa dịch vụ"
                                                onClick={() => onEdit?.(srv)}
                                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={srv.isActive}
                                                aria-label={`Bật/tắt trạng thái ${srv.serviceName}`}
                                                onClick={() => onToggleStatus?.(srv.id)}
                                                className={`relative w-8 h-5 rounded-full transition-colors cursor-pointer ${
                                                    srv.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                                        srv.isActive ? 'left-3.5' : 'left-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-12 text-center text-slate-400 text-sm"
                                >
                                    Không tìm thấy dịch vụ chi nhánh nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Chân trang phân trang */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 bg-white">
                <span>
                    {services.length === 0 ? (
                        'Không có dịch vụ nào'
                    ) : (
                        <>
                            Hiển thị{' '}
                            <strong className="text-slate-800">
                                {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, services.length)}
                            </strong>{' '}
                            trong tổng số{' '}
                            <strong className="text-slate-800">{services.length}</strong>{' '}
                            dịch vụ
                        </>
                    )}
                </span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Trang trước"
                        disabled={activePage <= 1}
                        onClick={() => handlePageChange(activePage - 1)}
                        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-7 h-7 rounded border flex items-center justify-center font-medium transition-colors cursor-pointer ${
                                pageNum === activePage
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        type="button"
                        aria-label="Trang sau"
                        disabled={activePage >= totalPages}
                        onClick={() => handlePageChange(activePage + 1)}
                        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}