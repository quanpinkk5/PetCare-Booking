import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const titlesMap = {
  '/admin': 'Tổng quan hệ thống',
  '/admin/dashboard': 'Tổng quan hệ thống',
  '/admin/users': 'Quản lý người dùng',
  '/admin/facilities': 'Quản lý cơ sở',
  '/admin/services': 'Quản lý dịch vụ',
  '/admin/bookings': 'Quản lý lịch hẹn',
  '/admin/payments': 'Quản lý thanh toán',
  '/admin/reviews': 'Quản lý đánh giá',
  '/admin/reports': 'Báo cáo & Thống kê',
  '/admin/notifications': 'Thông báo hệ thống',
  '/admin/settings': 'Cài đặt hệ thống',
};

export default function AdminLayout({ children }) {
  const location = useLocation();
  const currentTitle =
    titlesMap[location.pathname] ||
    (location.pathname.startsWith('/admin/users') ? 'Quản lý người dùng' : 'Tổng quan hệ thống');

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <AdminHeader title={currentTitle} />

          <main className="flex-1 overflow-y-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}