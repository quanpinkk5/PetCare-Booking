import {
    Home,
    MapPin,
    Scissors,
    MessageSquare,
} from "lucide-react";

const InPageTabs = ({ activeTab, onChange, branchesCount = 0, reviewsCount = 0 }) => {
    const tabs = [
        { id: 'tong-quan', label: 'Tổng quan', icon: Home },
        { id: 'chi-nhanh', label: 'Chi nhánh', icon: MapPin, count: branchesCount },
        { id: 'dich-vu', label: 'Dịch vụ', icon: Scissors },
        { id: 'danh-gia', label: 'Đánh giá', icon: MessageSquare, count: reviewsCount },
    ];

    return (
        <div role="tablist" aria-label="Thông tin cơ sở" className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-6 overflow-x-auto text-xs font-semibold scrollbar-none">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange?.(tab.id)}
                        onKeyDown={(event) => {
                            const index = tabs.findIndex((item) => item.id === tab.id);
                            const nextIndex = event.key === 'ArrowRight' ? (index + 1) % tabs.length
                                : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
                                : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
                            if (nextIndex === null) return;
                            event.preventDefault();
                            onChange?.(tabs[nextIndex].id);
                            document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
                        }}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition whitespace-nowrap text-xs font-semibold cursor-pointer ${
                            isActive
                                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 ring-2 ring-emerald-600/20"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                        }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                        {typeof tab.count === 'number' && tab.count > 0 ? (
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                    isActive
                                        ? "bg-white/25 text-white"
                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                            >
                                {tab.count}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
};

export default InPageTabs;
