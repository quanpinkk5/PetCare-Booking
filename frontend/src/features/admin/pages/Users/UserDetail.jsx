import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import UserProfileBanner from '../../components/user/UserProfileBanner';
import PersonalInfoCard from '../../components/user/PersonalInfoCard';
import AddressCard from '../../components/user/AddressCard';
import PetsCard from '../../components/user/PetsCard';
import ActivityHistoryCard from '../../components/user/ActivityHistoryCard';

import KPIMetricsRow from '../../components/user/KPIMetricsRow';
import AccountStatusCard from '../../components/user/AccountStatusCard';
import RecentBookingsCard from '../../components/user/RecentBookingsCard';
import RecentPaymentsCard from '../../components/user/RecentPaymentsCard';

export default function UserDetail() {
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


        {/* =====================================================
            1. THÔNG TIN TỔNG QUAN NGƯỜI DÙNG
        ===================================================== */}
        <UserProfileBanner />


        {/* =====================================================
            2. NỘI DUNG CHÍNH
            LEFT  = 38%
            RIGHT = 62%
        ===================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-[38%_62%] gap-4">

          {/* ===================================================
              LEFT COLUMN
          =================================================== */}
          <div className="space-y-4">

            <PersonalInfoCard />

            <AddressCard />

            <PetsCard />

            <ActivityHistoryCard />

          </div>


          {/* ===================================================
              RIGHT COLUMN
          =================================================== */}
          <div className="space-y-4">

            {/* 4 KPI nằm trên cùng một hàng */}
            <KPIMetricsRow />

            {/* Trạng thái tài khoản */}
            <AccountStatusCard />

            {/* Booking gần đây */}
            <RecentBookingsCard />

            {/* Thanh toán gần đây */}
            <RecentPaymentsCard />

          </div>

        </div>
    </div>
  );
}