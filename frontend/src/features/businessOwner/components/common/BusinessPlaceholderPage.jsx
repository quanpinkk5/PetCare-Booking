import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function BusinessPlaceholderPage({
  title = "Trang quản trị",
  description = "Tính năng này đang được tối ưu hóa và sẽ sẵn sàng trong bản cập nhật tiếp theo.",
  badge = "Đang phát triển",
}) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/business/dashboard"
            className="hover:text-emerald-600 transition"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{title}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/business/dashboard")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Về Dashboard</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <Sparkles size={13} className="text-emerald-600" />
                {badge}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">{description}</p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-emerald-200/60 shadow-sm text-3xl">
              ⚙️
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <Construction size={32} />
          </div>

          <h3 className="text-base font-bold text-slate-800">
            Khu vực quản lý {title}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
            Giao diện chi tiết cho mục này đang được xây dựng. Bạn có thể quay lại
            bảng điều khiển chính (Dashboard) để tiếp tục thao tác.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/business/dashboard")}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
            >
              Quay lại Dashboard
            </button>
            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Trang chủ PetCare
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
