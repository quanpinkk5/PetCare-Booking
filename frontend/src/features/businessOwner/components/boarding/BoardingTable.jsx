import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, PawPrint } from "lucide-react";

// ========================================
// AVATAR THÚ CƯNG
// ========================================
function PetAvatar({ src, name }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (!src || imageError) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
        <PawPrint size={19} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Thú cưng"}
      onError={() => setImageError(true)}
      className="h-10 w-10 shrink-0 rounded-xl border border-slate-100 object-cover shadow-sm"
    />
  );
}

// ========================================
// BẢNG QUẢN LÝ LƯU TRÚ
// ========================================
export default function BoardingTable({
  pets = [],
  onSelectPet,
  selectedPetId,
  onViewDetail,

  // Phân trang từ Backend
  pagination = {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  },
  onPageChange,
  loading = false,
}) {
  const currentPage = pagination.page || 1;
  const pageSize = pagination.limit || 5;
  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 0;

  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(currentPage * pageSize, total);

  const handleViewDetail = (pet) => {
    onSelectPet?.(pet);
    onViewDetail?.(pet);
  };

  const handlePageChange = (page) => {
    if (loading || page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Danh sách thú cưng lưu trú
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Tìm thấy{" "}
            <span className="font-semibold text-emerald-600">{total}</span> đơn
            lưu trú phù hợp
          </p>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Thú cưng</th>

              <th className="px-4 py-3">Chủ nuôi</th>

              <th className="px-4 py-3">Check-in</th>

              <th className="px-4 py-3">Check-out</th>

              <th className="px-4 py-3 text-center">Trạng thái</th>

              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {pets.map((pet) => {
              const isSelected = selectedPetId === pet.id;

              const petName = pet.name || "Thú cưng";

              const ownerName = pet.owner || "Khách hàng";

              const petType = pet.type || "Chưa cập nhật";

              const roomName = pet.roomName || "Chưa cập nhật phòng";

              return (
                <tr
                  key={pet._id || pet.id}
                  onClick={() => onSelectPet?.(pet)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50/70 ${
                    isSelected ? "bg-emerald-50/40" : ""
                  }`}
                >
                  {/* THÚ CƯNG */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <PetAvatar src={pet.img} name={petName} />

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(pet);
                          }}
                          className="block cursor-pointer text-left text-xs font-bold text-slate-800 transition hover:text-emerald-600"
                        >
                          {petName}
                        </button>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {petType}
                          {" • "}
                          <span className="font-medium text-emerald-700">
                            {roomName}
                          </span>
                        </p>

                        <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {pet.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CHỦ NUÔI */}
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">{ownerName}</p>

                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                      {pet.phone || "—"}
                    </p>
                  </td>

                  {/* CHECK-IN */}
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">
                      {pet.checkinDate || "—"}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {pet.checkinTime || "Ngày nhận dự kiến"}
                    </p>
                  </td>

                  {/* CHECK-OUT */}
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">
                      {pet.checkoutDate || "—"}
                    </p>

                    <p
                      className={`mt-0.5 text-[10px] font-medium ${
                        pet.checkoutColor || "text-slate-400"
                      }`}
                    >
                      {pet.checkoutStatus || "Ngày trả dự kiến"}
                    </p>
                  </td>

                  {/* TRẠNG THÁI */}
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        pet.statusClass || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {pet.status || "Chưa xác định"}
                    </span>
                  </td>

                  {/* THAO TÁC */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      aria-label={`Xem chi tiết ${petName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(pet);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100"
                    >
                      <Eye size={13} />
                      <span>Xem chi tiết</span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* KHÔNG CÓ DỮ LIỆU */}
            {pets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <PawPrint size={22} />
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      Không tìm thấy thú cưng lưu trú phù hợp
                    </p>

                    <p className="text-xs text-slate-400">
                      Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================
          PHÂN TRANG BACKEND
          NẰM NGAY DƯỚI BẢNG
      ===================================== */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:flex-row">
        {/* SỐ LƯỢNG HIỂN THỊ */}
        <span>
          {total === 0 ? (
            "Không có thú cưng nào"
          ) : (
            <>
              Hiển thị{" "}
              <strong className="text-slate-800">
                {startItem} - {endItem}
              </strong>{" "}
              trên tổng số <strong className="text-slate-800">{total}</strong>{" "}
              đơn lưu trú
            </>
          )}
        </span>

        {/* NÚT PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* TRANG TRƯỚC */}
            <button
              type="button"
              aria-label="Trang trước"
              disabled={loading || currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {/* SỐ TRANG */}
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((pageNumber) => {
                // Trang đầu / cuối luôn hiển thị.
                // Các trang khác chỉ hiển thị
                // trong khoảng gần trang hiện tại.
                return (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1
                );
              })
              .map((pageNumber, index, pages) => {
                const previousPage = pages[index - 1];

                return (
                  <div key={pageNumber} className="flex items-center gap-1.5">
                    {previousPage && pageNumber - previousPage > 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        pageNumber === currentPage
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </div>
                );
              })}

            {/* TRANG SAU */}
            <button
              type="button"
              aria-label="Trang sau"
              disabled={loading || currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
