import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

export default function BoardingTable({
  pets = [],
  onSelectPet,
  selectedPetId,
  onViewDetail,
}) {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Tự động reset về trang 1 khi danh sách pets thay đổi (ví dụ: khi tìm kiếm hoặc lọc)
  useEffect(() => {
    setCurrentPage(1);
  }, [pets.length]);

  const totalPages = Math.max(1, Math.ceil(pets.length / PAGE_SIZE));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (activePage - 1) * PAGE_SIZE;
  const currentPets = pets.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Header của bảng */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            Danh sách thú cưng lưu trú
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tìm thấy <span className="font-semibold text-emerald-600">{pets.length}</span> thú cưng
          </p>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse whitespace-nowrap text-left text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Thú cưng</th>
              <th className="py-3 px-4">Chủ nuôi</th>
              <th className="py-3 px-4">Check-in</th>
              <th className="py-3 px-4">Check-out</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentPets.map((pet) => (
              <tr
                key={pet.id}
                onClick={() => onSelectPet?.(pet)}
                className={`cursor-pointer transition hover:bg-slate-50/70 ${
                  selectedPetId === pet.id ? "bg-emerald-50/40" : ""
                }`}
              >
                {/* Thú cưng */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={pet.img}
                      alt={pet.name}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
                    />
                    <div>
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPet?.(pet);
                          onViewDetail?.(pet);
                        }}
                        className="text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        {pet.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {pet.type} • <span className="text-emerald-700 font-medium">{pet.roomName}</span>
                      </p>
                    </div>
                  </div>
                </td>

                {/* Chủ nuôi */}
                <td className="py-3.5 px-4">
                  <p className="text-xs font-medium text-slate-800">
                    {pet.owner}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{pet.phone}</p>
                </td>

                {/* Check-in */}
                <td className="py-3.5 px-4">
                  <p className="font-medium text-slate-800">{pet.checkinDate}</p>
                  <p className="text-[10px] text-slate-400">{pet.checkinTime}</p>
                </td>

                {/* Check-out */}
                <td className="py-3.5 px-4">
                  <p className="font-medium text-slate-800">{pet.checkoutDate}</p>
                  <p className={`text-[10px] font-medium ${pet.checkoutColor}`}>
                    {pet.checkoutStatus}
                  </p>
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${pet.statusClass}`}
                  >
                    {pet.status}
                  </span>
                </td>

                {/* Thao tác: Xem chi tiết */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    aria-label={`Xem chi tiết ${pet.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPet?.(pet);
                      onViewDetail?.(pet);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} />
                    <span>Xem chi tiết</span>
                  </button>
                </td>
              </tr>
            ))}

            {pets.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Không tìm thấy thú cưng lưu trú phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          {pets.length === 0 ? (
            "Không có thú cưng nào"
          ) : (
            <>
              Hiển thị{" "}
              <strong className="text-slate-800">
                {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, pets.length)}
              </strong>{" "}
              trong tổng số{" "}
              <strong className="text-slate-800">{pets.length}</strong> thú cưng
            </>
          )}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Trang trước"
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center font-medium transition-colors cursor-pointer ${
                  pageNum === activePage
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600 font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              aria-label="Trang sau"
              disabled={activePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}