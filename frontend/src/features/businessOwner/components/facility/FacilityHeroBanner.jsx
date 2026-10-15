import {
  PawPrint,
  CalendarDays,
  ShieldCheck,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FacilityHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-100/60 bg-gradient-to-r from-[#EAF8F4] via-[#F2FAF7] to-[#EEF8F5] p-6 shadow-sm">
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-emerald-400 bg-white p-1 shadow-sm">
              <PawPrint size={32} className="text-emerald-500" />
              <span className="mt-0.5 text-[9px] font-bold tracking-tight text-slate-700">
                Happy Pet
              </span>
            </div>

            <button
              type="button"
              aria-label="Chỉnh sửa ảnh đại diện"
              className="absolute bottom-0 right-0 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow transition-colors hover:text-emerald-600"
            >
              <Edit2 size={12} />
            </button>
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Happy Pet - Cầu Giấy
              </h2>

              <span className="rounded border border-emerald-300/40 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Approved
              </span>
            </div>

            <p className="mb-3 max-w-xl text-xs leading-relaxed text-slate-600">
              Happy Pet - Cầu Giấy cung cấp các dịch vụ chăm sóc thú cưng
              chuyên nghiệp với đội ngũ yêu thú cưng và không gian thân thiện.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5 rounded-md border border-emerald-100 bg-white/70 px-2.5 py-1">
                <CalendarDays size={14} className="text-emerald-600" />
                <span>Tham gia từ 22/05/2024</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-md border border-emerald-100 bg-white/70 px-2.5 py-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Mã cơ sở: HP-CG-001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2.5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-[#009879] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#008267]"
            >
              <Edit2 size={14} />
              Chỉnh sửa hồ sơ
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span>Xem trang công khai</span>
              <ExternalLink size={14} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-28 w-44 overflow-hidden opacity-40 lg:block">
        <img
          alt="Hình minh họa thú cưng"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKo8H7rZxgcUzEbDrLnNquzfv7Qld6UiCBG99mrPeGz6KKSmql0dM0i8vGX8Zq-TIVH1Cx2ZMwu4fanXNFi33sxyABkBeJcyfSmdV_n-jQk5w_gp_I0e-0dPtpqhkDQsIfd14VYojlM5gzAHbnqKM_IHxvyh_N_ilTErfuU941pTX_soE9R7dpFAdHJr4gHF4xkLKGmJe4VYUSMeU7paiqR_SS_8krXp2Hn_eb_R84AcESGl4F3QSK"
          className="h-full w-full object-cover"
          style={{ maskImage: "linear-gradient(to right, transparent, black)" }}
        />
      </div>
    </section>
  );
}