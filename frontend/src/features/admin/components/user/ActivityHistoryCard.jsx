import {
  User,
  CalendarCheck,
  Coins,
  Star,
} from 'lucide-react';

const activities = [
  {
    icon: User,
    title: 'Tạo tài khoản',
    description: 'Người dùng đăng ký tài khoản',
    time: '12/02/2025',
  },
  {
    icon: CalendarCheck,
    title: 'Đặt lịch #BK250212-0087',
    description: 'Người dùng tạo một booking mới',
    time: '20/02/2025',
  },
  {
    icon: Coins,
    title: 'Thanh toán thành công',
    description: 'Thanh toán booking #BK250212-0087',
    time: '20/02/2025',
  },
  {
    icon: Star,
    title: 'Đánh giá dịch vụ',
    description: 'Người dùng đánh giá 5 sao',
    time: '22/02/2025',
  },
];

export default function ActivityHistoryCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">
          Lịch sử hoạt động
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Các hoạt động gần đây của tài khoản
        </p>
      </div>

      <div className="p-6">

        <div className="space-y-6">

          {activities.map((activity, index) => {

            const Icon = activity.icon;

            return (
              <div
                key={index}
                className="flex gap-4"
              >

                <div className="relative">

                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon
                      size={18}
                      className="text-slate-500"
                    />
                  </div>

                  {index !== activities.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-slate-200" />
                  )}

                </div>

                <div className="flex-1">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="font-semibold text-slate-900">
                        {activity.title}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {activity.time}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}