
import {
    Plus,
    TrendingUp,
} from "lucide-react";

import {
    METRICS,
    BOOKING_METRIC,
} from "../../data/serviceData";

export default function ServiceMetricCards({ onAddService }) {
    const BookingIcon = BOOKING_METRIC.icon;

    return (
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 justify-end">
            <button
                type="button"
                onClick={onAddService}
                className="bg-[#059669] hover:bg-emerald-700 text-white px-5 py-3.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap self-stretch lg:self-auto"
            >
                <Plus size={16} />
                <span>Thêm dịch vụ</span>
            </button>
        </section>
    );
}
