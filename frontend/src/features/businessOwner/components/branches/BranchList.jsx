import { useMemo, useState } from "react";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    Clock,
    Star,
    ArrowUp,
    ArrowDown,
    Eye,
    Edit,
    MoreVertical,
} from "lucide-react";

import { BRANCHES } from "../../data/branchData";

export default function BranchList() {
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [districtFilter, setDistrictFilter] = useState("all");

    const filteredBranches = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return BRANCHES.filter((branch) => {
            const matchesKeyword =
                branch.name.toLowerCase().includes(normalizedKeyword) ||
                branch.address.toLowerCase().includes(normalizedKeyword);

            const matchesStatus =
                statusFilter === "all" || branch.status === statusFilter;

            const matchesDistrict =
                districtFilter === "all" || branch.district === districtFilter;

            return matchesKeyword && matchesStatus && matchesDistrict;
        });
    }, [keyword, statusFilter, districtFilter]);

    return (
        <div className="min-w-0 space-y-4 lg:col-span-8">
            {/* Bộ lọc */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
                    <div className="relative w-full sm:w-64">
                        <Search
                            size={14}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Tìm chi nhánh, địa chỉ..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="appearance-none cursor-pointer rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs text-slate-600 outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                            <option value="all">Trạng thái: Tất cả</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Tạm dừng">Tạm dừng</option>
                        </select>

                        <ChevronDown
                            size={10}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={districtFilter}
                            onChange={(event) => setDistrictFilter(event.target.value)}
                            className="appearance-none cursor-pointer rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs text-slate-600 outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                            <option value="all">Quận/Huyện: Tất cả</option>
                            <option value="Cầu Giấy">Cầu Giấy</option>
                            <option value="Hà Đông">Hà Đông</option>
                            <option value="Thanh Xuân">Thanh Xuân</option>
                            <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                        </select>

                        <ChevronDown
                            size={10}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>

                <span className="text-xs font-medium text-slate-500">
                    Hiển thị: <strong>{filteredBranches.length}</strong> chi nhánh
                </span>
            </div>

            {/* Bảng chi nhánh */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <div className="min-w-[950px]">
                        <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            <div className="col-span-5">Chi nhánh & thông tin</div>
                            <div className="col-span-2 text-center">Thời gian hoạt động</div>
                            <div className="col-span-1 text-center">Dịch vụ</div>
                            <div className="col-span-2 text-center">Booking tháng này</div>
                            <div className="col-span-1 text-center">Trạng thái</div>
                            <div className="col-span-1 text-right">Thao tác</div>
                        </div>

                        <div className="divide-y divide-slate-100 text-xs">
                            {filteredBranches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="grid grid-cols-12 items-center px-5 py-4 transition-colors hover:bg-slate-50/70"
                                >
                                    <div className="col-span-5 flex items-start gap-3">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                                            <img
                                                alt={branch.name}
                                                src={branch.img}
                                                className={`h-full w-full object-cover ${branch.imgClass || ""}`}
                                            />

                                            {branch.isHighlight && (
                                                <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                                                    <Star size={10} className="fill-white" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <h4 className="text-[12px] font-bold text-slate-900">
                                                    {branch.name}
                                                </h4>

                                                {branch.isHighlight && (
                                                    <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                        Nổi bật
                                                    </span>
                                                )}
                                            </div>

                                            <p className="flex items-start gap-1 text-[11px] leading-snug text-slate-500">
                                                <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
                                                <span>{branch.address}</span>
                                            </p>

                                            <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                                <Phone size={12} className="text-slate-400" />
                                                {branch.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center text-slate-600">
                                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                                            <Clock size={12} className="text-slate-400" />
                                            <span>{branch.hours}</span>
                                        </div>

                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                            {branch.days}
                                        </p>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <span className="text-[13px] font-bold text-slate-800">
                                            {branch.services}
                                        </span>
                                        <p className="text-[10px] text-slate-400">Dịch vụ</p>
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className="text-[13px] font-bold text-slate-900">
                                            {branch.bookings}
                                        </span>

                                        <p
                                            className={`mt-0.5 flex items-center justify-center gap-0.5 text-[10px] font-semibold ${branch.trend === "up"
                                                    ? "text-emerald-600"
                                                    : "text-rose-500"
                                                }`}
                                        >
                                            {branch.trend === "up" ? (
                                                <ArrowUp size={10} />
                                            ) : (
                                                <ArrowDown size={10} />
                                            )}
                                            {branch.trendVal}
                                        </p>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <span
                                            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium ${branch.statusClass}`}
                                        >
                                            {branch.status}
                                        </span>
                                    </div>

                                    <div className="col-span-1 flex items-center justify-end gap-1 text-slate-400">
                                        <button
                                            type="button"
                                            title="Xem chi nhánh"
                                            onClick={() => window.alert(`Xem: ${branch.name}`)}
                                            className="p-1 hover:text-emerald-600"
                                        >
                                            <Eye size={14} />
                                        </button>

                                        <button
                                            type="button"
                                            title="Chỉnh sửa chi nhánh"
                                            onClick={() => window.alert(`Chỉnh sửa: ${branch.name}`)}
                                            className="p-1 hover:text-emerald-600"
                                        >
                                            <Edit size={14} />
                                        </button>

                                        <button
                                            type="button"
                                            title="Thao tác khác"
                                            onClick={() => window.alert(`Thao tác: ${branch.name}`)}
                                            className="p-1 hover:text-slate-700"
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredBranches.length === 0 && (
                                <div className="px-5 py-12 text-center text-sm text-slate-500">
                                    Không tìm thấy chi nhánh phù hợp.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3.5 text-xs text-slate-500">
                    <span>
                        {filteredBranches.length > 0
                            ? `Hiển thị 1 - ${filteredBranches.length} trong tổng số ${filteredBranches.length} chi nhánh`
                            : "Không có chi nhánh"}
                    </span>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled
                            className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50"
                            aria-label="Trang trước"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded border border-emerald-600 bg-emerald-600 text-xs font-semibold text-white shadow-sm"
                        >
                            1
                        </button>

                        <button
                            type="button"
                            disabled
                            className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50"
                            aria-label="Trang sau"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}