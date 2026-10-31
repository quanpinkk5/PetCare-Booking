import { useNavigate } from "react-router-dom";
import {
  Building2,
  Tag,
  Clock,
  Phone,
  CalendarCheck,
  RefreshCw,
  Utensils,
  Footprints,
  Camera,
  CheckCircle2,
  Headphones,
  PawPrint,
} from "lucide-react";

export default function QuickInfoSidebar({ diary }) {
  const navigate = useNavigate();
  const { facility, pet, summary, bookingId } = diary;

  return (
    <aside className="space-y-5">
      {/* 1. Thông tin nhanh */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">
          Thông tin nhanh
        </h3>

        <div className="space-y-3 text-xs">
          {/* Cơ sở */}
          <div className="flex items-start justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Building2 size={14} className="text-slate-400" />
              Cơ sở
            </span>
            <span className="text-right font-bold text-slate-800">
              {facility.name}
            </span>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Tag size={14} className="text-slate-400" />
              Trạng thái
            </span>
            <span className="font-bold text-emerald-600">
              {facility.status}
            </span>
          </div>

          {/* Thời gian gửi */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock size={14} className="text-slate-400" />
              Thời gian gửi
            </span>
            <span className="font-semibold text-slate-700">
              {facility.checkInTime}
            </span>
          </div>

          {/* Hotline */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Phone size={14} className="text-slate-400" />
              Hotline
            </span>
            <a
              href={`tel:${facility.phone}`}
              className="font-bold text-slate-800 hover:text-emerald-600 transition-colors"
            >
              {facility.phone}
            </a>
          </div>

          {/* Giờ hoạt động */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500">
              <CalendarCheck size={14} className="text-slate-400" />
              Giờ hoạt động
            </span>
            <span className="text-right font-medium text-slate-700">
              {facility.workingHours}
            </span>
          </div>

          {/* Cập nhật nhật ký */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-500">
              <RefreshCw size={14} className="text-slate-400" />
              Cập nhật nhật ký
            </span>
            <span className="font-bold text-slate-800">
              {facility.updateCount} lần cập nhật
            </span>
          </div>
        </div>
      </section>

      {/* 2. Tóm tắt chăm sóc */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">
          Tóm tắt chăm sóc
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Bữa ăn */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
              <Utensils size={14} />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Bữa ăn</span>
              <span className="font-bold text-slate-800">{summary.meals}</span>
            </div>
          </div>

          {/* Đi dạo */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <Footprints size={14} />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Đi dạo</span>
              <span className="font-bold text-slate-800">{summary.walks}</span>
            </div>
          </div>

          {/* Ảnh cập nhật */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <Camera size={14} />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Ảnh cập nhật</span>
              <span className="font-bold text-slate-800">{summary.photosCount} ảnh</span>
            </div>
          </div>

          {/* Cập nhật mới nhất */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-[#009879] shrink-0">
              <Clock size={14} />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Cập nhật mới nhất</span>
              <span className="font-bold text-slate-800">{summary.latestUpdate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Yêu cầu của chủ */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">
          Yêu cầu của chủ
        </h3>

        <div className="space-y-2.5">
          {pet.ownerRequests?.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">{req}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Liên hệ nhanh Banner */}
      <section
        onClick={() =>
          navigate("/messages", {
            state: {
              branchName: facility.name,
              bookingId: bookingId,
              petName: pet.name,
            },
          })
        }
        className="group relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white p-4 shadow-xs transition-all hover:shadow-md hover:border-emerald-300 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-200 text-[#009879] shadow-xs group-hover:scale-105 transition-transform">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Chat với {facility.name}
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                Đội ngũ chăm sóc luôn sẵn sàng hỗ trợ bạn 24/7.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-emerald-200/50">
            <PawPrint size={32} />
          </div>
        </div>
      </section>
    </aside>
  );
}
