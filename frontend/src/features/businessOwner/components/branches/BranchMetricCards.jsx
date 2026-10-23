import { Plus } from "lucide-react";

export default function BranchMetricCards({ onAddBranch, disabled }) {
    return (
        <section className="flex w-full items-center justify-end">
            <button
                type="button"
                onClick={onAddBranch}
                disabled={disabled}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
                <Plus size={16} />
                <span>Thêm chi nhánh</span>
            </button>
        </section>
    );
}
