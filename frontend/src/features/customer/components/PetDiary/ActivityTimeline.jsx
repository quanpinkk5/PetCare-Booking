import {
  Utensils,
  Footprints,
  Moon,
  Sparkles,
  FileCheck,
} from "lucide-react";

// Color mapping for activities
const activityThemeMap = {
  emerald: {
    iconBg: "bg-emerald-100 text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: Utensils,
  },
  blue: {
    iconBg: "bg-blue-100 text-blue-600",
    badgeBg: "bg-blue-50 text-blue-600 border-blue-100",
    icon: Footprints,
  },
  purple: {
    iconBg: "bg-purple-100 text-purple-600",
    badgeBg: "bg-purple-50 text-purple-600 border-purple-100",
    icon: Moon,
  },
  orange: {
    iconBg: "bg-orange-100 text-orange-600",
    badgeBg: "bg-orange-50 text-orange-600 border-orange-100",
    icon: Sparkles,
  },
  slate: {
    iconBg: "bg-slate-100 text-slate-600",
    badgeBg: "bg-slate-100 text-slate-600 border-slate-200",
    icon: FileCheck,
  },
};

export default function ActivityTimeline({ activities = [], onImageClick, dateLabel }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Title */}
      <h3 className="mb-6 text-base font-bold text-slate-900 tracking-tight">
        Hoạt động ngày {dateLabel}
      </h3>

      {activities.length === 0 && <p className="text-sm text-slate-500">Cơ sở chưa cập nhật hoạt động cho ngày này.</p>}
      {/* Timeline items */}
      <div className="relative space-y-6">
        {activities.map((item, index) => {
          const theme = activityThemeMap[item.color] || activityThemeMap.slate;
          const IconComponent = theme.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={item.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Left: Time */}
              <div className="w-12 sm:w-14 shrink-0 pt-1 text-right">
                <span className="text-xs font-bold text-slate-700">
                  {item.time}
                </span>
              </div>

              {/* Middle: Icon node and vertical connecting line */}
              <div className="relative flex flex-col items-center shrink-0">
                {/* Node icon */}
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${theme.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <IconComponent size={15} />
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute top-8 bottom-[-24px] w-[2px] bg-slate-100" />
                )}
              </div>

              {/* Right: Content & Image Thumbnails */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Text details */}
                  <div className="space-y-1 max-w-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold border tracking-wide uppercase ${theme.badgeBg}`}
                      >
                        {item.tagLabel || item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Activity Photo(s) */}
                  {item.images && item.images.length > 0 && (
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      {item.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() =>
                            onImageClick?.(imgUrl, item.title, item.time)
                          }
                          className="group/img relative h-14 w-20 sm:h-16 sm:w-24 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`${item.title} - ${imgIdx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
