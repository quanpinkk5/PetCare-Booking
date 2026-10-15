import { useMemo, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";

import { REVIEW_FILTERS } from "../../data/reviewData";
import ReviewCard from "./ReviewCard";

export default function ReviewList({
    reviews,
    onReply,
    onToggleHidden,
    onShowDetails,
}) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [branchFilter, setBranchFilter] = useState("all");

    const branches = useMemo(
        () => [...new Set(reviews.map((review) => review.branch))],
        [reviews]
    );

    const filteredReviews = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        const result = reviews.filter((review) => {
            const matchesSearch =
                !keyword ||
                [
                    review.customer,
                    review.service,
                    review.branch,
                    review.content,
                    review.pet.name,
                ].some((value) => value.toLowerCase().includes(keyword));

            const matchesRating =
                activeFilter === "all" ||
                (activeFilter === "unreplied" && !review.reply) ||
                (activeFilter === "low" && review.rating >= 1 && review.rating <= 3) ||
                String(review.rating) === activeFilter;

            const matchesBranch =
                branchFilter === "all" || review.branch === branchFilter;

            return matchesSearch && matchesRating && matchesBranch;
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.date.split("/").reverse().join("-"));
            const dateB = new Date(b.date.split("/").reverse().join("-"));

            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [reviews, search, activeFilter, branchFilter, sortOrder]);

    return (
        <section className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">
                        Quản lý đánh giá
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Hiển thị {filteredReviews.length} đánh giá mẫu
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <label className="relative">
                        <span className="sr-only">Sắp xếp đánh giá</span>
                        <select
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowFilters((value) => !value)}
                        className={`px-3 py-1.5 bg-white border rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm ${showFilters
                                ? "border-emerald-300 text-emerald-700"
                                : "border-slate-200 text-slate-700"
                            }`}
                    >
                        <Filter size={13} />
                        Bộ lọc
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tìm khách hàng, dịch vụ, thú cưng..."
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label="Xóa từ khóa"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 text-xs text-slate-500">
                        Chi nhánh
                        <select
                            value={branchFilter}
                            onChange={(event) => setBranchFilter(event.target.value)}
                            className="mt-1 block w-full rounded-lg border border-slate-200 p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                            <option value="all">Tất cả chi nhánh</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => {
                                setBranchFilter("all");
                                setActiveFilter("all");
                                setSearch("");
                            }}
                            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {REVIEW_FILTERS.map((filter) => {
                    const active = activeFilter === filter.value;

                    return (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap border transition-colors ${active
                                    ? "font-bold bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : "font-medium text-slate-600 hover:bg-slate-100 bg-white border-slate-200"
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onReply={onReply}
                        onToggleHidden={onToggleHidden}
                        onShowDetails={onShowDetails}
                    />
                ))}

                {filteredReviews.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                        <Search size={28} className="mx-auto text-slate-300 mb-3" />
                        <p className="font-semibold text-slate-700 text-sm">
                            Không tìm thấy đánh giá
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Thử thay đổi từ khóa hoặc điều kiện lọc.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}