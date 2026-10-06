
export default function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  bgColor,
  textColor,
  isValueSmall = false,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${bgColor} ${textColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <p className="text-[12px] text-slate-500 font-medium">
            {title}
          </p>

          <p
            className={`font-bold text-slate-900 leading-none mt-1 ${
              isValueSmall
                ? 'text-base whitespace-nowrap'
                : 'text-lg'
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center text-[11px] text-emerald-600 font-medium">
        <span className="mr-1">▲</span>

        {growth}

        <span className="text-slate-400 ml-1">
          so với tháng trước
        </span>
      </div>
    </div>
  );
}