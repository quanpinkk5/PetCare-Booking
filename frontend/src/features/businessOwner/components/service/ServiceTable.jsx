import { useMemo, useState } from "react";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    MoreVertical,
} from "lucide-react";
import { SERVICES_DATA } from "../../data/serviceData";

const PAGE_SIZE = 6;

export default function ServiceTable({ onViewService, onEditService }) {
    const [keyword, setKeyword] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const filteredServices = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return SERVICES_DATA.filter((service) => {
            const matchesKeyword =
                service.name.toLowerCase().includes(normalizedKeyword) ||
                service.desc.toLowerCase().includes(normalizedKeyword);

            const matchesType =
                typeFilter === "all" || service.type === typeFilter;

            const matchesStatus =
                statusFilter === "all" || service.status === statusFilter;

            return matchesKeyword && matchesType && matchesStatus;
        });
    }, [keyword, typeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleServices = filteredServices.slice(startIndex, startIndex + PAGE_SIZE);

    const handleKeywordChange = (event) => {
        setKeyword(event.target.value);
        setPage(1);
    };

    const handleTypeChange = (event) => {
        setTypeFilter(event.target.value);
        setPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setPage(1);
    };

    return (
        <div className="w-full space-y-4">
            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-xs shadow-xs">
                <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Tìm kiếm dịch vụ..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <Search
                            size={14}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={handleTypeChange}
                            className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="all">Loại dịch vụ: Tất cả</option>
                            <option value="Hẹn lịch">Hẹn lịch</option>
                            <option value="Lưu trú">Lưu trú</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="all">Trạng thái: Tất cả</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span>Sắp xếp: Mới nhất</span>
                    <ChevronDown size={14} className="text-slate-400" />
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500">
                                <th className="min-w-[240px] px-4 py-3">Dịch vụ</th>
                                <th className="min-w-[100px] px-3 py-3">Loại</th>
                                <th className="min-w-[110px] px-3 py-3">Thú cưng</th>
                                <th className="min-w-[90px] px-3 py-3">Thời lượng</th>
                                <th className="min-w-[100px] px-3 py-3">Giá</th>
                                <th className="min-w-[100px] px-3 py-3">Đặt tháng này</th>
                                <th className="min-w-[120px] px-3 py-3">Trạng thái</th>
                                <th className="min-w-[90px] px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                            {visibleServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="transition hover:bg-slate-50/70"
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt={service.name}
                                                src={service.img}
                                                className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 object-cover shadow-xs"
                                            />

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {service.name}
                                                    </span>

                                                    {service.isHighlight && (
                                                        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                                    {service.desc}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-3 py-3.5">
                                        <span
                                            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${service.typeClass}`}
                                        >
                                            {service.type}
                                        </span>
                                    </td>

                                    <td className="px-3 py-3.5 text-[11px] text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs">🐾</span>
                                            <span>{service.pets}</span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-3.5 font-medium text-slate-600">
                                        {service.duration}
                                    </td>

                                    <td className="px-3 py-3.5">
                                        <div className="font-bold text-slate-900">
                                            {service.price}
                                        </div>
                                        {service.unit && (
                                            <div className="text-[10px] text-slate-400">
                                                {service.unit}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-3 py-3.5">
                                        <div className="font-bold text-slate-900">
                                            {service.bookings}
                                        </div>
                                        <div
                                            className={`text-[10px] font-medium ${
                                                service.isDown
                                                    ? "text-rose-500"
                                                    : "text-emerald-600"
                                            }`}
                                        >
                                            {service.isDown ? "▼" : "▲"}{" "}
                                            {service.trend.replace("+", "").replace("-", "")}
                                        </div>
                                    </td>

                                    <td className="px-3 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                                                service.status === "Đang hoạt động"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    service.status === "Đang hoạt động"
                                                        ? "bg-emerald-500"
                                                        : "bg-amber-500"
                                                }`}
                                            />
                                            {service.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1 text-slate-400">
                                            <button
                                                type="button"
                                                title="Xem chi tiết"
                                                aria-label={`Xem ${service.name}`}
                                                className="cursor-pointer rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
                                                onClick={() =>
                                                    onViewService
                                                        ? onViewService(service)
                                                        : window.alert(`Xem dịch vụ: ${service.name}`)
                                                }
                                            >
                                                <Eye size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Chỉnh sửa"
                                                aria-label={`Sửa ${service.name}`}
                                                className="cursor-pointer rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
                                                onClick={() =>
                                                    onEditService
                                                        ? onEditService(service)
                                                        : window.alert(`Sửa dịch vụ: ${service.name}`)
                                                }
                                            >
                                                <Edit size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Thao tác khác"
                                                aria-label={`Thao tác khác với ${service.name}`}
                                                className="cursor-pointer rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
                                                onClick={() =>
                                                    window.alert(`Thao tác khác với dịch vụ: ${service.name}`)
                                                }
                                            >
                                                <MoreVertical size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {visibleServices.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-10 text-center text-slate-400"
                                    >
                                        Không tìm thấy dịch vụ phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-3.5 text-xs text-slate-500 sm:flex-row">
                    <div>
                        Hiển thị{" "}
                        <span className="font-semibold text-slate-700">
                            {filteredServices.length === 0
                                ? "0"
                                : `${startIndex + 1} - ${Math.min(
                                      startIndex + PAGE_SIZE,
                                      filteredServices.length,
                                  )}`}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-semibold text-slate-700">
                            {filteredServices.length}
                        </span>{" "}
                        dịch vụ
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition ${
                                        currentPage === pageNumber
                                            ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-600"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
