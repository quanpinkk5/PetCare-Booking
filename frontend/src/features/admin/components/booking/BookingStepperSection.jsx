import React from 'react';
import {
  Calendar,
  Check,
  IdCard,
  PawPrint,
  Trophy,
} from 'lucide-react';

export default function BookingStepperSection() {
  const steps = [
    {
      label: 'PENDING',
      time: '26/08/2025 09:15',
      icon: Calendar,
      status: 'completed',
    },
    {
      label: 'CONFIRMED',
      time: '26/08/2025 09:20',
      icon: Check,
      status: 'completed',
    },
    {
      label: 'CHECKED_IN',
      time: '26/08/2025 10:00',
      icon: IdCard,
      status: 'completed',
    },
    {
      label: 'IN_PROGRESS',
      time: '26/08/2025 10:05',
      icon: PawPrint,
      status: 'active',
    },
    {
      label: 'COMPLETED',
      time: '-',
      icon: Trophy,
      status: 'upcoming',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-6">
        Tiến trình booking
      </h3>

      <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10 text-center"
            >
              {/* Active */}
              {step.status === 'active' && (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm shadow-blue-200 ring-4 ring-blue-50">
                  <StepIcon className="w-4 h-4 fill-current" />
                </div>
              )}

              {/* Completed */}
              {step.status === 'completed' && (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <StepIcon className="w-4 h-4" />
                </div>
              )}

              {/* Upcoming */}
              {step.status === 'upcoming' && (
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-300 mb-2 shadow-sm">
                  <StepIcon className="w-4 h-4" />
                </div>
              )}

              <span
                className={`text-xs font-bold uppercase tracking-tight ${
                  step.status === 'active'
                    ? 'text-blue-600'
                    : step.status === 'completed'
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>

              <span className="text-[11px] text-slate-400 mt-0.5">
                {step.time}
              </span>
            </div>
          );
        })}

        {/* Connecting Line */}
        <div className="absolute top-5 left-12 right-12 h-[2px] bg-slate-200 -z-0">
          <div className="h-full bg-blue-500 w-3/4" />
        </div>
      </div>
    </div>
  );
}