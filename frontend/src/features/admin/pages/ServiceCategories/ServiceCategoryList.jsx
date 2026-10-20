import { useEffect, useRef, useState } from "react";

import ServiceCategoryFilter from "../../components/serviceCategory/ServiceCategoryFilter";
import ServiceCategoryTable from "../../components/serviceCategory/ServiceCategoryTable";
import ServiceCategoryForm from "../../components/serviceCategory/ServiceCategoryForm";
import ServiceCategoryDetailModal from "../../components/serviceCategory/ServiceCategoryDetailModal";

import { adminServiceCategoryApi } from "../../services/adminServiceCategoryApi";

const EMPTY_FORM = {
  id: null,
  name: "",
  code: "",
  description: "",
  icon: "PawPrint",
  status: "ACTIVE",
};

const toApiStatus = (value) => {
  if (value === "Hoạt động" || value === "ACTIVE") {
    return "ACTIVE";
  }

  if (value === "Tạm ẩn" || value === "INACTIVE") {
    return "INACTIVE";
  }

  return "all";
};

export default function ServiceCategoryList() {
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
  });

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [selectedCategoryForDetail, setSelectedCategoryForDetail] =
    useState(null);

  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);

  const actionInProgress = useRef(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================
  // 1. TẢI DANH SÁCH TỪ API
  // =========================
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminServiceCategoryApi.getCategories({
          search: appliedFilters.search,
          status: appliedFilters.status,
          page,
          limit: pageSize,
        });

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.categories)
        ) {
          throw new Error(response?.message || "Dữ liệu danh mục không hợp lệ");
        }

        const data = response.data;
        const nextPagination = {
          page: Number(data.pagination?.page ?? page),
          limit: Number(data.pagination?.limit ?? pageSize),
          total: Number(data.pagination?.total ?? 0),
          totalPages: Number(data.pagination?.totalPages ?? 0),
        };

        // Sau khi lọc hoặc dữ liệu thay đổi,
        // trang cũ có thể không còn tồn tại.
        if (page > 1 && page > Math.max(1, nextPagination.totalPages)) {
          setPage(Math.max(1, nextPagination.totalPages));
          return;
        }

        setCategories(data.categories);
        setPagination(nextPagination);
      } catch (err) {
        if (cancelled) return;

        setCategories([]);
        setError(err.message || "Không thể tải danh mục dịch vụ");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, pageSize, refreshKey]);

  // =========================
  // 2. THÔNG BÁO TỰ ẨN
  // =========================
  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const reloadCategories = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // =========================
  // 3. TÌM KIẾM / LỌC
  // =========================
  const handleFilter = ({ searchQuery, statusFilter }) => {
    setAppliedFilters({
      search: (searchQuery || "").trim(),
      status: toApiStatus(statusFilter),
    });

    setPage(1);
  };

  const handleResetFilter = () => {
    setAppliedFilters({
      search: "",
      status: "all",
    });

    setPage(1);
  };

  // =========================
  // 4. PHÂN TRANG
  // =========================
  const handlePageChange = (nextPage) => {
    if (
      isLoading ||
      actionInProgress.current ||
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (nextSize) => {
    if (isLoading || actionInProgress.current || ![20, 50].includes(nextSize)) {
      return;
    }

    setPageSize(nextSize);
    setPage(1);
  };

  // =========================
  // 5. MỞ FORM THÊM / SỬA
  // =========================
  const handleAddNew = () => {
    if (actionInProgress.current) return;

    setFormError("");
    setFormData({ ...EMPTY_FORM });
    setIsFormOpen(true);
  };

  const handleEditCategory = (item) => {
    if (actionInProgress.current) return;

    setSelectedCategoryForDetail(null);
    setFormError("");

    setFormData({
      id: item._id,
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      icon: item.icon || "PawPrint",
      status: item.status || "ACTIVE",
    });

    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (actionInProgress.current) return;

    setIsFormOpen(false);
    setFormError("");
    setFormData({ ...EMPTY_FORM });
  };

  // =========================
  // 6. THÊM / CẬP NHẬT DANH MỤC
  // =========================
  const handleSaveCategory = async (data) => {
    if (actionInProgress.current) return;

    const payload = {
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
      icon: data.icon,
      status: data.status,
    };

    if (!payload.name) {
      setFormError("Vui lòng nhập tên danh mục.");
      return;
    }

    if (!/^[A-Z0-9_]{2,50}$/.test(payload.code)) {
      setFormError(
        "Mã danh mục phải có 2–50 ký tự, chỉ gồm chữ, số và dấu gạch dưới.",
      );
      return;
    }

    if (payload.description.length > 255) {
      setFormError("Mô tả tối đa 255 ký tự.");
      return;
    }

    actionInProgress.current = true;
    setIsSaving(true);
    setFormError("");

    try {
      let response;

      if (data.id) {
        response = await adminServiceCategoryApi.updateCategory(
          data.id,
          payload,
        );
      } else {
        response = await adminServiceCategoryApi.createCategory(payload);
      }

      if (response?.success === false) {
        throw new Error(response.message || "Không thể lưu danh mục");
      }

      setIsFormOpen(false);
      setFormData({ ...EMPTY_FORM });

      setMessage({
        type: "success",
        text: data.id
          ? "Cập nhật danh mục thành công."
          : "Thêm danh mục mới thành công.",
      });

      // Danh mục mới hiển thị ở trang đầu.
      if (!data.id) {
        setPage(1);
      }

      reloadCategories();
    } catch (err) {
      setFormError(err.message || "Không thể lưu danh mục dịch vụ");
    } finally {
      actionInProgress.current = false;
      setIsSaving(false);
    }
  };

  // =========================
  // 7. BẬT / TẮT DANH MỤC
  // =========================
  const handleToggleStatus = async (item) => {
    if (actionInProgress.current) return;

    const expectedStatus = item.status;
    const newStatus = expectedStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const actionLabel = newStatus === "ACTIVE" ? "kích hoạt" : "tạm ẩn";

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ${actionLabel} danh mục ` +
        `"${item.name}" không?`,
    );

    if (!confirmed) return;

    actionInProgress.current = true;
    setUpdatingCategoryId(item._id);
    setMessage({ type: "", text: "" });

    try {
      const response = await adminServiceCategoryApi.updateCategoryStatus(
        item._id,
        expectedStatus,
        newStatus,
      );

      if (response?.success === false) {
        throw new Error(response.message || "Không thể cập nhật trạng thái");
      }

      setMessage({
        type: "success",
        text: `Đã ${actionLabel} danh mục "${item.name}".`,
      });

      reloadCategories();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Không thể thay đổi trạng thái danh mục",
      });

      // Tải lại nếu trạng thái đã đổi bởi Admin khác.
      reloadCategories();
    } finally {
      actionInProgress.current = false;
      setUpdatingCategoryId(null);
    }
  };

  // =========================
  // 8. RENDER
  // =========================
  return (
    <main className="p-6 md:p-8 space-y-6 flex-1">
      <ServiceCategoryFilter
        onFilter={handleFilter}
        onReset={handleResetFilter}
        onAddNew={handleAddNew}
      />

      {message.text && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`rounded-xl border p-3 text-xs ${
            message.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-3 text-xs"
        >
          {error}
          <button
            type="button"
            onClick={reloadCategories}
            className="ml-3 font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      <section className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
        <ServiceCategoryTable
          categories={categories}
          pagination={pagination}
          isLoading={isLoading}
          hasError={Boolean(error)}
          updatingCategoryId={updatingCategoryId}
          onEdit={handleEditCategory}
          onViewDetail={setSelectedCategoryForDetail}
          onToggleStatus={handleToggleStatus}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>

      {isFormOpen && (
        <ServiceCategoryForm
          formData={formData}
          setFormData={setFormData}
          onReset={handleCloseForm}
          onSave={handleSaveCategory}
          isSaving={isSaving}
          error={formError}
        />
      )}

      {selectedCategoryForDetail && (
        <ServiceCategoryDetailModal
          category={selectedCategoryForDetail}
          onClose={() => setSelectedCategoryForDetail(null)}
          onEdit={handleEditCategory}
        />
      )}
    </main>
  );
}
