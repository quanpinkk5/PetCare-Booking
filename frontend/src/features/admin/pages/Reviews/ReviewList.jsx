import { useEffect, useRef, useState } from "react";

import ReviewTable from "../../components/review/ReviewTable";
import ReviewDetailPanel from "../../components/review/ReviewDetailPanel";

import { adminReviewApi } from "../../services/adminReviewApi";

const EMPTY_FILTERS = {
  search: "",
  status: "all",
  rating: "all",
  branchId: "all",
  fromDate: "",
  toDate: "",
};

export default function ReviewList() {
  // ===============================
  // 1. INPUT BỘ LỌC
  // ===============================
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    ...EMPTY_FILTERS,
  });

  // ===============================
  // 2. DANH SÁCH
  // ===============================
  const [reviews, setReviews] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // ===============================
  // 3. MODAL CHI TIẾT
  // ===============================
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const detailRequestId = useRef(0);

  // ===============================
  // 4. THÔNG BÁO
  // ===============================
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!actionError) return;

    const timer = setTimeout(() => {
      setActionError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [actionError]);

  // ===============================
  // 5. DANH SÁCH CƠ SỞ
  // ===============================
  useEffect(() => {
    let cancelled = false;

    const loadFacilities = async () => {
      try {
        const response = await adminReviewApi.getFacilities();

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.facilities)
        ) {
          throw new Error(
            response?.message || "Không thể tải danh sách cơ sở.",
          );
        }

        setFacilities(response.data.facilities);
      } catch (err) {
        if (!cancelled) {
          console.error("Get review facilities:", err);
        }
      }
    };

    loadFacilities();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===============================
  // 6. DANH SÁCH ĐÁNH GIÁ
  // ===============================
  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminReviewApi.getReviews({
          ...appliedFilters,
          page,
          limit: pageSize,
        });

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.reviews)
        ) {
          throw new Error(
            response?.message || "Không thể tải danh sách đánh giá.",
          );
        }

        const data = response.data;

        const nextPagination = {
          page: Number(data.pagination?.page ?? page),
          limit: Number(data.pagination?.limit ?? pageSize),
          total: Number(data.pagination?.total ?? 0),
          totalPages: Number(data.pagination?.totalPages ?? 0),
        };

        if (page > 1 && page > Math.max(1, nextPagination.totalPages)) {
          setPage(Math.max(1, nextPagination.totalPages));
          return;
        }

        setReviews(data.reviews);
        setPagination(nextPagination);
      } catch (err) {
        if (cancelled) return;

        setReviews([]);
        setError(err.message || "Không thể tải danh sách đánh giá.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, pageSize, refreshKey]);

  // ===============================
  // 7. BỘ LỌC
  // ===============================
  const handleApplyFilters = () => {
    setFilterError("");

    if (fromDate && toDate && fromDate > toDate) {
      setFilterError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setAppliedFilters({
      search: searchQuery.trim(),
      status: statusFilter,
      rating: starFilter,
      branchId: facilityFilter,
      fromDate,
      toDate,
    });

    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setStarFilter("all");
    setFacilityFilter("all");
    setFromDate("");
    setToDate("");
    setFilterError("");

    setAppliedFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  // ===============================
  // 8. PHÂN TRANG
  // ===============================
  const handlePageChange = (nextPage) => {
    if (
      isLoading ||
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (nextSize) => {
    const size = Number(nextSize);

    if (![10, 20, 50].includes(size)) return;

    setPageSize(size);
    setPage(1);
  };

  // ===============================
  // 9. MỞ CHI TIẾT
  // ===============================
  const handleOpenDetail = async (review) => {
    if (!review?._id) return;

    const requestId = ++detailRequestId.current;

    setSelectedReview(review);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailError("");

    try {
      const response = await adminReviewApi.getReviewDetail(review._id);

      if (requestId !== detailRequestId.current) return;

      if (response?.success === false || !response?.data?.review) {
        throw new Error(
          response?.message || "Không thể tải chi tiết đánh giá.",
        );
      }

      setSelectedReview(response.data.review);
    } catch (err) {
      if (requestId !== detailRequestId.current) return;

      setDetailError(err.message || "Không thể tải chi tiết đánh giá.");
    } finally {
      if (requestId === detailRequestId.current) {
        setIsDetailLoading(false);
      }
    }
  };

  const handleCloseDetail = () => {
    if (isUpdatingStatus) return;

    ++detailRequestId.current;

    setIsDetailOpen(false);
    setSelectedReview(null);
    setDetailError("");
    setIsDetailLoading(false);
  };

  // ===============================
  // 10. ẨN / KHÔI PHỤC
  // ===============================
  const handleUpdateStatus = async (nextStatus) => {
    if (
      !selectedReview?._id ||
      isUpdatingStatus ||
      isDetailLoading ||
      !["VISIBLE", "HIDDEN"].includes(nextStatus) ||
      selectedReview.status === nextStatus
    ) {
      return;
    }

    const reviewId = selectedReview._id;

    const confirmed = window.confirm(
      nextStatus === "HIDDEN"
        ? "Bạn có chắc muốn ẩn đánh giá này?"
        : "Bạn có chắc muốn khôi phục đánh giá này?",
    );

    if (!confirmed) return;

    setIsUpdatingStatus(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const response = await adminReviewApi.updateReviewStatus(
        reviewId,
        nextStatus,
      );

      if (response?.success === false || !response?.data?.review) {
        throw new Error(
          response?.message || "Không thể cập nhật trạng thái đánh giá.",
        );
      }

      const updatedStatus = response.data.review.status;

      setSelectedReview((current) =>
        current?._id === reviewId
          ? { ...current, status: updatedStatus }
          : current,
      );

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item._id === reviewId ? { ...item, status: updatedStatus } : item,
        ),
      );

      setSuccessMessage(
        response.message ||
          (updatedStatus === "HIDDEN"
            ? "Đã ẩn đánh giá thành công."
            : "Đã khôi phục đánh giá thành công."),
      );

      // Tải lại danh sách để cập nhật
      // chính xác kết quả bộ lọc và tổng số.
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setActionError(err.message || "Không thể cập nhật trạng thái đánh giá.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="p-8 space-y-6 flex-1">
      {filterError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {filterError}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {error}

          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setRefreshKey((value) => value + 1)}
          >
            Thử lại
          </button>
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {actionError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <ReviewTable
        reviews={reviews}
        facilities={facilities}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        starFilter={starFilter}
        setStarFilter={setStarFilter}
        facilityFilter={facilityFilter}
        setFacilityFilter={setFacilityFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        pagination={pagination}
        isLoading={isLoading}
        selectedReviewId={isDetailOpen ? selectedReview?._id : null}
        onOpenDetail={handleOpenDetail}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ReviewDetailPanel
        review={selectedReview}
        isOpen={isDetailOpen}
        isLoading={isDetailLoading}
        isUpdating={isUpdatingStatus}
        error={detailError}
        onClose={handleCloseDetail}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
