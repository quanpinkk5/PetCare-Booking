import { useNavigate } from "react-router-dom";
import {
  Dog,
  Calendar,
  Weight,
  Home,
  MessageCircle,
  FileText,
  ShieldAlert,
} from "lucide-react";

export default function PetOverviewCard({ diary }) {
  const navigate = useNavigate();
  const { pet, bookingId, bookingRecordId, facility } = diary;

  // Calculate boarding progress percent
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((pet.currentDay || 1) / (pet.totalDays || 1)) * 100))
  );

  return (
    <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Pet info & Boarding timeline (Col 1-7) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:col-span-7">
          {/* Pet Avatar */}
          <div className="relative shrink-0">
            <img
              src={pet.avatar}
              alt={pet.name}
              className="h-22 w-22 sm:h-24 sm:w-24 rounded-2xl border-2 border-emerald-100 object-cover shadow-xs"
            />
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-2.5 min-w-0">
            {/* Name & Gender */}
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {pet.name}
              </h2>
              <span className={`text-base font-bold ${pet.genderColor || "text-blue-500"}`}>
                {pet.genderSymbol || "♂"}
              </span>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 font-medium border border-slate-200/70">
                <Dog size={13} className="text-slate-500" />
                {pet.breed}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 font-medium border border-slate-200/70">
                <Calendar size={13} className="text-slate-500" />
                {pet.age}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 font-medium border border-slate-200/70">
                <Weight size={13} className="text-slate-500" />
                {pet.weight}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 font-medium border border-slate-200/70">
                <Home size={13} className="text-slate-500" />
                {pet.service}
              </span>
            </div>

            {/* Check-in / Check-out & Progress */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-0.5 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-emerald-600" />
                <span className="text-slate-400">Check-in:</span>
                <span className="font-semibold text-slate-700">{pet.checkInDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-emerald-600" />
                <span className="text-slate-400">Check-out:</span>
                <span className="font-semibold text-slate-700">{pet.checkOutDate}</span>
              </div>

              {/* Day Progress */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-1">
                <span className="font-semibold text-slate-800 text-[11px]">
                  Ngày {pet.currentDay} / {pet.totalDays}
                </span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Box: Care Notes (Col 8-9) */}
        <div className="lg:col-span-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 shadow-2xs">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldAlert size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-900">Lưu ý chăm sóc:</p>
              <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                {pet.careNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions (Col 10-12) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:col-span-2">
          {/* Message facility button */}
          <button
            type="button"
            onClick={() =>
              navigate("/messages", {
                state: {
                  branchName: facility.name,
                  bookingId: bookingId,
                  petName: pet.name,
                },
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#009879] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#009879] transition-all hover:bg-emerald-50/50 hover:shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>Nhắn tin cơ sở</span>
          </button>

          {/* View booking details button */}
          <button
            type="button"
            onClick={() =>
              navigate(`/my-bookings/${bookingRecordId || bookingId}`)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-red-600 hover:shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <FileText size={15} />
            <span>Xem chi tiết booking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
