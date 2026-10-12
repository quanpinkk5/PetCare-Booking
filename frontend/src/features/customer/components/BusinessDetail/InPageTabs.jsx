import React from "react";
import {
    Home,
    MapPin,
    Scissors,
    CalendarDays,
    MessageSquare,
} from "lucide-react";

const InPageTabs = () => {
    return (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-5 overflow-x-auto text-xs font-semibold scrollbar-none">

            <a
                href="#tong-quan"
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-1.5 transition whitespace-nowrap"
            >
                <Home className="w-3.5 h-3.5" />
                Tổng quan
            </a>

            <a
                href="#chi-nhanh"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition whitespace-nowrap"
            >
                <MapPin className="w-3.5 h-3.5" />
                Chi nhánh
            </a>

            <a
                href="#dich-vu"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition whitespace-nowrap"
            >
                <Scissors className="w-3.5 h-3.5" />
                Dịch vụ
            </a>

            <a
                href="#lich-trong"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition whitespace-nowrap"
            >
                <CalendarDays className="w-3.5 h-3.5" />
                Lịch trống
            </a>

            <a
                href="#danh-gia"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition whitespace-nowrap"
            >
                <MessageSquare className="w-3.5 h-3.5" />
                Đánh giá
            </a>

        </div>
    );
};

export default InPageTabs;