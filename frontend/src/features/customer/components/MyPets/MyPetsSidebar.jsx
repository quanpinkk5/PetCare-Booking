import { Link } from 'react-router-dom';
import {
  PawPrint,
  CheckCircle2,
  Bell,
  CalendarDays,
  ChevronRight,
  MessageCircle,
  Heart,
} from 'lucide-react';

const REMINDERS = [
  {
    id: 1,
    petName: 'Milo',
    type: 'Tiêm định kỳ',
    date: '18/05/2024',
    remaining: 'Còn 15 ngày',
  },
  {
    id: 2,
    petName: 'Mimi',
    type: 'Grooming lông',
    date: '22/05/2024',
    remaining: 'Còn 19 ngày',
  },
  {
    id: 3,
    petName: 'Bella',
    type: 'Tắm & vệ sinh',
    date: '25/05/2024',
    remaining: 'Còn 22 ngày',
  },
];

const MyPetsSidebar = () => {
  return (
    <aside className="lg:col-span-4 xl:col-span-3 space-y-5">
      {/* Tips */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-800">
            Mẹo chăm sóc hồ sơ thú cưng
          </h3>

          <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PawPrint size={12} />
          </span>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-600">
          {[
            'Cập nhật thông tin thú cưng đầy đủ',
            'Thêm ảnh rõ nét và đáng yêu',
            'Ghi chú thói quen & sức khỏe',
            'Giữ hồ sơ luôn được cập nhật',
          ].map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2
                size={12}
                className="text-emerald-500 mt-0.5 shrink-0"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
          Hồ sơ đầy đủ giúp bạn đặt dịch vụ nhanh hơn!
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">
            Nhắc lịch tiêm / grooming
          </h3>

          <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-500 flex items-center justify-center">
            <Bell size={12} />
          </span>
        </div>

        <div className="space-y-3">
          {REMINDERS.map((reminder, index) => (
            <div
              key={reminder.id}
              className={`flex items-center justify-between text-xs ${
                index < 2
                  ? 'pb-2 border-b border-slate-100'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <CalendarDays size={12} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {reminder.petName}
                  </h4>

                  <p className="text-[11px] text-slate-500">
                    {reminder.type}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-700 block">
                  {reminder.date}
                </span>

                <span className="text-[10px] text-emerald-600 font-medium">
                  {reminder.remaining}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/booking"
          className="mt-4 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-slate-100 text-emerald-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
        >
          Xem tất cả lịch nhắc
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-5 border border-emerald-100 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="text-sm font-bold text-slate-800">
              Bạn cần hỗ trợ?
            </h3>

            <p className="text-xs text-slate-600 mt-1">
              Đội ngũ PetCare luôn sẵn sàng giúp bạn và thú cưng yêu quý!
            </p>
          </div>

          <div className="w-16 h-16 shrink-0 relative">
            <img
              alt="Support"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNnQgTWV0Jjcv-LCJxUJmcR_E0EQBE_QweRcfbeEEBsoMbCgPm3x4KFLG83vTjiW58VhoGcW-2VD0py4paWbRuzI-Z6WG2Lj6qA6gJ2-flesPLnLfzV-XmgDZdJsM_121RzsZw1_sB4dkli82ClDBzohJRY9SYdlvoDbhuVwPQIrGlzs-TjqZdUhVkolB1mnwipNTVEQLvUwwHmhzKgDzLJYME3t2XEPTUvwAJfPk"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-300"
            />

            <span className="absolute -top-1 -right-1 text-rose-500">
              <Heart
                size={14}
                className="fill-rose-500 animate-pulse"
              />
            </span>
          </div>
        </div>

        <button className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition">
          <MessageCircle size={14} />
          <span>Chat với chúng tôi</span>
        </button>
      </div>
    </aside>
  );
};

export default MyPetsSidebar;