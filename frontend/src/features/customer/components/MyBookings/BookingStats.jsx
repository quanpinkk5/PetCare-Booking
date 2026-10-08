const BookingStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-all ${stat.hover}`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${stat.bg} ${stat.color}`}
            >
              <Icon size={22} />
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {stat.title}
              </span>

              <span className="text-2xl font-black text-slate-800">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingStats;