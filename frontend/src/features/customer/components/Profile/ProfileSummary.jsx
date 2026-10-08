import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Calendar,
  Star,
  Mail,
  Phone,
  Camera,
  User,
  ShieldCheck,
  MapPin,
  Bell,
  ChevronRight
} from 'lucide-react';

const ProfileSummary = ({
  user,
  activeTab = 'info',
  setActiveTab = () => {},
  onAvatarChange = () => {}
}) => {
  const fileInputRef = useRef(null);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    }
  };

  const navItems = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'security', label: 'Đổi mật khẩu', icon: ShieldCheck },
    { id: 'address', label: 'Sổ địa chỉ', icon: MapPin },
    { id: 'notifications', label: 'Cài đặt thông báo', icon: Bell },
  ];

  return (
    <div className="col-span-12 lg:col-span-3 space-y-5">
      {/* User Info Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center relative overflow-hidden">
        {/* Avatar with Upload button */}
        <div className="relative w-24 h-24 mx-auto mb-3 group">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-sm overflow-hidden">
            <img
              alt={user?.name || 'User'}
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Đổi ảnh đại diện"
            className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all transform hover:scale-110 cursor-pointer"
          >
            <Camera size={13} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFile}
            accept="image/*"
            className="hidden"
          />
        </div>

        <h2 className="text-base font-bold text-slate-800 leading-snug">
          {user?.name || 'Người dùng PetCare'}
        </h2>

        {/* Member tags */}
        <div className="flex items-center justify-center gap-2 mt-1.5 mb-3 flex-wrap">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            Khách hàng
          </span>

          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Star
              size={12}
              className="text-amber-500 fill-amber-500"
            />
            {user?.tier || 'Thành viên Bạc'}
          </span>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1 text-[11px] text-slate-500 mb-4 items-center">
          <div className="flex items-center gap-1.5">
            <Mail size={13} className="text-slate-400" />
            <span className="truncate max-w-[200px]">{user?.email || 'chua_cap_nhat@email.com'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Phone size={13} className="text-slate-400" />
            <span>{user?.phone || 'Chưa cập nhật SĐT'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 pt-3 border-t border-slate-100 text-center">
          <Link
            to="/my-pets"
            className="px-1 border-r border-slate-100 hover:bg-slate-50 rounded-lg transition-colors py-1 group"
          >
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5 group-hover:text-emerald-600">
              <PawPrint
                size={12}
                className="text-emerald-500"
              />
              <span>Thú cưng</span>
            </div>

            <span className="text-base font-bold text-emerald-600">
              {user?.petCount ?? 2}
            </span>
          </Link>

          <Link
            to="/booking"
            className="px-1 border-r border-slate-100 hover:bg-slate-50 rounded-lg transition-colors py-1 group"
          >
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5 group-hover:text-emerald-600">
              <Calendar
                size={12}
                className="text-emerald-500"
              />
              <span>Lịch đặt</span>
            </div>

            <span className="text-base font-bold text-emerald-600">
              {user?.bookingCount ?? 12}
            </span>
          </Link>

          <div className="px-1 py-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Star
                size={12}
                className="text-emerald-500"
              />
              <span>Đánh giá</span>
            </div>

            <span className="text-base font-bold text-emerald-600">
              {user?.reviewCount ?? 5}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu / Chuyển mục hồ sơ */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Mục tài khoản
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={isActive ? 'text-white' : 'text-slate-300'}
                />
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100">
            <Link
              to="/my-pets"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <PawPrint size={15} className="text-slate-400" />
                <span>Quản lý thú cưng</span>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </Link>

            <Link
              to="/booking"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className="text-slate-400" />
                <span>Đặt lịch hẹn mới</span>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSummary;