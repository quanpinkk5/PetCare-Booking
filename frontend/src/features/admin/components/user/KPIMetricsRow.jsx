import {
  CalendarCheck,
  CheckCircle2,
  Coins,
  Star,
} from 'lucide-react';

const metrics = [
  {
    title: 'Tổng booking',
    value: '18',
    growth: '28.6%',
    description: 'so với tháng trước',
    icon: CalendarCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Booking hoàn thành',
    value: '15',
    growth: '30.0%',
    description: 'so với tháng trước',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Tổng chi tiêu',
    value: '6.750.000 đ',
    growth: '22.5%',
    description: 'so với tháng trước',
    icon: Coins,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Số đánh giá',
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
    <div className="grid grid-cols-4 gap-3">

      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.title}
            className="
              bg-white
              rounded-xl
              border
              border-slate-200
              shadow-sm
              px-4
              py-4
              min-h-[100px]
            "
          >

            <div className="flex items-center gap-3.5 h-full">

              {/* =========================
                  ICON
              ========================= */}
              <div
                className={`
                  w-11
                  h-11
                  rounded-full
                  ${metric.iconBg}
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={metric.iconColor}
                />
              </div>


              {/* =========================
                  INFORMATION
              ========================= */}
              <div className="min-w-0 flex-1">

                {/* Title */}
                <p className="text-[11px] text-slate-500 font-medium leading-4 whitespace-nowrap">
                  {metric.title}
                </p>

                {/* Value */}
                <p className="text-[18px] font-bold text-slate-800 leading-6 mt-0.5 whitespace-nowrap">
                  {metric.value}
                </p>

                {/* Growth */}
                <div className="flex items-center gap-1.5 mt-1">

                  <span className="text-[9px] font-semibold text-emerald-500">
                    ↑ {metric.growth}
                  </span>

                  <span className="text-[8px] text-slate-400 whitespace-nowrap">
                    {metric.description}
                  </span>

                </div>

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}