import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaymentPagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    itemsPerPage,
    onPageChange,
}) {
    if (totalItems === 0 || totalPages <= 1) return null;

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    return (
        <div className="space-y-3 pt-3">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-1">
                <span>
                    Hiển thị{" "}
                    <strong className="text-slate-800 font-bold">
                        {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)}
                    </strong>{" "}
                    trong tổng số{" "}
                    <strong className="text-emerald-700 font-bold">{totalItems}</strong> giao dịch
                </span>
                <span>
                    Trang <strong className="text-slate-800 font-bold">{currentPage}</strong> / {totalPages}
                </span>
            </div>

            <nav className="flex items-center justify-center gap-2 pt-1" aria-label="Phân trang giao dịch">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                        currentPage === 1
                            ? "text-slate-300 cursor-not-allowed opacity-50"
                            : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 cursor-pointer shadow-xs"
                    }`}
                    aria-label="Trang trước"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-slate-400 font-bold text-xs"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                currentPage === page
                                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-emerald-300"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                        currentPage === totalPages
                            ? "text-slate-300 cursor-not-allowed opacity-50"
                            : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 cursor-pointer shadow-xs"
                    }`}
                    aria-label="Trang kế tiếp"
                >
                    <ChevronRight size={16} />
                </button>
            </nav>
        </div>
    );
}
