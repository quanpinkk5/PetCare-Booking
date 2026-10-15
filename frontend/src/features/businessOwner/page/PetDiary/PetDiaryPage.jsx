import { useMemo, useState } from "react";
import PetDiaryFilters from "../../components/petDiary/PetDiaryFilters";
import PetDiaryTable from "../../components/petDiary/PetDiaryTable";
import PetDiaryDetailModal from "../../components/petDiary/PetDiaryDetailModal";
import PetDiaryAddModal from "../../components/petDiary/PetDiaryAddModal";
import PetDiaryEditModal from "../../components/petDiary/PetDiaryEditModal";
import { PETS as INITIAL_PETS } from "../../data/petDiaryData";

export default function PetDiaryPage() {
  const [petsList, setPetsList] = useState(INITIAL_PETS);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [detailModalPet, setDetailModalPet] = useState(null);
  const [addModalPet, setAddModalPet] = useState(null);
  const [editModalPet, setEditModalPet] = useState(null);

  // Bộ lọc tìm kiếm theo từ khóa
  const filteredPets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return petsList;
    }

    return petsList.filter((pet) =>
      [
        pet.name,
        pet.breed,
        pet.owner,
        pet.phone,
        pet.room,
        pet.roomCode,
        pet.note,
        pet.actionType,
      ].some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );
  }, [petsList, searchTerm]);

  // Xử lý chọn 1 dòng trên bảng
  const handleSelectPet = (pet) => {
    setSelectedPet((prev) => (prev?.id === pet?.id ? null : pet));
  };

  // Mở modal xem chi tiết
  const handleViewDetail = (pet) => {
    setDetailModalPet(pet);
  };

  // Mở modal CHỈNH SỬA nhật ký (ở cột thao tác của từng dòng)
  const handleOpenEdit = (pet) => {
    setEditModalPet(pet);
  };

  // Mở modal THÊM CẬP NHẬT (nút xuất hiện khi chọn 1 dòng)
  const handleOpenAdd = (pet) => {
    setAddModalPet(pet || selectedPet);
  };

  // Lưu chỉnh sửa nhật ký
  const handleSaveEdit = (editedData) => {
    setPetsList((prevList) =>
      prevList.map((item) =>
        item.id === editedData.petId
          ? {
              ...item,
              actionType: editedData.actionType,
              actionIcon: editedData.actionIcon,
              actionColor: editedData.actionColor,
              actionTime: editedData.actionTime,
              note: editedData.note,
              photos: editedData.photos,
            }
          : item
      )
    );

    // Đồng bộ lại selectedPet nếu đang chọn đúng bé này
    setSelectedPet((prev) =>
      prev?.id === editedData.petId
        ? {
            ...prev,
            actionType: editedData.actionType,
            actionIcon: editedData.actionIcon,
            actionColor: editedData.actionColor,
            actionTime: editedData.actionTime,
            note: editedData.note,
            photos: editedData.photos,
          }
        : prev
    );
  };

  // Lưu thêm nhật ký mới cho thú cưng
  const handleSaveAdd = (newDiary) => {
    setPetsList((prevList) =>
      prevList.map((item) =>
        item.id === newDiary.petId
          ? {
              ...item,
              actionType: newDiary.actionType,
              actionIcon: newDiary.actionIcon,
              actionColor: newDiary.actionColor,
              actionTime: newDiary.actionTime,
              note: newDiary.note,
              photos: item.photos + (newDiary.photos || 0),
            }
          : item
      )
    );

    setSelectedPet((prev) =>
      prev?.id === newDiary.petId
        ? {
            ...prev,
            actionType: newDiary.actionType,
            actionIcon: newDiary.actionIcon,
            actionColor: newDiary.actionColor,
            actionTime: newDiary.actionTime,
            note: newDiary.note,
          }
        : prev
    );
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
        <PetDiaryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPet={selectedPet}
          onAddDiary={handleOpenAdd}
        />

        {/* Bảng danh sách nhật ký thú cưng */}
        <PetDiaryTable
          pets={filteredPets}
          selectedPetId={selectedPet?.id}
          onSelectPet={handleSelectPet}
          onViewDetail={handleViewDetail}
          onEditDiary={handleOpenEdit}
        />
      </div>

      {/* Modal xem chi tiết nhật ký thú cưng */}
      {detailModalPet && (
        <PetDiaryDetailModal
          pet={detailModalPet}
          onClose={() => setDetailModalPet(null)}
          onUpdateDiary={(pet) => {
            setDetailModalPet(null);
            handleOpenEdit(pet);
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
