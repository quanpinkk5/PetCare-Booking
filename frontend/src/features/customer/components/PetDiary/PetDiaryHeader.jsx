import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PetDiaryHeader({ diary }) {
  const { bookingId, pet, facility } = diary;

  return (
    <div className="relative mb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
          <li>
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Trang chủ
            </Link>
          </li>
          <ChevronRight size={13} className="text-slate-400" />
          <li>
            <Link to="/my-bookings" className="hover:text-emerald-700 transition-colors">
              Lịch đặt của tôi
            </Link>
          </li>
          <ChevronRight size={13} className="text-slate-400" />
          <li>
            <Link
              to={`/my-bookings/${diary.bookingRecordId || bookingId}`}
              className="hover:text-emerald-700 transition-colors"
            >
              {bookingId}
            </Link>
          </li>
          <ChevronRight size={13} className="text-slate-400" />
          <li className="text-slate-800 font-semibold" aria-current="page">
            Pet Diary
          </li>
        </ol>
      </nav>

      {/* Main Title and Badge */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Nhật ký chăm sóc - {pet.name}
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {facility.status}
        </span>
      </div>

      {/* Subtitle */}
      <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
        Booking #{bookingId} &bull; {facility.name}
      </p>
    </div>
  );
}
