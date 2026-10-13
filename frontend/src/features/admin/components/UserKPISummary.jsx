import {
  Users,
  User,
  Store,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function UserKPISummary() {
  const kpis = [
    {
      title: 'Tổng người dùng',
      value: '12.458',
      growth: '18.5%',
      icon: Users,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Khách hàng',
      value: '9.842',
      growth: '15.2%',
      icon: User,
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-500',
    },
    {
      title: 'Chủ cơ sở',
      value: '2.316',
      growth: '21.7%',
      icon: Store,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Quản trị viên',
      value: '28',
      growth: '12.5%',
      icon: ShieldCheck,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-500',
    },
    {
      title: 'Tài khoản bị khóa',
      value: '272',
      growth: '8.3%',
      icon: Lock,
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5"
          >
            <div
              className={`w-12 h-12 rounded-xl ${kpi.bgColor} ${kpi.textColor} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <span className="text-xs text-slate-500 font-medium truncate block">
                {kpi.title}
              </span>

              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {kpi.value}
              </h3>

              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                ▲ {kpi.growth}

                <span className="text-slate-400 font-normal">
                  so với tháng trước
                </span>
              </span>
            </div>
          </div>
        );
      })}

    </section>
  );
}