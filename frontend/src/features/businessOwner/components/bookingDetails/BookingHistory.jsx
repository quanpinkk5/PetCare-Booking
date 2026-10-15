
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HISTORY_DATA } from "../../data/bookingDetailData";

const TABS = ["Lịch sử trạng thái", "Thanh toán", "Ghi chú nội bộ"];

export default function BookingHistory() {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-slate-100 px-6 pt-3 text-xs font-semibold text-slate-500 gap-8 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 whitespace-nowrap ${activeTab === tab
                                ? "text-emerald-600 border-b-2 border-emerald-600 font-bold"
                                : "hover:text-slate-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-5">
                {activeTab === TABS[0] ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-slate-400 font-medium border-b border-slate-100">
                                    <th className="pb-3 font-medium">Thời gian</th>
                                    <th className="pb-3 font-medium">Trạng thái</th>
                                    <th className="pb-3 font-medium">Thực hiện bởi</th>
                                    <th className="pb-3 font-medium">Ghi chú</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                {HISTORY_DATA.map((row) => (
                                    <tr key={row.id}>
                                        <td className="py-3 text-slate-600">{row.time}</td>
                                        <td className="py-3">
                                            <span className={`px-2.5 py-0.5 font-semibold text-[11px] rounded-full ${row.statusClass}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    alt={row.user}
                                                    src={row.avatar}
                                                    className="w-6 h-6 rounded-full object-cover shrink-0"
                                                />
                                                <div>
                                                    <span className="font-semibold text-slate-700 block text-[11px]">
                                                        {row.user}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {row.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-slate-600">{row.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                        {activeTab === TABS[1]
                            ? "Chưa có dữ liệu lịch sử thanh toán."
                            : "Chưa có ghi chú nội bộ."}
                    </div>
                )}

                <div className="text-center pt-3 mt-2 border-t border-slate-50">
                    <button
                        type="button"
                        className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                        Xem tất cả lịch sử <ChevronDown size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
