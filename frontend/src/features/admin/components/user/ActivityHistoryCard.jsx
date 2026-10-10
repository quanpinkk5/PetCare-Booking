import {
  History,
  UserPlus,
  CalendarCheck,
  CreditCard,
  Star,
} from 'lucide-react';

const activities = [
  {
    id: 1,
    date: '12/02/2025',
    time: '14:30',
    title: 'Đăng ký tài khoản',
    source: 'Hệ thống',
    icon: UserPlus,
  },
  {
    id: 2,
    date: '12/02/2025',
    time: '16:20',
    title: 'Tạo booking #BK250212-0087',
    source: 'Happy Paws Spa',
    icon: CalendarCheck,
  },
  {
    id: 3,
    date: '12/02/2025',
    time: '16:45',
    title: 'Thanh toán thành công',
    source: 'VNPAY',
    icon: CreditCard,
  },
  {
    id: 4,
    date: '12/02/2025',
    time: '17:10',
    title: 'Gửi đánh giá 5 sao',
    source: 'Happy Paws Spa',
    icon: Star,
  },
];

export default function ActivityHistoryCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
          <History size={15} className="text-emerald-500" />
        </div>

        <h3 className="text-sm font-semibold text-slate-800">
          Lịch sử hoạt động
        </h3>
      </div>

      {/* Activity timeline */}
      <div className="px-4 py-2">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[5px] top-3 bottom-3 w-px bg-emerald-100" />

          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="relative flex items-center min-h-[32px] py-1"
              >
                {/* Timeline dot */}
                <div className="relative z-10 w-[11px] h-[11px] rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-100 flex-shrink-0" />

                {/* Date + time */}
                <div className="ml-3 w-[82px] flex-shrink-0">
                  <p className="text-[9px] text-slate-400 leading-tight">
                    {activity.date}
                  </p>

                  <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                    {activity.time}
                  </p>
                </div>

                {/* Activity */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Icon
                    size={11}
                    className="text-slate-400 flex-shrink-0"
                  />

                  <span className="text-[10px] font-medium text-slate-700 truncate">
                    {activity.title}
                  </span>
                </div>

                {/* Source */}
                <div className="w-[90px] text-right flex-shrink-0">
                  <span className="text-[9px] text-slate-400 truncate block">
                    {activity.source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}