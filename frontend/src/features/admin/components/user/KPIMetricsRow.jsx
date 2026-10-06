import {
  CalendarCheck,
  CheckCircle2,
  Coins,
  Star,
} from 'lucide-react';

const metrics = [
  {
    label: 'Tổng booking',
    value: '18',
    growth: '28.4%',
    description: 'so với tháng trước',
    icon: CalendarCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Booking hoàn thành',
    value: '15',
    growth: '30.0%',
    description: 'so với tháng trước',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Tổng chi tiêu',
    value: '6.750.000 đ',
    growth: '22.4%',
    description: 'so với tháng trước',
    icon: Coins,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    label: 'Số đánh giá',
    value: '12',
    growth: '20.0%',
    description: 'so với tháng trước',
    icon: Star,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
];

export default function KPIMetricsRow() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="bg-white rounded-xl border border-slate-200
                       p-4 shadow-sm min-w-0"
          >

            {/* Top */}
            <div className="flex items-start justify-between gap-2">

              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${metric.iconBg}`}
              >
                <Icon
                  size={16}
                  className={metric.iconColor}
                />
              </div>

            </div>


            {/* Label */}
            <p className="text-[11px] text-slate-500 mt-3">
              {metric.label}
            </p>


            {/* Value */}
            <p className="text-lg font-bold text-slate-900 mt-1 whitespace-nowrap">
              {metric.value}
            </p>


            {/* Growth */}
            <div className="flex items-center gap-1 mt-2">

              <span className="text-[10px] font-semibold text-emerald-600">
                ↑ {metric.growth}
              </span>

              <span className="text-[9px] text-slate-400">
                {metric.description}
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}