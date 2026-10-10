import React from 'react';

export default function BookingMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  {item.title}
                </p>

                <h4 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
                  {item.value}
                </h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}