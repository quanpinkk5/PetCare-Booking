import { Plus, Download, Sparkles } from "lucide-react";

export default function ServiceHeader({ onAddService }) {
    return (
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">

            <div className="flex flex-wrap items-center gap-2.5">
            

                <button
                    type="button"
                    onClick={onAddService}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                >
                    <Plus size={16} />
                    <span>Thêm dịch vụ mới</span>
                </button>
            </div>
        </div>
    );
}
