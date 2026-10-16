import { ChevronDown } from "lucide-react";

const CHART_DAYS = [
    { date: "16/05", value: 16, x: 30, y: 105 },
    { date: "17/05", value: 18, x: 75, y: 98 },
    { date: "18/05", value: 22, x: 125, y: 82 },
    { date: "19/05", value: 28, x: 175, y: 60 },
    { date: "20/05", value: 26, x: 225, y: 68 },
    { date: "21/05", value: 24, x: 275, y: 76 },
    { date: "22/05", value: 24, x: 325, y: 76 },
];

export default function TrendChart() {
    const linePath = CHART_DAYS.map((point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x},${point.y}`
    ).join(" ");

    const areaPath = `${linePath} L 325,120 L 30,120 Z`;

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:col-span-7">
            <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    Xu hướng booking
                    <span className="text-[11px] font-normal text-slate-400">
                        (7 ngày qua)
                    </span>
                </h4>

                <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600"
                >
                    7 ngày qua
                    <ChevronDown size={12} />
                </button>
            </div>

            <div className="relative h-44 w-full pt-2">
                <svg
                    className="h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 350 140"
                    role="img"
                    aria-label="Biểu đồ booking trong 7 ngày"
                >
                    <defs>
                        <linearGradient
                            id="bookingChartGradient"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                        >
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {[20, 50, 80, 110].map((y) => (
                        <line
                            key={y}
                            x1="20"
                            y1={y}
                            x2="340"
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth="1"
                        />
                    ))}

                    {[
                        { value: "40", y: 24 },
                        { value: "30", y: 54 },
                        { value: "20", y: 84 },
                        { value: "10", y: 114 },
                        { value: "0", y: 138 },
                    ].map((label) => (
                        <text
                            key={label.value}
                            x="5"
                            y={label.y}
                            fontSize="8"
                            fill="#94a3b8"
                        >
                            {label.value}
                        </text>
                    ))}

                    <path d={areaPath} fill="url(#bookingChartGradient)" />
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {CHART_DAYS.map((point, index) => (
                        <g key={point.date}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r={index === 6 ? 5 : index === 3 ? 4 : 3.5}
                                fill={index === 3 ? "#047857" : "#10b981"}
                                stroke={index === 3 || index === 6 ? "#ffffff" : "none"}
                                strokeWidth="1.5"
                            />

                            <text
                                x={point.x}
                                y={point.y - 8}
                                fontSize="8"
                                fill={index === 3 ? "#047857" : "#475569"}
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {point.value}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="mt-1 flex justify-between border-t border-slate-100 px-1 pt-2 text-[10px] text-slate-400">
                {CHART_DAYS.map((point, index) => (
                    <span
                        key={point.date}
                        className={index === 6 ? "font-bold text-slate-700" : ""}
                    >
                        {point.date}
                    </span>
                ))}
            </div>
        </div>
    );
}