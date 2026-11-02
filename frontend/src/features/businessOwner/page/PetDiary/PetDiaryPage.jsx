import { useEffect, useState } from "react";
import PetDiaryFilters from "../../components/petDiary/PetDiaryFilters";
import PetDiaryTable from "../../components/petDiary/PetDiaryTable";
import PetDiaryDetailModal from "../../components/petDiary/PetDiaryDetailModal";
import PetDiaryAddModal from "../../components/petDiary/PetDiaryAddModal";
import PetDiaryEditModal from "../../components/petDiary/PetDiaryEditModal";
import { petDiaryApi } from "../../services/petDiaryApi.js";
import { diaryBookingToRow } from "../../data/petDiaryApiData.js";

export default function PetDiaryPage() {
  const [petsList, setPetsList] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ search: "", date: "", branchId: "", activityType: "" });
  const [branches, setBranches] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reload, setReload] = useState(0);
  const [detailModalPet, setDetailModalPet] = useState(null);
  const [addModalPet, setAddModalPet] = useState(null);
  const [editModalPet, setEditModalPet] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      setSelectedPet(null);
      try {
        const response = await petDiaryApi.list({ ...filters, page, limit: pageSize });
        if (cancelled) return;
        setPetsList((response.data.bookings || []).map(diaryBookingToRow));
        setBranches(response.data.branches || []);
        setPagination(response.data.pagination);
        if (page > 1 && page > response.data.pagination.totalPages) {
          setPage(Math.max(1, response.data.pagination.totalPages));
        }
      } catch (err) {
        if (!cancelled) { setError(err.message); setPetsList([]); setPagination({ page, limit: pageSize, total: 0, totalPages: 0 }); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [filters, page, pageSize, reload]);

  const handleFilterChange = (field, value) => {
    setPage(1);
    setSelectedPet(null);
    setLoading(true);
    setSuccess("");
    setFilters((previous) => ({ ...previous, [field]: value }));
  };
  const handleSelectPet = (pet) => setSelectedPet(pet);
  const handleViewDetail = (pet) => setDetailModalPet(pet);
  const handleOpenEdit = (pet) => setEditModalPet(pet);
  const handleOpenAdd = (pet) => setAddModalPet(pet || selectedPet);
  const handleSaved = () => { setSuccess("Đã lưu nhật ký chăm sóc."); setLoading(true); setReload((value) => value + 1); };
  const handleSaveEdit = async (payload) => {
    await petDiaryApi.updateDiary(editModalPet.bookingId, editModalPet.diaryId, payload);
    handleSaved();
  };
  const handleSaveAdd = async (payload) => {
    await petDiaryApi.createDiary(addModalPet.bookingId, payload);
    handleSaved();
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Nội dung chính toàn màn hình, tập trung vào PetDiaryTable */}
      <div className="mx-auto w-full max-w-7xl space-y-5 text-slate-800 antialiased font-sans text-xs">
        {/* Thanh công cụ tìm kiếm bên trái cùng và nút Thêm cập nhật khi chọn dòng */}
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">{error}<button type="button" onClick={() => setReload((value) => value + 1)} className="ml-3 underline">Thử lại</button></div>}
        {success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">{success}</div>}
        <PetDiaryFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => { setSearchTerm(value); handleFilterChange("search", value); }}
          filters={filters}
          branches={branches}
          onFilterChange={handleFilterChange}
          loading={loading}
          onReset={() => { setSearchTerm(""); setPage(1); setSelectedPet(null); setLoading(true); setFilters({ search: "", date: "", branchId: "", activityType: "" }); }}
          selectedPet={selectedPet}
          onAddDiary={handleOpenAdd}
        />

        {/* Bảng danh sách nhật ký thú cưng */}
        <PetDiaryTable
          pets={petsList}
          loading={loading}
          pagination={pagination}
          onPageChange={(value) => { setLoading(true); setPage(value); }}
          onPageSizeChange={(value) => { setLoading(true); setPageSize(value); setPage(1); }}
          selectedPetId={selectedPet?.id}
          onSelectPet={handleSelectPet}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Modal xem chi tiết nhật ký thú cưng */}
      {detailModalPet && !editModalPet && (
        <PetDiaryDetailModal
          pet={detailModalPet}
          onClose={() => setDetailModalPet(null)}
          onEditDiary={handleOpenEdit}
          onUpdateDiary={(pet) => {
            setDetailModalPet(null);
            handleOpenAdd(pet);
          }}
        />
      )}

      {/* Modal CHỈNH SỬA nhật ký (cho hành động Chỉnh sửa ở từng dòng) */}
      {editModalPet && (
        <PetDiaryEditModal
          pet={editModalPet}
          onClose={() => setEditModalPet(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal THÊM CẬP NHẬT mới (cho nút Thêm cập nhật khi chọn dòng) */}
      {addModalPet && (
        <PetDiaryAddModal
          pet={addModalPet}
          onClose={() => setAddModalPet(null)}
          onSave={handleSaveAdd}
        />
      )}
    </>
  );
}
