import {
    ArrowUp,
    BookMarked,
    ChevronRight,
    Plus,
} from "lucide-react";

import { METRICS, TOTAL_BOOKINGS } from "../../data/branchData";

export default function BranchMetricCards({ onAddBranch }) {
    return (
        <section className="flex w-full items-center justify-end">
            <button
                type="button"
                onClick={onAddBranch}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
                <Plus size={16} />
                <span>Thêm chi nhánh</span>
            </button>
        </section>
    );
}