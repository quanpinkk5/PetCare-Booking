import React from "react";

import { Calendar, Check, PawPrint, Trophy, XCircle } from "lucide-react";

const NORMAL_STEPS = [
  {
    status: "PENDING",
    label: "CHỜ XÁC NHẬN",
    icon: Calendar,
  },
  {
    status: "CONFIRMED",
    label: "ĐÃ XÁC NHẬN",
    icon: Check,
  },
  {
    status: "IN_PROGRESS",
    label: "ĐANG THỰC HIỆN",
    icon: PawPrint,
  },
  {
    status: "COMPLETED",
    label: "HOÀN THÀNH",
    icon: Trophy,
  },
];

const CANCELLED_STEP = {
  status: "CANCELLED",
  label: "ĐÃ HỦY",
  icon: XCircle,
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export default function BookingStepperSection({
  status = "PENDING",
  statusHistory = [],
  createdAt,
}) {
  // Sắp xếp lịch sử theo thời gian
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime(),
  );

  const findHistory = (stepStatus) =>
    [...sortedHistory].reverse().find((entry) => entry.status === stepStatus);

  const isCancelled = status === "CANCELLED";

  // Booking bị hủy chỉ hiển thị
  // các bước đã thực sự xảy ra.
  const steps = isCancelled
    ? [
        ...NORMAL_STEPS.filter(
          (step) =>
            step.status !== "COMPLETED" &&
            sortedHistory.some((item) => item.status === step.status),
        ),
        CANCELLED_STEP,
      ]
    : NORMAL_STEPS;

  const currentIndex = steps.findIndex((step) => step.status === status);

  const stepCount = steps.length;

  // Đường nối bắt đầu từ tâm ô đầu tiên
  // và kết thúc tại tâm ô cuối cùng.
  const lineInsetPercent = 50 / stepCount;

  const lineWidthPercent = 100 - 2 * lineInsetPercent;

  const progressPercent =
    stepCount <= 1 || currentIndex < 0
      ? 0
      : (currentIndex / (stepCount - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-6">
        Tiến trình booking
      </h3>

      <div className="overflow-x-auto">
        <div className="relative max-w-4xl min-w-[520px] mx-auto">
          {/* ĐƯỜNG NỐI CĂN THEO TÂM CÁC ICON */}
          <div
            className="absolute top-5 h-[2px] bg-slate-200"
            style={{
              left: `${lineInsetPercent}%`,
              width: `${lineWidthPercent}%`,
            }}
          >
            <div
              className={`h-full transition-all ${
                isCancelled ? "bg-rose-500" : "bg-blue-500"
              }`}
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          {/* DANH SÁCH BƯỚC */}
          <div
            className="relative z-10 grid"
            style={{
              gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const historyEntry = findHistory(step.status);

              const isCurrent = step.status === status;

              const isCompleted =
                !isCurrent && currentIndex >= 0 && index < currentIndex;

              const isUpcoming = !isCurrent && !isCompleted;

              const isCancelledStep = step.status === "CANCELLED";

              let circleClass =
                "border-2 border-slate-200 bg-white text-slate-300";

              let labelClass = "text-slate-400";

              if (isCompleted) {
                circleClass = "bg-emerald-600 text-white shadow-sm";

                labelClass = "text-emerald-600";
              } else if (isCurrent) {
                circleClass = isCancelledStep
                  ? "bg-rose-600 text-white shadow-sm shadow-rose-200 ring-4 ring-rose-50"
                  : status === "COMPLETED"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200 ring-4 ring-emerald-50"
                    : "bg-blue-600 text-white shadow-sm shadow-blue-200 ring-4 ring-blue-50";

                labelClass = isCancelledStep
                  ? "text-rose-600"
                  : status === "COMPLETED"
                    ? "text-emerald-600"
                    : "text-blue-600";
              }

              const time =
                historyEntry?.changedAt ||
                (step.status === "PENDING" ? createdAt : null);

              return (
                <div
                  key={step.status}
                  className="flex flex-col items-center text-center px-2"
                >
                  {/* ICON */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 ${circleClass}`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>

                  {/* TRẠNG THÁI */}
                  <span
                    className={`text-[11px] font-bold uppercase tracking-tight ${labelClass}`}
                  >
                    {step.label}
                  </span>

                  {/* THỜI GIAN */}
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {isUpcoming ? "—" : formatDateTime(time)}
                  </span>

                  {/* GHI CHÚ */}
                  {isCurrent && historyEntry?.note && (
                    <span
                      className="mt-1 max-w-32 text-[10px] text-slate-400 line-clamp-2"
                      title={historyEntry.note}
                    >
                      {historyEntry.note}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
