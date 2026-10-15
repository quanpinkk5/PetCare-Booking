import {
  Calendar,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function PetDiaryFilters({
  searchTerm,
  onSearchChange,
  selectedPet,
  onAddDiary,
}) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
        {/* 1. Ô tìm kiếm nhập text đưa sang BÊN TRÁI CÙNG */}
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm tên bé, chủ nuôi, phòng..."
            className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* 2. Ngày */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            Ngày:
          </label>
          <div className="relative">
            <input
              type="text"
              value="22/05/2025"
              readOnly
              className="text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium w-32 outline-none"
            />
            <Calendar
              size={13}
              className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* 3. Chi nhánh & Loại hoạt động */}
        <div className="flex items-center gap-2">
          <select
            defaultValue="all"
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="all">Tất cả chi nhánh</option>
            <option value="cầu giấy">Happy Pet Cầu Giấy</option>
            <option value="đống đa">Happy Pet Đống Đa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            defaultValue="all"
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="all">Tất cả hoạt động</option>
            <option value="meal">Ăn uống</option>
            <option value="exercise">Vận động</option>
            <option value="grooming">Grooming</option>
            <option value="rest">Nghỉ ngơi</option>
            <option value="med">Uống thuốc</option>
          </select>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 font-medium transition text-xs cursor-pointer"
        >
          <SlidersHorizontal size={13} />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* 4. Nút Thêm cập nhật: CHỈ HIỂN THỊ KHI ĐÃ CHỌN 1 DÒNG */}
      {selectedPet && (
        <button
          type="button"
          onClick={() => onAddDiary?.(selectedPet)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-xs transition text-xs cursor-pointer animate-in fade-in zoom-in-95 duration-150"
        >
          <Plus size={15} />
          <span>Thêm cập nhật ({selectedPet.name})</span>
        </button>
      )}
    </section>
  );
}
