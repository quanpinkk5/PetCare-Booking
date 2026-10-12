import React from "react";
import {
  Search,
  X,
  Star,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";

const ReviewsFilterBar = ({
  activeTab,
  setActiveTab,
  reviewedCount,
  pendingCount,
  searchQuery,
  setSearchQuery,
  selectedRating,
  setSelectedRating,
  onlyWithPhotos,
  setOnlyWithPhotos,
  onlyWithReplies,
  setOnlyWithReplies,
  sortBy,
  setSortBy,
  onResetFilters,
  isFiltered
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
      {/* 1. Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        

        {/* Reset button if filter is active */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

      {/* 2. Search & Controls (Only relevant in "reviewed" tab, or partial in pending) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "reviewed"
                ? "Tìm theo tên cơ sở, dịch vụ, thú cưng, nội dung đánh giá..."
                : "Tìm theo tên cơ sở, dịch vụ, thú cưng đang chờ đánh giá..."
            }
            className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdowns & Toggles (active when in "reviewed" tab) */}
        {activeTab === "reviewed" && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Rating Filter Dropdown */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-teal-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-2xs"
            >
              <option value="all">Tất cả số sao</option>
              <option value="5">5 sao ⭐ (Tuyệt vời)</option>
              <option value="4">4 sao ⭐ (Rất tốt)</option>
              <option value="3">3 sao ⭐ (Bình thường)</option>
              <option value="below3">Dưới 3 sao ⭐</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-teal-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-2xs"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="highest_rating">Đánh giá cao nhất</option>
              <option value="lowest_rating">Đánh giá thấp nhất</option>
              <option value="most_liked">Nhiều lượt thích nhất</option>
            </select>

            {/* Photo Toggle Chip */}
            <button
              type="button"
              onClick={() => setOnlyWithPhotos(!onlyWithPhotos)}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border shadow-2xs ${
                onlyWithPhotos
                  ? "bg-teal-50 text-teal-700 border-teal-300 ring-1 ring-teal-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ImageIcon size={13} className={onlyWithPhotos ? "text-teal-600" : "text-slate-400"} />
              <span>Có ảnh</span>
            </button>

            {/* Reply Toggle Chip */}
            <button
              type="button"
              onClick={() => setOnlyWithReplies(!onlyWithReplies)}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border shadow-2xs ${
                onlyWithReplies
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <MessageSquare size={13} className={onlyWithReplies ? "text-emerald-600" : "text-slate-400"} />
              <span>Shop đã phản hồi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsFilterBar;
