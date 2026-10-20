import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import { adminBusinessApi } from "../../services/adminBusinessApi";

import BusinessStatusBanner from "../../components/business/BusinessStatusBanner";
import BusinessOverviewCard from "../../components/business/BusinessOverviewCard";
import BranchListCard from "../../components/business/BranchListCard";
import BusinessOwnerCard from "../../components/business/BusinessOwnerCard";
import ApprovalActionCard from "../../components/business/ApprovalActionCard";

const TRANSITIONS = {
  "PENDING:APPROVED": {
    label: "duyệt",
    success: "Duyệt thương hiệu thành công",
    requireNote: false,
  },
  "PENDING:REJECTED": {
    label: "từ chối",
    success: "Từ chối thương hiệu thành công",
    requireNote: true,
  },
  "APPROVED:SUSPENDED": {
    label: "tạm khóa",
    success: "Tạm khóa thương hiệu thành công",
    requireNote: true,
  },
  "SUSPENDED:APPROVED": {
    label: "mở khóa",
    success: "Mở khóa thương hiệu thành công",
    requireNote: false,
  },
};

export default function BusinessDetail() {
  const { id } = useParams();

  // =========================
  // 1. BUSINESS DATA
  // =========================
  const [facility, setFacility] = useState(null);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // =========================
  // 2. ACTION STATES
  // =========================
  const [adminNote, setAdminNote] = useState("");
  const [noteError, setNoteError] = useState("");

  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updatingRef = useRef(false);

  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // =========================
  // 3. LẤY THÔNG TIN BUSINESS
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchBusinessDetail = async () => {
      setIsLoading(true);
      setError("");
      setFacility(null);
      setBranches([]);

      try {
        if (!id) {
          throw new Error("Thiếu ID thương hiệu");
        }

        const response = await adminBusinessApi.getBusinessById(id);

        if (cancelled) return;

        if (response?.success === false || !response?.data?.business) {
          throw new Error(response?.message || "Không tìm thấy thương hiệu");
        }

        setFacility(response.data.business);

        setBranches(
          Array.isArray(response.data.branches) ? response.data.branches : [],
        );
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Không thể tải chi tiết thương hiệu");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBusinessDetail();

    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  // =========================
  // 4. LẤY DỊCH VỤ BUSINESS
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      setServicesLoading(true);
      setServicesError("");
      setServices([]);

      try {
        if (!id) {
          throw new Error("Thiếu ID thương hiệu");
        }

        const response = await adminBusinessApi.getBusinessServices(id);

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.services)
        ) {
          throw new Error(response?.message || "Dữ liệu dịch vụ không hợp lệ");
        }

        setServices(response.data.services);
      } catch (err) {
        if (cancelled) return;

        setServices([]);
        setServicesError(err.message || "Không thể tải danh sách dịch vụ");
      } finally {
        if (!cancelled) {
          setServicesLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  // =========================
  // 5. TỰ ẨN THÔNG BÁO
  // =========================
  useEffect(() => {
    if (!actionSuccess && !actionError) return;

    const timer = setTimeout(() => {
      setActionSuccess("");
      setActionError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [actionSuccess, actionError]);

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [copied]);

  // =========================
  // 6. SAO CHÉP MÃ THƯƠNG HIỆU
  // =========================
  const displayCode = facility?._id || "";

  const handleCopyCode = async () => {
    if (!displayCode) return;

    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
    } catch {
      setActionSuccess("");
      setActionError("Không thể sao chép mã thương hiệu");
    }
  };

  // =========================
  // 7. THAY ĐỔI TRẠNG THÁI
  // =========================
  const handleUpdateStatus = async (newStatus) => {
    if (updatingRef.current || isLoading || !facility?._id) {
      return;
    }

    const expectedStatus = facility.status;
    const transitionKey = `${expectedStatus}:${newStatus}`;

    const transition = TRANSITIONS[transitionKey];

    if (!transition) {
      setActionSuccess("");
      setActionError("Thao tác không hợp lệ với trạng thái hiện tại");
      return;
    }

    const normalizedNote = adminNote.trim();

    if (transition.requireNote && !normalizedNote) {
      setNoteError(`Vui lòng nhập lý do ${transition.label} thương hiệu.`);
      return;
    }

    if (normalizedNote.length > 500) {
      setNoteError("Ghi chú tối đa 500 ký tự.");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ${transition.label} ` +
        `thương hiệu "${facility.name}" không?` +
        (normalizedNote ? `\n\nGhi chú: ${normalizedNote}` : ""),
    );

    if (!confirmed) return;

    updatingRef.current = true;
    setUpdating(true);
    setNoteError("");
    setActionSuccess("");
    setActionError("");

    try {
      const response = await adminBusinessApi.updateBusinessStatus(
        facility._id,
        expectedStatus,
        newStatus,
        normalizedNote,
      );

      if (response?.success === false) {
        throw new Error(response.message || "Cập nhật trạng thái thất bại");
      }

      setActionSuccess(`${transition.success}: "${facility.name}".`);

      setAdminNote("");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setActionError(
        err.message || "Không thể cập nhật trạng thái thương hiệu",
      );

      setRefreshKey((prev) => prev + 1);
    } finally {
      updatingRef.current = false;
      setUpdating(false);
    }
  };

  const handleApprove = () => handleUpdateStatus("APPROVED");

  const handleReject = () => handleUpdateStatus("REJECTED");

  const handleSuspend = () => handleUpdateStatus("SUSPENDED");

  const handleUnblock = () => handleUpdateStatus("APPROVED");

  // =========================
  // 8. YÊU CẦU BỔ SUNG THÔNG TIN
  // =========================
  const handleRequestInfo = async () => {
    if (updatingRef.current || isLoading || !facility?._id) {
      return;
    }

    // Chỉ áp dụng với thương hiệu PENDING
    if (facility.status !== "PENDING") {
      setActionSuccess("");
      setActionError(
        "Chỉ có thể yêu cầu bổ sung đối với thương hiệu đang chờ duyệt.",
      );
      return;
    }

    const normalizedNote = adminNote.trim();

    // Bắt buộc nhập nội dung
    if (!normalizedNote) {
      setNoteError("Vui lòng nhập nội dung cần bổ sung.");
      return;
    }

    if (normalizedNote.length > 500) {
      setNoteError("Nội dung không được vượt quá 500 ký tự.");
      return;
    }

    const confirmed = window.confirm(
      `Gửi yêu cầu bổ sung thông tin cho ` +
        `thương hiệu "${facility.name}"?\n\n` +
        `Nội dung: ${normalizedNote}`,
    );

    if (!confirmed) return;

    updatingRef.current = true;
    setUpdating(true);
    setNoteError("");
    setActionError("");
    setActionSuccess("");

    try {
      const response = await adminBusinessApi.requestBusinessInfo(
        facility._id,
        normalizedNote,
      );

      if (response?.success === false) {
        throw new Error(response.message || "Không thể gửi yêu cầu bổ sung");
      }

      setActionSuccess(
        `Đã gửi yêu cầu bổ sung thông tin ` +
          `cho thương hiệu "${facility.name}".`,
      );

      // Xóa ghi chú sau khi gửi thành công
      setAdminNote("");

      // Không cần đổi Business.status
      // Business vẫn PENDING
    } catch (err) {
      setActionError(err.message || "Không thể gửi yêu cầu bổ sung thông tin");

      // Đồng bộ trạng thái nếu có Admin khác
      // đã duyệt / từ chối thương hiệu
      setRefreshKey((prev) => prev + 1);
    } finally {
      updatingRef.current = false;
      setUpdating(false);
    }
  };

  // =========================
  // 9. RENDER
  // =========================
  return (
    <div className="p-8 space-y-6">
      {/* QUAY LẠI */}
      <div>
        <Link
          to="/admin/facilities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách cơ sở</span>
        </Link>
      </div>

      {/* THÔNG BÁO */}
      {actionSuccess && (
        <div
          role="status"
          className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
        >
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-700"
        >
          {actionError}
        </div>
      )}

      {/* ĐANG TẢI */}
      {isLoading && (
        <section className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
          <RefreshCw className="w-6 h-6 mx-auto mb-3 text-emerald-600 animate-spin" />

          <p className="text-sm text-slate-500">
            Đang tải thông tin thương hiệu...
          </p>
        </section>
      )}

      {/* LỖI TẢI BUSINESS */}
      {!isLoading && error && (
        <section className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-sm">
          <p className="text-sm text-rose-600 mb-4">{error}</p>

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </section>
      )}

      {/* CHI TIẾT BUSINESS */}
      {!isLoading && !error && facility && (
        <div className="space-y-5">
          <BusinessStatusBanner
            facility={facility}
            code={displayCode}
            onCopyCode={handleCopyCode}
            copied={copied}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* CỘT TRÁI */}
            <div className="lg:col-span-2 space-y-5">
              <BusinessOverviewCard
                facility={facility}
                branches={branches}
                services={services}
                servicesLoading={servicesLoading}
                servicesError={servicesError}
              />

              <BranchListCard branches={branches} />
            </div>

            {/* CỘT PHẢI */}
            <div className="space-y-5">
              <BusinessOwnerCard facility={facility} />

              <ApprovalActionCard
                status={facility.status}
                adminNote={adminNote}
                setAdminNote={(value) => {
                  setAdminNote(value);
                  setNoteError("");
                }}
                noteError={noteError}
                onApprove={handleApprove}
                onReject={handleReject}
                onSuspend={handleSuspend}
                onUnblock={handleUnblock}
                onRequestInfo={handleRequestInfo}
                isUpdating={updating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
