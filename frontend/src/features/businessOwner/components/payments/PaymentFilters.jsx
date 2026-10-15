import {
    Calendar,
    ChevronDown,
    Download,
    RotateCcw,
    Search,
} from "lucide-react";

import { PAYMENT_FILTER_OPTIONS } from "../../data/paymentData";

export default function PaymentFilters({
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    onReset,
    onExport,
}) {
    const updateFilter = (key, value) => {
        setFilters((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    return (
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-end gap-2 text-xs">
                <div className="flex flex-col">
                    <label className="mb-1 text-[10px] font-semibold text-slate-400">
                        Ngày thanh toán
                    </label>

                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        <span>01/05/2025 - 22/05/2025</span>
                        <ChevronDown size={12} className="ml-1 text-slate-400" />
                    </div>
                </div>

                <FilterSelect
                    label="Chi nhánh"
                    value={filters.branch}
                    options={PAYMENT_FILTER_OPTIONS.branches}
                    onChange={(value) => updateFilter("branch", value)}
                />

                <FilterSelect
                    label="Trạng thái"
                    value={filters.status}
                    options={PAYMENT_FILTER_OPTIONS.statuses}
                    onChange={(value) => updateFilter("status", value)}
                />

                <FilterSelect
                    label="Phương thức"
                    value={filters.method}
                    options={PAYMENT_FILTER_OPTIONS.methods}
                    onChange={(value) => updateFilter("method", value)}
                />

                <div className="flex flex-col">
                    <label className="mb-1 text-[10px] font-semibold text-slate-400">
                        Tìm giao dịch
                    </label>

                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Mã GD, khách hàng..."
                            className="w-52 rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    <RotateCcw size={14} />
                    Làm mới
                </button>

                <button
                    type="button"
                    onClick={onExport}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-800"
                >
                    <Download size={14} />
                    Xuất báo cáo
                </button>
            </div>
        </div>
    );
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-[10px] font-semibold text-slate-400">
                {label}
            </label>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}