import { useState, useEffect } from "react";
import { Eye, Edit3, ChevronLeft, ChevronRight } from "lucide-react";

export default function PetDiaryTable({
  pets = [],
  selectedPetId,
  onSelectPet,
  onViewDetail,
  onEditDiary,
  onUpdateDiary,
}) {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Tự động chuyển về trang 1 khi danh sách thay đổi (lọc, tìm kiếm, v.v.)
  useEffect(() => {
    setCurrentPage(1);
  }, [pets.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(pets.length / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (activePage - 1) * pageSize;
  const currentPets = pets.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-slate-500 border-b border-slate-100 font-semibold text-[11px]">
              <th className="py-3.5 px-4">Thú cưng</th>
              <th className="py-3.5 px-3">Chủ nuôi</th>
              <th className="py-3.5 px-3">Loại hoạt động</th>
              <th className="py-3.5 px-3">Thời gian</th>
              <th className="py-3.5 px-3">Ghi chú</th>
              <th className="py-3.5 px-3 text-center">Ảnh</th>
              <th className="py-3.5 px-3 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
            {currentPets.length > 0 ? (
              currentPets.map((pet) => {
                const ActionIcon = pet.actionIcon;
                const isSelected = selectedPetId === pet.id;

                return (
                  <tr
                    key={pet.id}
                    onClick={() => onSelectPet?.(isSelected ? null : pet)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/70 ring-1 ring-inset ring-emerald-300 font-medium"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          alt={pet.name}
                          src={pet.img}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-800">
                              {pet.name}
                            </p>
                            {isSelected && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {pet.breed} • {pet.age}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-700">
                        {pet.owner}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {pet.phone}
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-[11px] border ${pet.actionColor}`}
                      >
                        <ActionIcon size={12} />
                        <span>{pet.actionType}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-600">
                      {pet.actionTime}
                    </td>

                    <td
                      className="py-3 px-3 text-slate-600 max-w-[180px] truncate"
                      title={pet.note}
                    >
                      {pet.note}
                    </td>

                    <td className="py-3 px-3 text-center font-medium text-slate-600">
                      {pet.photos > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10.5px] font-semibold text-slate-600">
                          {pet.photos} ảnh
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100/80 text-emerald-700">
                        HOÀN THÀNH
                      </span>
                    </td>

                    {/* Cột thao tác có 2 hành động: Xem chi tiết và Cập nhật */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail?.(pet);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-200 transition cursor-pointer"
                          title="Xem chi tiết nhật ký"
                        >
                          <Eye size={13} className="text-slate-500" />
                          <span>Chi tiết</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            (onEditDiary || onUpdateDiary)?.(pet);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 shadow-2xs hover:bg-blue-100 hover:border-blue-300 transition cursor-pointer"
                          title="Chỉnh sửa nhật ký"
                        >
                          <Edit3 size={13} className="text-blue-600" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-xs text-slate-400"
                >
                  Không tìm thấy thú cưng hoặc nhật ký phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Thanh phân trang Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            {pets.length === 0 ? (
              "Không có bản ghi nào"
            ) : (
              <>
                Hiển thị{" "}
                <strong className="text-slate-800">
                  {startIndex + 1} - {Math.min(startIndex + pageSize, pets.length)}
                </strong>{" "}
                trong tổng số{" "}
                <strong className="text-slate-800">{pets.length}</strong> thú cưng
              </>
            )}
          </span>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">| Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Trang trước"
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
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
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
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
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
