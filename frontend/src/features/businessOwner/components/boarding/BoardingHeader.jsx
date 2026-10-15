import { Plus, Download, Home } from "lucide-react";

export default function BoardingHeader({ onNewBoarding }) {
  const handleExport = () => {
    window.alert("Chức năng xuất báo cáo danh sách lưu trú (Excel/CSV) đang được cập nhật!");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-800 transition"
        >
          <Download size={14} />
          <span>Xuất báo cáo</span>
        </button>

        <button
          type="button"
          onClick={onNewBoarding || (() => window.alert("Chức năng tiếp nhận lưu trú mới đang kết nối!"))}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
        >
          <Plus size={15} />
          <span>Tiếp nhận lưu trú</span>
        </button>
      </div>
    </div>
  );
}
