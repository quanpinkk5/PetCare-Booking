import { useMemo, useState } from "react";
import { BOARDING_PETS, TIMELINE } from "../../data/boardingData";
import BoardingHeader from "../../components/boarding/BoardingHeader";
import BoardingFilters from "../../components/boarding/BoardingFilters";
import BoardingTable from "../../components/boarding/BoardingTable";
import BoardingDetailModal from "../../components/boarding/BoardingDetailModal";
import AddDiaryModal from "../../components/boarding/AddDiaryModal";
import CheckoutModal from "../../components/boarding/CheckoutModal";

export default function BoardingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [petsList, setPetsList] = useState(BOARDING_PETS);
  const [timelineList, setTimelineList] = useState(TIMELINE);

  const [selectedDetailPet, setSelectedDetailPet] = useState(null);
  const [diaryModalPet, setDiaryModalPet] = useState(null);
  const [checkoutModalPet, setCheckoutModalPet] = useState(null);

  const [selectedPet, setSelectedPet] = useState(
    BOARDING_PETS.find((pet) => pet.isActive) ?? BOARDING_PETS[0]
  );

  const filteredPets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return petsList.filter((pet) => {
      const matchesSearch =
        !keyword ||
        pet.name.toLowerCase().includes(keyword) ||
        pet.owner.toLowerCase().includes(keyword) ||
        pet.roomName.toLowerCase().includes(keyword) ||
        pet.type.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || pet.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [petsList, searchTerm, statusFilter]);

  function handleSelectPet(pet) {
    setSelectedPet(pet);
  }

  function handleViewDetail(pet) {
    setSelectedPet(pet);
    setSelectedDetailPet(pet);
  }

  function handleAddDiary(pet) {
    setDiaryModalPet(pet || selectedPet);
  }

  function handleCheckout(pet) {
    setCheckoutModalPet(pet || selectedPet);
  }

  function handleSaveDiary(diaryData) {
    setTimelineList((prev) => [diaryData, ...prev]);
  }

  function handleConfirmCheckout(petToCheckout) {
    setPetsList((prev) =>
      prev.map((item) =>
        item.id === petToCheckout.id
          ? {
            ...item,
            status: "ĐÃ CHECK-OUT",
            statusClass: "bg-slate-100 text-slate-600",
            checkoutDate: "Hôm nay",
            checkoutColor: "text-slate-400",
            checkoutStatus: "Đã hoàn thành",
          }
          : item
      )
    );

    setSelectedPet((prev) =>
      prev?.id === petToCheckout.id
        ? {
          ...prev,
          status: "ĐÃ CHECK-OUT",
          statusClass: "bg-slate-100 text-slate-600",
          checkoutDate: "Hôm nay",
          checkoutColor: "text-slate-400",
          checkoutStatus: "Đã hoàn thành",
        }
        : prev
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 justify-end">
      {/* 1. Header trang */}
      <BoardingHeader onNewBoarding={() => handleAddDiary(selectedPet)} />
      {/* 3. Nội dung chính & Sidebar hài hòa */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-4">
        {/* Cột trái: Bộ lọc & Bảng danh sách thú cưng */}
        <div className="space-y-4 xl:col-span-8 min-w-0">
          <BoardingFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onReset={() => {
              setStatusFilter("all");
              setSearchTerm("");
            }}
          />

          <BoardingTable
            pets={filteredPets}
            selectedPetId={selectedPet?.id}
            onSelectPet={handleSelectPet}
            onViewDetail={handleViewDetail}
          />
        </div>
      </div>

      {/* 4. Modal Xem chi tiết (có 2 hành động: Nhật ký & Check-out) */}
      {selectedDetailPet && (
        <BoardingDetailModal
          pet={selectedDetailPet}
          onClose={() => setSelectedDetailPet(null)}
          onAddDiary={(pet) => {
            setSelectedDetailPet(null);
            handleAddDiary(pet);
          }}
          onCheckout={(pet) => {
            setSelectedDetailPet(null);
            handleCheckout(pet);
          }}
        />
      )}

      {/* 5. Modal Thêm nhật ký */}
      {diaryModalPet && (
        <AddDiaryModal
          pet={diaryModalPet}
          onClose={() => setDiaryModalPet(null)}
          onSave={handleSaveDiary}
        />
      )}

      {/* 6. Modal Xác nhận Check-out */}
      {checkoutModalPet && (
        <CheckoutModal
          pet={checkoutModalPet}
          onClose={() => setCheckoutModalPet(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}
    </div>
  );
}