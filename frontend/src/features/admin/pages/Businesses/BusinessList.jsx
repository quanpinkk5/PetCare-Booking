import { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";

import BusinessTable from "../../components/BusinessTable";
import { adminBusinessApi } from "../../services/adminBusinessApi";

import {
  Search,
  ChevronDown,
  Filter,
  RotateCcw,
  Download,
  X,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  location: "all",
};

const TRANSITIONS = {
  "PENDING:APPROVED": {
    label: "duyệt",
    success: "Đã duyệt",
    requireNote: false,
  },
  "PENDING:REJECTED": {
    label: "từ chối",
    success: "Đã từ chối",
    requireNote: true,
  },
  "APPROVED:SUSPENDED": {
    label: "tạm khóa",
    success: "Đã tạm khóa",
    requireNote: true,
  },
  "SUSPENDED:APPROVED": {
    label: "mở khóa",
    success: "Đã mở khóa",
    requireNote: false,
  },
};

const STATUS_LABELS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  SUSPENDED: "Tạm khóa",
};

// Chuyển giá trị về văn bản an toàn để ghi vào Excel
const safeExcelText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  // Ngăn dữ liệu nhập từ người dùng bị Excel
  // hiểu thành công thức khi mở file.
  if (/^[\s]*[=+\-@\t\r]/.test(text)) {
    return `'${text}`;
  }

  return text;
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getOwnerName = (business) => {
  const owner = business.owner || business.ownerId;

  if (owner && typeof owner === "object") {
    return owner.fullName || owner.name || "";
  }

  return business.ownerName || "";
};

const getOwnerPhone = (business) => {
  const owner = business.owner || business.ownerId;

  if (owner && typeof owner === "object") {
    return owner.phone || "";
  }

  return business.ownerPhone || "";
};

const getOwnerEmail = (business) => {
  const owner = business.owner || business.ownerId;

  if (owner && typeof owner === "object") {
    return owner.email || "";
  }

  return business.ownerEmail || "";
};

const getLocations = (business) => {
  const rawLocations = business.locations || business.provinces || [];

  if (Array.isArray(rawLocations)) {
    return rawLocations
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return item.province || item.name || item.label || "";
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof rawLocations === "string") {
    return rawLocations;
  }

  return business.province || "";
};

export default function BusinessList() {
  // =========================
  // 1. BỘ LỌC
  // =========================
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    ...DEFAULT_FILTERS,
  });

  // =========================
  // 2. DANH SÁCH BUSINESS
  // =========================
  const [businesses, setBusinesses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // =========================
  // 3. KHU VỰC
  // =========================
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState("");

  // =========================
  // 4. THAO TÁC
  // =========================
  const [updatingBusinessId, setUpdatingBusinessId] = useState(null);

  const updatingRef = useRef(false);

  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Hộp thoại nhập lý do
  const [pendingAction, setPendingAction] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [noteError, setNoteError] = useState("");

  // Xuất dữ liệu Excel
  const [isExporting, setIsExporting] = useState(false);

  const exportingRef = useRef(false);

  // =========================
  // 5. TẢI KHU VỰC
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchLocations = async () => {
      setLocationsLoading(true);
      setLocationsError("");

      try {
        const response = await adminBusinessApi.getBusinessLocations();

        if (cancelled) return;

        if (!Array.isArray(response?.data?.locations)) {
          throw new Error("Dữ liệu khu vực không hợp lệ");
        }

        setLocations(response.data.locations);
      } catch (err) {
        if (cancelled) return;

        setLocations([]);
        setLocationsError(err.message || "Không thể tải khu vực");
      } finally {
        if (!cancelled) {
          setLocationsLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // 6. TẢI DANH SÁCH BUSINESS
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminBusinessApi.getBusinesses({
          ...appliedFilters,
          page,
          limit: pageSize,
        });

        if (cancelled) return;

        if (!Array.isArray(response?.data?.businesses)) {
          throw new Error("Dữ liệu thương hiệu không hợp lệ");
        }

        const data = response.data;

        const nextPagination = {
          page: data.pagination?.page ?? page,
          limit: data.pagination?.limit ?? pageSize,
          total: data.pagination?.total ?? 0,
          totalPages: data.pagination?.totalPages ?? 0,
        };

        if (nextPagination.totalPages > 0 && page > nextPagination.totalPages) {
          setPage(nextPagination.totalPages);
          return;
        }

        if (nextPagination.totalPages === 0 && page > 1) {
          setPage(1);
          return;
        }

        setBusinesses(data.businesses);
        setPagination(nextPagination);
      } catch (err) {
        if (cancelled) return;

        setBusinesses([]);
        setPagination({
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        });

        setError(err.message || "Không thể tải danh sách thương hiệu");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBusinesses();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, pageSize, refreshKey]);

  // =========================
  // 7. TỰ ẨN THÔNG BÁO
  // =========================
  useEffect(() => {
    if (!actionSuccess && !actionError) return;

    const timer = setTimeout(() => {
      setActionSuccess("");
      setActionError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [actionSuccess, actionError]);

  // =========================
  // 8. BỘ LỌC
  // =========================
  const handleApplyFilter = () => {
    if (updatingRef.current || exportingRef.current) {
      return;
    }

    setPage(1);

    setAppliedFilters({
      search: searchQuery.trim(),
      status: statusFilter,
      location: locationFilter,
    });
  };

  const handleReset = () => {
    if (updatingRef.current || exportingRef.current) {
      return;
    }

    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");

    setAppliedFilters({
      ...DEFAULT_FILTERS,
    });

    setPage(1);
  };

  // =========================
  // 9. PHÂN TRANG
  // =========================
  const handlePageChange = (nextPage) => {
    if (
      isLoading ||
      updatingRef.current ||
      exportingRef.current ||
      pendingAction ||
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (nextSize) => {
    if (
      isLoading ||
      updatingRef.current ||
      exportingRef.current ||
      pendingAction ||
      ![10, 20, 50].includes(nextSize)
    ) {
      return;
    }

    setPageSize(nextSize);
    setPage(1);
  };

  // =========================
  // 10. CẬP NHẬT TRẠNG THÁI
  // =========================
  const submitStatusUpdate = async (business, newStatus, note = "") => {
    if (updatingRef.current || exportingRef.current || !business?._id) {
      return;
    }

    const expectedStatus = business.status;
    const key = `${expectedStatus}:${newStatus}`;

    const transition = TRANSITIONS[key];

    if (!transition) {
      setActionError("Thao tác không hợp lệ.");
      return;
    }

    const normalizedNote = note.trim();

    if (transition.requireNote && !normalizedNote) {
      setNoteError("Vui lòng nhập lý do.");
      return;
    }

    if (normalizedNote.length > 500) {
      setNoteError("Ghi chú tối đa 500 ký tự.");
      return;
    }

    updatingRef.current = true;
    setUpdatingBusinessId(business._id);

    setActionError("");
    setActionSuccess("");
    setNoteError("");

    try {
      const response = await adminBusinessApi.updateBusinessStatus(
        business._id,
        expectedStatus,
        newStatus,
        normalizedNote,
      );

      if (response?.success === false) {
        throw new Error(response.message || "Cập nhật trạng thái thất bại");
      }

      setActionSuccess(
        `${transition.success} thương hiệu ` + `"${business.name}" thành công.`,
      );

      setPendingAction(null);
      setActionNote("");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      const message =
        err.message || "Không thể cập nhật trạng thái thương hiệu";

      if (pendingAction) {
        setNoteError(message);
      } else {
        setActionError(message);
      }

      setRefreshKey((prev) => prev + 1);
    } finally {
      updatingRef.current = false;
      setUpdatingBusinessId(null);
    }
  };

  // =========================
  // 11. BẮT ĐẦU THAO TÁC
  // =========================
  const handleUpdateBusinessStatus = (business, newStatus) => {
    if (updatingRef.current || exportingRef.current || pendingAction) {
      return;
    }

    const transition = TRANSITIONS[`${business?.status}:${newStatus}`];

    if (!transition) {
      setActionError("Thao tác không hợp lệ.");
      return;
    }

    if (transition.requireNote) {
      setActionNote("");
      setNoteError("");

      setPendingAction({
        business,
        newStatus,
        transition,
      });

      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ` +
        `${transition.label} thương hiệu ` +
        `"${business.name}" không?`,
    );

    if (!confirmed) return;

    submitStatusUpdate(business, newStatus);
  };

  const handleApprove = (business) =>
    handleUpdateBusinessStatus(business, "APPROVED");

  const handleReject = (business) =>
    handleUpdateBusinessStatus(business, "REJECTED");

  const handleSuspend = (business) =>
    handleUpdateBusinessStatus(business, "SUSPENDED");

  const handleUnblock = (business) =>
    handleUpdateBusinessStatus(business, "APPROVED");

  const closeNoteDialog = () => {
    if (updatingRef.current) return;

    setPendingAction(null);
    setActionNote("");
    setNoteError("");
  };

  const handleConfirmNote = () => {
    if (!pendingAction || updatingRef.current) {
      return;
    }

    submitStatusUpdate(
      pendingAction.business,
      pendingAction.newStatus,
      actionNote,
    );
  };

  // =========================
  // 12. LẤY TOÀN BỘ DỮ LIỆU
  // THEO BỘ LỌC ĐANG ÁP DỤNG
  // =========================
  const fetchAllBusinessesForExport = async () => {
    const exportLimit = 50;
    const allBusinesses = [];

    let currentPage = 1;
    let totalPages = 1;

    // Dùng bộ lọc đã nhấn "Lọc",
    // không dùng các ô chưa áp dụng.
    const filters = {
      ...appliedFilters,
    };

    do {
      const response = await adminBusinessApi.getBusinesses({
        ...filters,
        page: currentPage,
        limit: exportLimit,
      });

      if (
        response?.success === false ||
        !Array.isArray(response?.data?.businesses)
      ) {
        throw new Error(
          response?.message || "Không thể tải dữ liệu để xuất Excel",
        );
      }

      const data = response.data;
      const items = data.businesses;

      allBusinesses.push(...items);

      const reportedTotalPages = Number(data.pagination?.totalPages);

      const reportedTotal = Number(data.pagination?.total);

      if (Number.isFinite(reportedTotalPages) && reportedTotalPages >= 0) {
        totalPages = reportedTotalPages;
      } else if (Number.isFinite(reportedTotal) && reportedTotal >= 0) {
        totalPages = Math.ceil(reportedTotal / exportLimit);
      } else {
        throw new Error(
          "API chưa trả thông tin phân trang để xuất đầy đủ dữ liệu.",
        );
      }

      if (currentPage < totalPages && items.length === 0) {
        throw new Error("Thiếu dữ liệu ở một trang khi xuất Excel.");
      }

      currentPage += 1;
    } while (currentPage <= totalPages);

    // Tránh ghi trùng nếu dữ liệu thay đổi
    // trong lúc đọc nhiều trang.
    const uniqueBusinesses = new Map();

    allBusinesses.forEach((business) => {
      if (business?._id) {
        uniqueBusinesses.set(String(business._id), business);
      }
    });

    return [...uniqueBusinesses.values()];
  };

  // =========================
  // 13. XUẤT FILE EXCEL
  // =========================
  const handleExportExcel = async () => {
    if (
      exportingRef.current ||
      updatingRef.current ||
      pendingAction ||
      isLoading
    ) {
      return;
    }

    exportingRef.current = true;
    setIsExporting(true);

    setActionSuccess("");
    setActionError("");

    try {
      const exportBusinesses = await fetchAllBusinessesForExport();

      if (exportBusinesses.length === 0) {
        setActionError("Không có thương hiệu nào để xuất dữ liệu.");
        return;
      }

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "PetCare Booking Admin";

      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Danh sach thuong hieu");

      // Tiêu đề cột
      worksheet.columns = [
        {
          header: "STT",
          key: "stt",
          width: 8,
        },
        {
          header: "Mã thương hiệu",
          key: "id",
          width: 28,
        },
        {
          header: "Tên thương hiệu",
          key: "name",
          width: 30,
        },
        {
          header: "Chủ sở hữu",
          key: "ownerName",
          width: 25,
        },
        {
          header: "Email chủ sở hữu",
          key: "ownerEmail",
          width: 30,
        },
        {
          header: "SĐT chủ sở hữu",
          key: "ownerPhone",
          width: 18,
        },
        {
          header: "Email thương hiệu",
          key: "email",
          width: 30,
        },
        {
          header: "SĐT thương hiệu",
          key: "phone",
          width: 18,
        },
        {
          header: "Khu vực",
          key: "locations",
          width: 35,
        },
        {
          header: "Số chi nhánh",
          key: "branchCount",
          width: 16,
        },
        {
          header: "Trạng thái",
          key: "status",
          width: 18,
        },
        {
          header: "Ngày tạo",
          key: "createdAt",
          width: 16,
        },
      ];

      // Dòng tiêu đề
      const headerRow = worksheet.getRow(1);

      headerRow.height = 26;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: {
            argb: "FFFFFFFF",
          },
          size: 11,
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF047857",
          },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        cell.border = {
          bottom: {
            style: "thin",
            color: {
              argb: "FFCBD5E1",
            },
          },
        };
      });

      // Ghi dữ liệu
      exportBusinesses.forEach((business, index) => {
        worksheet.addRow({
          stt: index + 1,

          id: safeExcelText(business._id),

          name: safeExcelText(business.name),

          ownerName: safeExcelText(getOwnerName(business)),

          ownerEmail: safeExcelText(getOwnerEmail(business)),

          ownerPhone: safeExcelText(getOwnerPhone(business)),

          email: safeExcelText(business.email),

          phone: safeExcelText(business.phone),

          locations: safeExcelText(getLocations(business)),

          branchCount: Number(business.branchCount) || 0,

          status:
            STATUS_LABELS[business.status] || safeExcelText(business.status),

          createdAt: formatDate(business.createdAt),
        });
      });

      // Định dạng các dòng dữ liệu
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        row.height = 22;

        row.alignment = {
          vertical: "middle",
        };

        if (rowNumber % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: "FFF1F5F9",
              },
            };
          });
        }
      });

      // Căn giữa các cột phù hợp
      ["A", "J", "K", "L"].forEach((column) => {
        worksheet.getColumn(column).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      // Cố định hàng tiêu đề
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 1,
        },
      ];

      // Bật bộ lọc trong Excel
      worksheet.autoFilter = {
        from: "A1",
        to: "L1",
      };

      // Tạo file Excel
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileUrl = URL.createObjectURL(blob);

      const dateString = new Date().toISOString().slice(0, 10);

      const fileName = `PetCare_Businesses_${dateString}.xlsx`;

      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Giải phóng tài nguyên
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 1000);

      setActionSuccess(
        `Đã xuất ${exportBusinesses.length} ` + `thương hiệu ra file Excel.`,
      );
    } catch (err) {
      console.error("Export businesses error:", err);

      setActionError(err.message || "Không thể xuất dữ liệu Excel.");
    } finally {
      exportingRef.current = false;
      setIsExporting(false);
    }
  };

  // =========================
  // 14. RENDER
  // =========================
  return (
    <div className="p-8 space-y-6 flex-1">
      {/* FILTER BAR */}
      <section className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* TÌM KIẾM */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyFilter();
                }
              }}
              className="w-full pr-10 pl-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
              placeholder="Tìm theo tên cơ sở, chủ sở hữu, SĐT..."
            />

            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* TRẠNG THÁI */}
          <div className="relative min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="SUSPENDED">Tạm khóa</option>
              <option value="REJECTED">Từ chối</option>
            </select>

            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* KHU VỰC */}
          <div className="relative min-w-[140px]">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              disabled={locationsLoading || Boolean(locationsError)}
              className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="all">
                {locationsLoading ? "Đang tải khu vực..." : "Khu vực: Tất cả"}
              </option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* LỌC */}
          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc</span>
          </button>

          {/* RESET */}
          <button
            type="button"
            onClick={handleReset}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* CHỈ GIỮ NÚT XUẤT DỮ LIỆU */}

        {/* NÚT XUẤT DỮ LIỆU */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={
              isExporting ||
              isLoading ||
              Boolean(updatingBusinessId) ||
              Boolean(pendingAction) ||
              Boolean(error)
            }
            className="
      flex items-center gap-2
      bg-emerald-600 hover:bg-emerald-700
      active:bg-emerald-800
      text-white
      px-4 py-2
      rounded-xl
      text-xs font-semibold
      shadow-sm shadow-emerald-500/20
      transition-all duration-200
      cursor-pointer
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
          >
            <Download
              className={`w-4 h-4 ${isExporting ? "animate-pulse" : ""}`}
            />

            <span>{isExporting ? "Đang xuất Excel..." : "Xuất dữ liệu"}</span>
          </button>
        </div>
      </section>

      {/* LỖI KHU VỰC */}
      {locationsError && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-700"
        >
          Không tải được danh sách khu vực: {locationsError}
        </div>
      )}

      {/* LỖI DANH SÁCH */}
      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-700"
        >
          {error}
        </div>
      )}

      {/* THÀNH CÔNG */}
      {actionSuccess && (
        <div
          role="status"
          className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
        >
          {actionSuccess}
        </div>
      )}

      {/* LỖI THAO TÁC */}
      {actionError && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-700"
        >
          {actionError}
        </div>
      )}

      {/* BẢNG THƯƠNG HIỆU */}
      <BusinessTable
        data={businesses}
        pagination={pagination}
        isLoading={isLoading}
        hasError={Boolean(error)}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
        onUnblock={handleUnblock}
        updatingBusinessId={updatingBusinessId}
      />

      {/* HỘP THOẠI NHẬP LÝ DO */}
      {pendingAction && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-note-title"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3
                  id="business-note-title"
                  className="text-base font-bold text-slate-900"
                >
                  {pendingAction.newStatus === "REJECTED"
                    ? "Từ chối thương hiệu"
                    : "Tạm khóa thương hiệu"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {pendingAction.business.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeNoteDialog}
                disabled={Boolean(updatingBusinessId)}
                aria-label="Đóng"
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label
              htmlFor="business-action-note"
              className="block text-xs font-semibold text-slate-700 mb-2"
            >
              Lý do {pendingAction.transition.label}
              <span className="text-rose-500"> *</span>
            </label>

            <textarea
              id="business-action-note"
              value={actionNote}
              onChange={(e) => {
                setActionNote(e.target.value);
                setNoteError("");
              }}
              disabled={Boolean(updatingBusinessId)}
              maxLength={500}
              rows={4}
              autoFocus
              placeholder="Nhập lý do để Business Owner biết và khắc phục..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none disabled:opacity-50"
            />

            <div className="flex justify-between text-[11px] mt-1">
              <span className="text-rose-600">{noteError}</span>

              <span className="text-slate-400">{actionNote.length}/500</span>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Lý do này sẽ được gửi đến Business Owner trong trang Thông báo.
            </p>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={closeNoteDialog}
                disabled={Boolean(updatingBusinessId)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleConfirmNote}
                disabled={Boolean(updatingBusinessId) || !actionNote.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingBusinessId ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
