export default function StatCard({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
  isValueSmall = false,
}) {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor} ${textColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500">{title}</p>

          <p
            className={`mt-1 font-bold leading-tight text-slate-900 ${
              isValueSmall ? "text-base break-words" : "text-lg"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
