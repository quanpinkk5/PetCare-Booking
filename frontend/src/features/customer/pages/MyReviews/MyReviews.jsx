import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MessageSquareQuote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Coins
} from "lucide-react";

import ReviewsHero from "../../components/MyReviews/ReviewsHero";
import ReviewsFilterBar from "../../components/MyReviews/ReviewsFilterBar";
import ReviewItemCard from "../../components/MyReviews/ReviewItemCard";
import PendingReviewCard from "../../components/MyReviews/PendingReviewCard";
import ReviewModal from "../../components/MyReviews/ReviewModal";
import ImageLightboxModal from "../../components/MyReviews/ImageLightboxModal";
import DeleteConfirmModal from "../../components/MyReviews/DeleteConfirmModal";

import {
  INITIAL_REVIEWS,
  INITIAL_PENDING_REVIEWS
} from "../../data/reviewsData";
import { getBookingById } from "../../services/mockBookings";

const ITEMS_PER_PAGE = 4;

const MyReviews = () => {
  const [searchParams] = useSearchParams();

  // URL Parameters
  const paramBookingId = searchParams.get("bookingId");
  const paramAction = searchParams.get("action");
  const initialTab =
    searchParams.get("tab") === "pending" ||
    (paramBookingId && paramAction === "write")
      ? "pending"
      : "reviewed";

  // Main state
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [pendingReviews, setPendingReviews] = useState(INITIAL_PENDING_REVIEWS);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [onlyWithReplies, setOnlyWithReplies] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal target initialized from URL if action=write
  const [modalTargetItem, setModalTargetItem] = useState(() => {
    if (!paramBookingId || paramAction !== "write") return null;
    const pendingMatch = INITIAL_PENDING_REVIEWS.find(
      (p) => p.bookingId.toLowerCase() === paramBookingId.toLowerCase()
    );
    if (pendingMatch) return pendingMatch;
    const booking = getBookingById(paramBookingId);
    if (booking) {
      return {
        id: `PENDING-${booking.id}`,
        bookingId: booking.id,
        businessId: 1,
        businessName: booking.location,
        businessAddress: booking.location,
        businessAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC3-_PP7VWj5tqP7kr55IKE7l-9zTzySPvB0bUIsr9lhb-O0mNTbo04WCOH4eqolILlmIbZy2Z27u4hNCBzi6pyYP1K20skb1-aRCVCsKU8DT5ooCqg3mBwQ0Bx1OmOENFoEKR-DHzJJ9bMWkV89NfSzPJ3IpUweDQjq7ZWYNy3OHSU7Q-tYzeXzdD46WHgj6bXbbQc2KfQNjL-3yDg3VoOEmrypJkaroaWE4Jqjdxw2Y9jm4fU71gt",
        petName: booking.petName,
        petBreed: booking.breed,
        petGender: booking.gender,
        petImg: booking.img,
        serviceName: booking.service,
        serviceDesc: booking.serviceDesc,
        serviceDate: booking.date,
        servicePrice: booking.price,
        completedDate: booking.date,
        rewardPoints: 50,
        voucherPromo: "Tặng voucher giảm 10% cho lần đặt tiếp theo",
        deadlineDays: 30
      };
    }
    return null;
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(() => {
    return Boolean(paramBookingId && paramAction === "write");
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Scroll to top on first mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Statistics Calculation
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const avgScore =
      totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : "5.0";
    const pendingCount = pendingReviews.length;
    const repliedCount = reviews.filter((r) => Boolean(r.businessReply)).length;

    return {
      totalReviews,
      averageRating: avgScore,
      pendingCount,
      repliedCount
    };
  }, [reviews, pendingReviews]);

  // Check if filtered
  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedRating !== "all" ||
      onlyWithPhotos ||
      onlyWithReplies ||
      sortBy !== "newest"
    );
  }, [searchQuery, selectedRating, onlyWithPhotos, onlyWithReplies, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRating("all");
    setOnlyWithPhotos(false);
    setOnlyWithReplies(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filter & Sort for "Reviewed" Tab
  const filteredReviewed = useMemo(() => {
    let result = [...reviews];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.businessName.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q) ||
          r.petName.toLowerCase().includes(q) ||
          r.bookingId.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 2. Rating Filter
    if (selectedRating !== "all") {
      if (selectedRating === "below3") {
        result = result.filter((r) => r.rating < 3);
      } else {
        result = result.filter((r) => r.rating === Number(selectedRating));
      }
    }

    // 3. Photo Filter
    if (onlyWithPhotos) {
      result = result.filter((r) => r.images && r.images.length > 0);
    }

    // 4. Reply Filter
    if (onlyWithReplies) {
      result = result.filter((r) => Boolean(r.businessReply));
    }

    // 5. Sort By
    if (sortBy === "highest_rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest_rating") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "most_liked") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === "oldest") {
      result.reverse();
    }
    // "newest" is default order

    return result;
  }, [reviews, searchQuery, selectedRating, onlyWithPhotos, onlyWithReplies, sortBy]);

  // Filter for "Pending" Tab
  const filteredPending = useMemo(() => {
    let result = [...pendingReviews];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.businessName.toLowerCase().includes(q) ||
          p.serviceName.toLowerCase().includes(q) ||
          p.petName.toLowerCase().includes(q) ||
          p.bookingId.toLowerCase().includes(q)
      );
    }
    return result;
  }, [pendingReviews, searchQuery]);

  // Active list based on active tab
  const activeList = activeTab === "reviewed" ? filteredReviewed : filteredPending;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(activeList.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = activeList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const container = document.getElementById("reviews-list-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Like Toggle
  const handleLikeToggle = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const newLiked = !r.isLiked;
          return {
            ...r,
            isLiked: newLiked,
            likesCount: newLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1)
          };
        }
        return r;
      })
    );
  };

  // Open Lightbox
  const handleOpenLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditReview = (reviewItem) => {
    setModalTargetItem(reviewItem);
    setIsEditMode(true);
    setReviewModalOpen(true);
  };

  // Open Write Modal
  const handleOpenWriteReview = (pendingItem) => {
    setModalTargetItem(pendingItem);
    setIsEditMode(false);
    setReviewModalOpen(true);
  };

  // Submit Review (Create or Edit)
  const handleSubmitReview = (payload, isEdit) => {
    if (isEdit) {
      setReviews((prev) =>
        prev.map((r) => (r.id === payload.id ? { ...r, ...payload } : r))
      );
      showToast("Cập nhật đánh giá thành công!");
    } else {
      // Create new review
      const newReview = {
        id: `REV-${Date.now()}`,
        bookingId: payload.bookingId,
        businessId: payload.businessId || 1,
        businessName: payload.businessName,
        businessAddress: payload.businessAddress,
        businessAvatar: payload.businessAvatar,
        petName: payload.petName,
        petBreed: payload.petBreed,
        petGender: payload.petGender || "♂",
        petImg: payload.petImg,
        serviceName: payload.serviceName,
        serviceDate: payload.serviceDate || new Date().toLocaleDateString("vi-VN"),
        servicePrice: payload.servicePrice || "300.000đ",
        rating: payload.rating,
        ratingLabel: payload.ratingLabel,
        subRatings: payload.subRatings,
        tags: payload.tags,
        comment: payload.comment,
        images: payload.images,
        createdAt:
          new Date().toLocaleDateString("vi-VN") +
          " " +
          new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        updatedAt: null,
        likesCount: 1,
        isLiked: true,
        isAnonymous: payload.isAnonymous,
        businessReply: {
          id: `REP-${Date.now()}`,
          staffName: `Quản lý ${payload.businessName}`,
          staffRole: "Chăm sóc khách hàng",
          repliedAt: "Vừa xong",
          content: `Cảm ơn bạn và bé ${payload.petName} đã tin tưởng dịch vụ! Chúc bạn và bé luôn ngập tràn niềm vui!`
        }
      };

      setReviews((prev) => [newReview, ...prev]);
      // Remove from pending
      setPendingReviews((prev) =>
        prev.filter((p) => p.bookingId !== payload.bookingId)
      );

      // Switch to reviewed tab to let user see their newly posted review
      setActiveTab("reviewed");
      setCurrentPage(1);

      showToast(
        `Đăng đánh giá thành công! Bạn nhận được +50 điểm thưởng PetPoint và voucher giảm 10%!`,
        "reward"
      );
    }

    setReviewModalOpen(false);
  };

  // Delete Review
  const handleOpenDeleteReview = (reviewItem) => {
    setDeleteTargetItem(reviewItem);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetItem) {
      setReviews((prev) => prev.filter((r) => r.id !== deleteTargetItem.id));
      showToast("Đã xóa đánh giá thành công.", "info");
      setDeleteModalOpen(false);
      setDeleteTargetItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-5 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
              toast.type === "reward"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : toast.type === "info"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            {toast.type === "reward" ? (
              <Coins size={20} className="text-amber-500 fill-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <ReviewsHero stats={stats} />

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter & Tab Bar */}
        <ReviewsFilterBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          reviewedCount={reviews.length}
          pendingCount={pendingReviews.length}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          selectedRating={selectedRating}
          setSelectedRating={(r) => {
            setSelectedRating(r);
            setCurrentPage(1);
          }}
          onlyWithPhotos={onlyWithPhotos}
          setOnlyWithPhotos={(val) => {
            setOnlyWithPhotos(val);
            setCurrentPage(1);
          }}
          onlyWithReplies={onlyWithReplies}
          setOnlyWithReplies={(val) => {
            setOnlyWithReplies(val);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          setSortBy={(s) => {
            setSortBy(s);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* 3. Cards List */}
        <div id="reviews-list-container" className="space-y-4">
          {paginatedList.length > 0 ? (
            activeTab === "reviewed" ? (
              paginatedList.map((review) => (
                <ReviewItemCard
                  key={review.id}
                  review={review}
                  onLikeToggle={handleLikeToggle}
                  onEdit={handleOpenEditReview}
                  onDelete={handleOpenDeleteReview}
                  onOpenLightbox={handleOpenLightbox}
                />
              ))
            ) : (
              paginatedList.map((pendingItem) => (
                <PendingReviewCard
                  key={pendingItem.id}
                  pendingItem={pendingItem}
                  onWriteReview={handleOpenWriteReview}
                />
              ))
            )
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <MessageSquareQuote size={32} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {activeTab === "reviewed"
                  ? isFiltered
                    ? "Không tìm thấy đánh giá nào phù hợp"
                    : "Bạn chưa có đánh giá nào"
                  : "Không có dịch vụ nào đang chờ đánh giá"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                {activeTab === "reviewed"
                  ? isFiltered
                    ? "Thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại các bộ lọc bên trên."
                    : "Sau khi sử dụng dịch vụ spa, grooming hoặc thú y, bạn có thể gửi đánh giá để nhận xu thưởng và giúp đỡ cộng đồng."
                  : "Tất cả các dịch vụ đã hoàn thành của bạn đều đã được đánh giá đầy đủ. Cảm ơn bạn!"}
              </p>

              {isFiltered && activeTab === "reviewed" && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Xem tất cả đánh giá</span>
                </button>
              )}

              {activeTab === "pending" && (
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-teal-600/20"
                >
                  <Sparkles size={14} />
                  <span>Đặt lịch dịch vụ mới</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 4. Pagination */}
        {activeList.length > 0 && totalPages > 1 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Hiển thị{" "}
                <strong className="text-slate-800 font-bold">
                  {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, activeList.length)}
                </strong>{" "}
                trong tổng số{" "}
                <strong className="text-teal-700 font-bold">{activeList.length}</strong> bài
              </span>
              <span>
                Trang <strong className="text-slate-800 font-bold">{currentPage}</strong> / {totalPages}
              </span>
            </div>

            <nav className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed opacity-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                }`}
                aria-label="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/20"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-teal-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                  currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed opacity-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                }`}
                aria-label="Trang tiếp"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* 5. Modals */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        targetItem={modalTargetItem}
        isEditMode={isEditMode}
        onSubmitReview={handleSubmitReview}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        reviewItem={deleteTargetItem}
      />

      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />
    </div>
  );
};

export default MyReviews;
