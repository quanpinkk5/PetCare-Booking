import { MapPin, MapPinned, Navigation, Map } from "lucide-react";
const displayValue = (value) => {
  if (typeof value !== "string") {
    return "Chưa cập nhật";
  }

  return value.trim() || "Chưa cập nhật";
};

export default function AddressCard({ user }) {
  if (!user) return null;

  // Schema User.address hiện đang là Mixed.
  // Chỉ đọc dữ liệu nếu address là object hợp lệ.
  const address =
    user.address &&
    typeof user.address === "object" &&
    !Array.isArray(user.address)
      ? user.address
      : {};

  const province = displayValue(address.province);
  const district = displayValue(address.district);
  const detail = displayValue(address.detail);

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
          <MapPin size={14} className="text-emerald-600" />
        </div>

        <h3 className="text-sm font-bold text-slate-800">Địa chỉ</h3>
      </div>

      {/* Address information */}
      <div className="px-4 py-3 space-y-3">
        {/* Tỉnh/Thành phố */}
        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">Tỉnh/Thành phố</span>

          <div className="flex items-center gap-1.5 min-w-0">
            <MapPinned size={13} className="text-slate-400 shrink-0" />

            <span className="text-xs font-medium text-slate-700 break-words">
              {province}
            </span>
          </div>
        </div>

        {/* Quận/Huyện */}
        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">Quận/Huyện</span>

          <div className="flex items-center gap-1.5 min-w-0">
            <Map size={13} className="text-slate-400 shrink-0" />

            <span className="text-xs font-medium text-slate-700 break-words">
              {district}
            </span>
          </div>
        </div>

        {/* Địa chỉ chi tiết */}
        <div className="grid grid-cols-[42%_58%] gap-2 items-start">
          <span className="text-xs text-slate-500">Địa chỉ chi tiết</span>

          <div className="flex items-start gap-1.5 min-w-0">
            <Navigation size={13} className="text-slate-400 shrink-0 mt-0.5" />

            <span className="text-xs leading-5 text-slate-700 break-words">
              {detail}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
