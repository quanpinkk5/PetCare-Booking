import {
  Clock,
  Calendar,
  FileCheck2,
  Copy,
} from 'lucide-react';

export default function BusinessStatusBanner({
  onCopyCode,
  copied,
  facility,
  code = 'BIZ250522-0987',
}) {
  const status = facility?.status || 'Chờ duyệt';
  const registerDate = facility
    ? `${facility.registerDate} ${facility.registerTime || '14:18'}`
    : '22/05/2025 14:18';
  const displayCode = facility ? `BIZ250522-000${facility.id}` : code;

  const getStatusColor = (st) => {
    switch (st) {
      case 'Đã duyệt':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          textColor: 'text-emerald-600',
        };
      case 'Tạm khóa':
      case 'Từ chối':
        return {
          iconBg: 'bg-rose-50 text-rose-500',
          textColor: 'text-rose-500',
        };
      case 'Chờ duyệt':
      default:
        return {
          iconBg: 'bg-amber-50 text-amber-500',
          textColor: 'text-amber-500',
        };
    }
  };

  const statusStyle = getStatusColor(status);

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Trạng thái */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusStyle.iconBg}`}>
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <div className="text-xs text-slate-400 font-medium">
            Trạng thái hồ sơ
          </div>

          <div className={`text-base font-bold ${statusStyle.textColor}`}>
            {status}
          </div>
        </div>
      </div>

      {/* Ngày đăng ký */}
      <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>

        <div>
          <div className="text-xs text-slate-400 font-medium">
            Ngày đăng ký
          </div>

          <div className="text-sm font-semibold text-slate-800">
            {registerDate}
          </div>
        </div>
      </div>

      {/* Mã hồ sơ */}
      <div className="flex items-center justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">
              Mã hồ sơ
            </div>

            <div className="text-sm font-semibold text-slate-800">
              {displayCode}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopyCode}
          title="Sao chép mã hồ sơ"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {copied ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              Đã chép
            </span>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </section>
  );
}