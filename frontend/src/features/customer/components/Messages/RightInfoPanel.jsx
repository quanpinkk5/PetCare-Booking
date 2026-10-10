import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  FileText,
  Heart,
  PawPrint,
  Phone,
} from "lucide-react";

import { BOOKING_INFO, PET_INFO } from "../../data/messagesData";

const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="shrink-0 text-slate-500">{label}</span>
    <span className="text-right font-bold text-slate-800">{children}</span>
  </div>
);

const RightInfoPanel = ({ chat }) => {
  const navigate = useNavigate();
  const currentBooking = chat?.bookingInfo || BOOKING_INFO;
  const currentPet = chat?.petInfo || PET_INFO;

  return (
    <aside className="custom-scrollbar col-span-12 space-y-3.5 overflow-y-auto pr-0.5 lg:col-span-3">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
          <FileText size={16} className="text-[#009879]" />
          <span>Thông tin lịch đặt</span>
        </div>

        <div className="space-y-2 pt-3 text-xs">
          <InfoRow label="Mã booking">{currentBooking.id}</InfoRow>
          <InfoRow label="Dịch vụ">{currentBooking.service}</InfoRow>
          <InfoRow label="Chi nhánh">{currentBooking.branch}</InfoRow>
          <InfoRow label="Ngày giờ">{currentBooking.dateTime}</InfoRow>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-slate-500">Trạng thái</span>
            <span className="rounded-md border border-emerald-400 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#009879]">
              {currentBooking.status}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
          <PawPrint size={16} className="text-[#009879]" />
          <span>Thú cưng liên quan</span>
        </div>

        <div className="pt-3">
          <div className="mb-3 flex items-center space-x-3">
            <img
              src={currentPet.image}
              alt={currentPet.name}
              className="h-12 w-12 rounded-xl border border-slate-100 object-cover shadow-sm"
            />

            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {currentPet.name} <span className="text-blue-500">{currentPet.gender}</span>
              </h4>
              <p className="text-[11px] text-slate-500">{currentPet.breed}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-[11px]">
            <div>
              <span className="block text-[10px] text-slate-400">Cân nặng</span>
              <span className="font-bold text-slate-700">{currentPet.weight}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Đặc điểm cần lưu ý</span>
              <span className="block truncate font-semibold text-slate-700">{currentPet.note}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
          <CreditCard size={16} className="text-[#009879]" />
          <span>Hành động nhanh</span>
        </div>

        <div className="space-y-2 pt-3">
          <button
            type="button"
            onClick={() => navigate(`/my-bookings/${currentBooking.id}`)}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-[#009879] px-3 py-2 text-xs font-semibold text-[#009879] hover:bg-[#009879]/5 transition-colors cursor-pointer"
          >
            <FileText size={14} />
            <span>Xem chi tiết lịch đặt</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-pets")}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-[#009879] px-3 py-2 text-xs font-semibold text-[#009879] hover:bg-[#009879]/5 transition-colors cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Xem Pet Diary</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`Đang kết nối cuộc gọi tới ${chat?.name || "cơ sở"}...`)}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-[#009879] px-3 py-2 text-xs font-semibold text-[#009879] hover:bg-[#009879]/5 transition-colors cursor-pointer"
          >
            <Phone size={14} />
            <span>Gọi cơ sở</span>
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-[#f0fdf9] p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="max-w-[65%]">
            <h5 className="text-xs font-bold text-slate-800">Cần hỗ trợ thêm?</h5>
            <p className="mt-1 text-[10.5px] leading-snug text-slate-500">
              Đội ngũ PetCare luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
          </div>

          <div className="relative flex h-14 w-14 items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsxbzefvnaJHqtJpHkQmf9HXpv0psm69BK_AFD0rPHpFEYWErF96vCzXLNL-yZzIC3jbRr_BE_BBlp7jTtxXdOyTZaFvtG67Vv3EB8RybP0BOxL8IBxkYfIOfoBruvTaVGR5-sihJyg44yug8gjsCqKWJ0yOlwXY0w-SlT-8N6oVoLjzAPUe-P9ShtG3gSY7PJBLrOGIi8CSImHLdquYwVzErl_7QUbC8vk1o-ac"
              alt="Hỗ trợ"
              className="h-12 w-12 object-contain"
            />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#009879] text-white">
              <Heart size={10} className="fill-white" />
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightInfoPanel;