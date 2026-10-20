
import { useEffect, useState } from "react";
import { ArrowLeft, Building2, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { adminUserApi } from "../../services/adminUserApi";

import UserProfileBanner from "../../components/user/UserProfileBanner";
import PersonalInfoCard from "../../components/user/PersonalInfoCard";
import AddressCard from "../../components/user/AddressCard";
import PetsCard from "../../components/user/PetsCard";
import ActivityHistoryCard from "../../components/user/ActivityHistoryCard";

import KPIMetricsRow from "../../components/user/KPIMetricsRow";
import AccountStatusCard from "../../components/user/AccountStatusCard";
import RecentBookingsCard from "../../components/user/RecentBookingsCard";
import RecentPaymentsCard from "../../components/user/RecentPaymentsCard";

export default function UserDetail() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionStats, setSessionStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUserDetail = async () => {
      setIsLoading(true);
      setError("");
      setUser(null);
      setSessionStats(null);

      try {
        const response = await adminUserApi.getUserById(id);

        if (cancelled) return;

        if (!response.data?.user) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        setUser(response.data.user);
        setSessionStats(response.data.sessionStats ?? null);
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Không thể tải thông tin người dùng");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchUserDetail();
    } else {
      setError("Không tìm thấy ID người dùng");
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUserStatusChanged = async (updatedUser) => {
    setUser(updatedUser);
    setSessionStats(null);

    try {
      const response = await adminUserApi.getUserById(updatedUser._id);

      if (response.success && response.data) {
        setSessionStats(response.data.sessionStats ?? null);
      }
    } catch (error) {
      console.error("Không thể cập nhật thống kê phiên:", error);
      setSessionStats(null);
    }
  };

  const isCustomer = user?.role === "CUSTOMER";
  const isBusinessOwner = user?.role === "BUSINESS_OWNER";

  return (
    <div className="p-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách người dùng</span>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Đang tải thông tin người dùng...
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700">
          {error}
        </div>
      )}

      {/* User detail */}
      {!isLoading && !error && user && (
        <>
          {/* THÔNG TIN CHUNG CHO MỌI VAI TRÒ */}
          <UserProfileBanner
            user={user}
            onStatusChanged={handleUserStatusChanged}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[38%_62%] gap-4">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <PersonalInfoCard user={user} />

              <AddressCard user={user} />

              {/* Chỉ khách hàng mới hiển thị thú cưng */}
              {isCustomer && <PetsCard user={user} />}

              {/* Tạm giữ lịch sử hoạt động cho Customer */}
              {isCustomer && <ActivityHistoryCard user={user} />}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              {/* KPI dành riêng cho khách hàng */}
              {isCustomer && <KPIMetricsRow user={user} />}

              {/* Tất cả vai trò đều xem được trạng thái */}
              <AccountStatusCard
                user={user}
                sessionStats={sessionStats}
              />

              {/* Nội dung dành riêng cho Customer */}
              {isCustomer && (
                <>
                  <RecentBookingsCard user={user} />
                  <RecentPaymentsCard user={user} />
                </>
              )}

              {/* Nội dung dành riêng cho BUSINESS_OWNER */}
              {isBusinessOwner && (
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center">
                      <Building2
                        size={15}
                        className="text-purple-600"
                      />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">
                      Cơ sở kinh doanh
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs leading-5 text-slate-500">
                      Thông tin cơ sở, chi nhánh và dịch vụ được
                      quản lý tại trang Cơ sở kinh doanh.
                    </p>

                    <Link
                      to="/admin/facilities"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors"
                    >
                      <Building2 size={15} />
                      Xem cơ sở kinh doanh
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
