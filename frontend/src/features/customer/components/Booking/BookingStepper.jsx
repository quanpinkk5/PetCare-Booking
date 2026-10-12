import {
  Check,
  PawPrint,
  MapPin,
  Scissors,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Chọn thú cưng",
    icon: PawPrint,
  },
  {
    number: 2,
    title: "Chọn cơ sở",
    icon: MapPin,
  },
  {
    number: 3,
    title: "Chọn dịch vụ",
    icon: Scissors,
  },
  {
    number: 4,
    title: "Chọn lịch",
    icon: CalendarDays,
  },
  {
    number: 5,
    title: "Xác nhận",
    icon: ClipboardCheck,
  },
];

const BookingStepper = ({ currentStep = 1 }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Đặt lịch dịch vụ
      </h1>

      <p className="mt-2 text-gray-500">
        Chọn thông tin phù hợp để đặt lịch chăm sóc cho thú cưng
      </p>

      <div className="mt-8 flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = step.number < currentStep;
          const active = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${
                      active
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-4 ring-emerald-100 scale-105"
                        : completed
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {completed && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-600 shadow border border-emerald-200">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <span
                  className={`mt-2 text-xs sm:text-sm text-center whitespace-nowrap ${
                    active
                      ? "font-bold text-emerald-600"
                      : completed
                      ? "font-medium text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 sm:mx-4 h-[2px] flex-1 rounded transition-colors ${
                    step.number < currentStep ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStepper;