import {
  Check,
  PawPrint,
  MapPin,
  Scissors,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Chọn thú cưng",
    subtitle: "Thông tin bé cưng",
    targetId: "step-pet",
    icon: PawPrint,
  },
  {
    number: 2,
    title: "Chọn cơ sở",
    subtitle: "Chi nhánh gần bạn",
    targetId: "step-branch",
    icon: MapPin,
  },
  {
    number: 3,
    title: "Chọn dịch vụ",
    subtitle: "Gói spa & chăm sóc",
    targetId: "step-service",
    icon: Scissors,
  },
  {
    number: 4,
    title: "Chọn lịch",
    subtitle: "Ngày & khung giờ",
    targetId: "step-datetime",
    icon: CalendarDays,
  },
  {
    number: 5,
    title: "Xác nhận",
    subtitle: "Tóm tắt & thanh toán",
    targetId: "step-summary",
    icon: ClipboardCheck,
  },
];

const BookingStepper = ({ currentStep = 1 }) => {
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (steps.length - 1)) * 100));

  const handleStepClick = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mb-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-2 shadow-xs">
            <Sparkles size={13} className="text-emerald-500 animate-pulse" />
            <span>Quy trình đặt lịch tiêu chuẩn 5 sao</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Đặt lịch chăm sóc thú cưng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hoàn tất thông tin bên dưới để đặt chỗ nhanh chóng và nhận ưu đãi độc quyền.
          </p>
        </div>

        {/* Progress badge */}
        <div className="shrink-0 bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-500 ease-out"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800">
              {progressPercent}%
            </span>
          </div>
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Tiến độ
            </p>
            <p className="text-xs font-bold text-slate-700">
              Bước {currentStep} / {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const completed = step.number < currentStep;
            const active = step.number === currentStep;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => handleStepClick(step.targetId)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-500/80 shadow-sm shadow-emerald-500/10 ring-2 ring-emerald-400/20"
                    : completed
                    ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/70"
                    : "bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-200"
                        : completed
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300"
                    }`}
                  >
                    <Icon size={16} />
                    {completed && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs border border-emerald-200">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      active
                        ? "text-emerald-700"
                        : completed
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    Bước {step.number}
                  </span>
                </div>

                <p
                  className={`text-xs font-bold truncate ${
                    active
                      ? "text-slate-900"
                      : completed
                      ? "text-slate-800"
                      : "text-slate-600"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate hidden lg:block mt-0.5">
                  {step.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStepper;