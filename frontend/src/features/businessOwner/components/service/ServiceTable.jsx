
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

export default function ServiceTable() {
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

    const totalPages = Math.max(
        1,
        Math.ceil(filteredServices.length / PAGE_SIZE),
    );

    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const visibleServices = filteredServices.slice(
        startIndex,
        startIndex + PAGE_SIZE,
    );

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
        <div className="lg:col-span-4 min-w-0 space-y-4 ">
            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Tìm kiếm dịch vụ..."
                            className="w-full text-xs pl-9 pr-8 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
                        />
                        <Search
                            size={14}
                            className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={handleTypeChange}
                            className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                            <option value="all">Loại dịch vụ: Tất cả</option>
                            <option value="Hẹn lịch">Hẹn lịch</option>
                            <option value="Lưu trú">Lưu trú</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                            <option value="all">Trạng thái: Tất cả</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span>Sắp xếp: Mới nhất</span>
                    <ChevronDown size={14} className="text-slate-400" />
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-100 bg-white font-medium text-[11px]">
                                <th className="py-3 px-4 min-w-[250px]">Dịch vụ</th>
                                <th className="py-3 px-3 min-w-[100px]">Loại dịch vụ</th>
                                <th className="py-3 px-3 min-w-[120px]">Thú cưng hỗ trợ</th>
                                <th className="py-3 px-3 min-w-[90px]">Thời lượng</th>
                                <th className="py-3 px-3 min-w-[100px]">Giá</th>
                                <th className="py-3 px-3 min-w-[100px]">Đặt tháng này</th>
                                <th className="py-3 px-3 min-w-[120px]">Trạng thái</th>
                                <th className="py-3 px-4 text-right min-w-[100px]">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                            {visibleServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="hover:bg-slate-50/70 transition"
                                >
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt={service.name}
                                                src={service.img}
                                                className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
                                            />

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="font-bold text-slate-900 text-xs">
                                                        {service.name}
                                                    </span>

                                                    {service.isHighlight && (
                                                        <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                                    {service.desc}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3">
                                        <span
                                            className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md uppercase ${service.typeClass}`}
                                        >
                                            {service.type}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-3 text-[11px] text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs">🐶🐱</span>
                                            <span>{service.pets}</span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3 font-medium text-slate-600">
                                        {service.duration}
                                    </td>

                                    <td className="py-3.5 px-3">
                                        <div className="font-bold text-slate-900">
                                            {service.price}
                                        </div>
                                        {service.unit && (
                                            <div className="text-[10px] text-slate-400">
                                                {service.unit}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-3">
                                        <div className="font-bold text-slate-900">
                                            {service.bookings}
                                        </div>
                                        <div
                                            className={`text-[10px] font-medium ${service.isDown
                                                ? "text-rose-500"
                                                : "text-emerald-600"
                                                }`}
                                        >
                                            {service.isDown ? "▼" : "▲"}{" "}
                                            {service.trend.replace("+", "").replace("-", "")}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                                            {service.status}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <button
                                                type="button"
                                                title="Xem dịch vụ"
                                                aria-label={`Xem ${service.name}`}
                                                className="hover:text-slate-600 transition p-1"
                                                onClick={() =>
                                                    window.alert(`Xem dịch vụ: ${service.name}`)
                                                }
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Sửa dịch vụ"
                                                aria-label={`Sửa ${service.name}`}
                                                className="hover:text-slate-600 transition p-1"
                                                onClick={() =>
                                                    window.alert(`Sửa dịch vụ: ${service.name}`)
                                                }
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Thao tác khác"
                                                aria-label={`Thao tác khác với ${service.name}`}
                                                className="hover:text-slate-600 transition p-1"
                                                onClick={() =>
                                                    window.alert(`Thao tác khác: ${service.name}`)
                                                }
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {visibleServices.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 px-4 text-center text-slate-400"
                                    >
                                        Không tìm thấy dịch vụ phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
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
                            onClick={() => setPage((previous) => previous - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg border transition ${currentPage === pageNumber
                                        ? "bg-emerald-50 text-emerald-600 font-bold border-emerald-200"
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
                            onClick={() => setPage((previous) => previous + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
