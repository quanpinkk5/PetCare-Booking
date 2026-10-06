import { MapPin } from 'lucide-react';

export default function AddressCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">
          Địa chỉ
        </h3>
      </div>

      <div className="p-6">

        <div className="flex gap-4">

          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <MapPin size={20} className="text-slate-500" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Hà Nội
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Cầu Giấy
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Địa chỉ chi tiết của người dùng
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}