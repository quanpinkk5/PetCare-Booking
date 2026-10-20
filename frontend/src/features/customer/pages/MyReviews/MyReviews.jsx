import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, Link, Navigate } from "react-router-dom";
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

import { reviewApi } from '../../services/reviewApi.js';
import { reviewData, pendingReviewData, reviewPayload } from '../../services/reviewData.js';
import { useAuth } from '../../../../context/AuthContext';

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
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [onlyWithReplies, setOnlyWithReplies] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalTargetItem, setModalTargetItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
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

  const { user, isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likingId, setLikingId] = useState(null);
  const liking = useRef(new Set());
  const handledRequest = useRef(null);
  useEffect(() => {
    if (isAuthLoading || !user || user.role !== 'CUSTOMER') return;
    let cancelled = false;
    Promise.all([reviewApi.list(), reviewApi.pending()]).then(([reviewRes, pendingRes]) => {
      if (cancelled) return;
      const list = reviewRes.data.map(reviewData);
      const pending = pendingRes.data.map(pendingReviewData);
      setReviews(list); setPendingReviews(pending);
      if (paramBookingId && paramAction === 'write' && handledRequest.current !== paramBookingId) {
        handledRequest.current = paramBookingId;
        const target = pending.find((item) => item.bookingRecordId === paramBookingId || item.bookingId === paramBookingId);
        if (target) { setModalTargetItem(target); setIsEditMode(false); setReviewModalOpen(true); setActiveTab('pending'); }
        else setToast({ message: 'Lịch đặt này chưa hoàn thành hoặc đã được đánh giá.', type: 'error' });
      }
    }).catch((error) => { if (!cancelled) setLoadError(error.message || 'Không thể tải đánh giá.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, isAuthLoading, refreshKey, paramBookingId, paramAction]);
  const reload = () => { setLoading(true); setLoadError(''); setRefreshKey((value) => value + 1); };

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
        : "—";
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

  // Persist the existing helpful action; retries set a desired value instead of toggling twice.
  const handleLikeToggle = async (reviewId) => {
    if (liking.current.has(reviewId)) return;
    const review = reviews.find((item) => item.id === reviewId);
    liking.current.add(reviewId); setLikingId(reviewId);
    try {
      const response = await reviewApi.helpful(reviewId, !review.isLiked);
      setReviews((current) => current.map((item) => item.id === reviewId ? { ...item, ...response.data, id: reviewId } : item));
    } catch (error) { showToast(error.message || 'Không thể lưu trạng thái hữu ích.', 'error'); }
    finally { liking.current.delete(reviewId); setLikingId(null); }
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

  const handleSubmitReview = async (payload, isEdit) => {
    const data = reviewPayload(payload, !isEdit);
    if (isEdit) await reviewApi.update(payload.id, data);
    else await reviewApi.create(data);
    setReviewModalOpen(false); setActiveTab('reviewed'); setCurrentPage(1);
    showToast(isEdit ? 'Cập nhật đánh giá thành công!' : 'Đăng đánh giá thành công!');
    reload();
  };

  // Delete Review
  const handleOpenDeleteReview = (reviewItem) => {
    setDeleteTargetItem(reviewItem);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetItem || isDeleting) return;
    setIsDeleting(true);
    try {
      await reviewApi.remove(deleteTargetItem.id);
      setDeleteModalOpen(false); setDeleteTargetItem(null); setCurrentPage(1);
      showToast('Đã xóa đánh giá.', 'info'); reload();
    } catch (error) { showToast(error.message || 'Không thể xóa đánh giá.', 'error'); }
    finally { setIsDeleting(false); }
  };
  if (!isAuthLoading && !user) return <Navigate to="/login" replace />;
  if (user && user.role !== 'CUSTOMER') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-5 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
              toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : toast.type === "reward"
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
      <ReviewsHero stats={loading ? { totalReviews: "—", averageRating: "—", pendingCount: "—", repliedCount: "—" } : stats} />

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
          {!loading && !loadError && paginatedList.length > 0 ? (
            activeTab === "reviewed" ? (
              paginatedList.map((review) => (
                <ReviewItemCard
                  key={review.id}
                  review={review}
                  helpfulBusy={likingId === review.id}
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
            <div role={loadError ? "alert" : loading ? "status" : undefined} className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <MessageSquareQuote size={32} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {loading ? "Đang tải đánh giá..." : loadError || (activeTab === "reviewed"
                  ? isFiltered
                    ? "Không tìm thấy đánh giá nào phù hợp"
                    : "Bạn chưa có đánh giá nào"
                  : "Không có dịch vụ nào đang chờ đánh giá")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                {loading ? "Vui lòng chờ trong giây lát." : loadError ? "Vui lòng thử tải lại danh sách." : activeTab === "reviewed"
                  ? isFiltered
                    ? "Thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại các bộ lọc bên trên."
                    : "Sau khi sử dụng dịch vụ spa, grooming hoặc thú y, bạn có thể gửi đánh giá và chia sẻ trải nghiệm với cộng đồng."
                  : "Tất cả các dịch vụ đã hoàn thành của bạn đều đã được đánh giá đầy đủ. Cảm ơn bạn!"}
              </p>

              {(loadError || (isFiltered && activeTab === "reviewed")) && (
                <button
                  type="button"
                  onClick={loadError ? reload : handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>{loadError ? "Thử lại" : "Xem tất cả đánh giá"}</span>
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
        {!loading && !loadError && activeList.length > 0 && totalPages > 1 && (
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
        key={`${modalTargetItem?.id}:${isEditMode}:${reviewModalOpen}`}
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
        busy={isDeleting}
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
