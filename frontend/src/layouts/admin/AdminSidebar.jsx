import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  Star,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutGrid,
      path: '/admin',
    },
    {
      label: 'Người dùng',
      icon: Users,
      path: '/admin/users',
    },
    {
      label: 'Cơ sở',
      icon: Building2,
      path: '/admin/facilities',
    },
    {
      label: 'Danh mục dịch vụ',
      icon: FileText,
      path: '/admin/services',
    },
    {
      label: 'Bookings',
      icon: Calendar,
      path: '/admin/bookings',
    },
    {
      label: 'Thanh toán',
      icon: CreditCard,
      path: '/admin/payments',
    },
    {
      label: 'Đánh giá',
      icon: Star,
      path: '/admin/reviews',
    },
    {
      label: 'Báo cáo',
      icon: BarChart3,
      path: '/admin/reports',
    },
    {
      label: 'Thông báo',
      icon: Bell,
      path: '/admin/notifications',
    },
    {
      label: 'Cài đặt',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between py-5 px-4">
      <div>
        {/* Brand Logo */}
        <Link to="/admin" className="flex items-center gap-3 px-2 mb-6 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 10.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-5.5 1.5c1.38 0 2.5-1.12 2.5-2.5S7.88 7 6.5 7 4 8.12 4 9.5s1.12 2.5 2.5 2.5zm11 0c1.38 0 2.5-1.12 2.5-2.5S18.88 7 17.5 7 15 8.12 15 9.5s1.12 2.5 2.5 2.5zm-5.5 2c-3.11 0-7 2.16-7 5.5 0 1.93 1.57 3.5 3.5 3.5 1.25 0 2.37-.65 3-1.63.63.98 1.75 1.63 3 1.63 1.93 0 3.5-1.57 3.5-3.5 0-3.34-3.89-5.5-7-5.5z" />
            </svg>
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              PetCare Booking
            </h1>

            <p className="text-xs text-slate-400 font-medium">
              Admin Portal
            </p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'font-semibold bg-[#e8f5e9] text-[#1b5e20]'
                    : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-[#2e7d32]'
                      : 'text-slate-400'
                  }`}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}