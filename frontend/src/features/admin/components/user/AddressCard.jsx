
import { MapPin, MapPinned, Navigation } from 'lucide-react';

export default function AddressCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
          <MapPin size={14} className="text-emerald-600" />
        </div>

        <h3 className="text-sm font-bold text-slate-800">
          Địa chỉ
        </h3>
      </div>

      {/* Address information */}
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">
            Tỉnh/Thành phố
          </span>

          <div className="flex items-center gap-1.5">
            <MapPinned size={13} className="text-slate-400 shrink-0" />
            <span className="text-xs font-medium text-slate-700">
              Hà Nội
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">
            Quận/Huyện
          </span>

          <span className="text-xs font-medium text-slate-700">
            Cầu Giấy
          </span>
        </div>

        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">
            Địa chỉ chi tiết
          </span>

          <div className="flex items-start gap-1.5">
            <Navigation size={13} className="text-slate-400 shrink-0 mt-0.5" />

            <span className="text-xs leading-5 text-slate-700">
              123 Đường Dịch Vọng Hậu, Phường Dịch Vọng Hậu,
              Quận Cầu Giấy, Hà Nội
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}