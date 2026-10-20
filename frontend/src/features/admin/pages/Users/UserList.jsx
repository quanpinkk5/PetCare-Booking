import { useEffect, useState } from "react";

import UserFilterBar from "../../components/UserFilterBar";
import UserKPISummary from "../../components/UserKPISummary";
import UserTable from "../../components/UserTable";
import UserRightWidgets from "../../components/UserRightWidgets";
import CreateBusinessOwnerModal from "../../components/CreateBusinessOwnerModal";
import { adminUserApi } from "../../services/adminUserApi";

export default function UserList() {
  const [filters, setFilters] = useState(null);
  const [isCreateOwnerOpen, setIsCreateOwnerOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [statisticsError, setStatisticsError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  // Tải thống kê khi mở trang hoặc khi dữ liệu thay đổi
  useEffect(() => {
    let cancelled = false;

    const fetchStatistics = async () => {
      setStatisticsLoading(true);
      setStatisticsError("");

      try {
        const response = await adminUserApi.getUserStatistics();

        if (cancelled) return;

        if (!response?.data) {
          throw new Error("Dữ liệu thống kê không hợp lệ");
        }

        setStatistics(response.data);
      } catch (err) {
        if (cancelled) return;

        setStatistics(null);
        setStatisticsError(err.message || "Không thể tải thống kê người dùng");
      } finally {
        if (!cancelled) {
          setStatisticsLoading(false);
        }
      }
    };

    fetchStatistics();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleFilter = (criteria) => {
    setFilters(criteria);
  };

  const handleReset = () => {
    setFilters(null);
  };

  const handleOwnerCreated = () => {
    // Tải lại cả bảng và thống kê
    setRefreshKey((previous) => previous + 1);
    setFilters(null);
  };

  const handleUserStatusChanged = () => {
    // Khóa/mở khóa tài khoản làm thay đổi KPI
    setRefreshKey((previous) => previous + 1);
  };

  const handleExportUsers = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      // filters là bộ lọc đã được áp dụng bằng nút "Lọc".
      // Không có filters nghĩa là xuất tất cả tài khoản.
      const blob = await adminUserApi.exportUsers(filters || {});

      const fileUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;

      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      link.download = `petcare-users-${today.replace(/-/g, "")}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cho trình duyệt đủ thời gian bắt đầu tải file.
      window.setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 1000);
    } catch (error) {
      alert(error.message || "Xuất dữ liệu thất bại");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="p-8 space-y-6 flex-1">
      <UserFilterBar
        onFilter={handleFilter}
        onReset={handleReset}
        onCreateOwner={() => setIsCreateOwnerOpen(true)}
        onExport={handleExportUsers}
        isExporting={isExporting}
      />

      {statisticsError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
        >
          {statisticsError}
        </div>
      )}

      <UserKPISummary statistics={statistics} isLoading={statisticsLoading} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div id="user-list-table" className="contents">
          <UserTable
            key={refreshKey}
            filters={filters}
            onStatusChanged={handleUserStatusChanged}
          />
        </div>

        <UserRightWidgets
          statistics={statistics}
          isLoading={statisticsLoading}
        />
      </div>

      <CreateBusinessOwnerModal
        isOpen={isCreateOwnerOpen}
        onClose={() => setIsCreateOwnerOpen(false)}
        onCreated={handleOwnerCreated}
      />
    </main>
  );
}
