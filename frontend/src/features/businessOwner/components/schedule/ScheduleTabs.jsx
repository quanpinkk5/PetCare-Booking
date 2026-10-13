export default function ScheduleTabs({ activeTab, onChange }) {
  const tabs = [
    { id: "slots", label: "Khung giờ làm việc" },
    { id: "exceptions", label: "Ngoại lệ lịch trình" },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-slate-200 px-1">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer pb-2 text-xs transition-colors ${
              active
                ? "border-b-2 border-emerald-600 font-semibold text-emerald-600"
                : "font-medium text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
