import { useState } from 'react';
import {
  User,
  ShieldCheck,
  MapPin,
  Bell,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';

const ProfileForms = ({
  user,
  activeTab = 'info',
  setActiveTab = () => {},
  onSaveUser = () => {}
}) => {
  // Personal Info Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Nam',
    birthday: user?.birthday || '1998-05-15',
    address: user?.address || '',
    bio: user?.bio || ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Nhà riêng',
      detail: 'Số 123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội',
      isDefault: true
    },
    {
      id: 2,
      type: 'Cơ quan',
      detail: 'Tòa nhà FPT, Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
      isDefault: false
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    smsReminder: true,
    petVaccination: true,
    promotions: false
  });

  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSaveUser(formData);
      showToast('Cập nhật thông tin cá nhân thành công!');
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới!');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Đổi mật khẩu thành công!');
    }, 600);
  };

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'security', label: 'Đổi mật khẩu', icon: ShieldCheck },
    { id: 'address', label: 'Sổ địa chỉ', icon: MapPin },
    { id: 'notifications', label: 'Thông báo', icon: Bell }
  ];

  return (
    <div className="col-span-12 lg:col-span-6 space-y-5">
      {/* Tab Switcher Headers */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Success Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Personal Info Form */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-800">
              Thông tin hồ sơ cá nhân
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cập nhật thông tin chi tiết để chúng tôi phục vụ bạn tốt hơn
            </p>
          </div>

          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInfoChange}
                  required
                  placeholder="Nhập họ và tên"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInfoChange}
                  required
                  placeholder="Nhập số điện thoại"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInfoChange}
                  required
                  placeholder="example@gmail.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInfoChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Giới tính
              </label>
              <div className="flex items-center gap-6 text-xs text-slate-700">
                {['Nam', 'Nữ', 'Khác'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInfoChange}
                      className="text-emerald-500 focus:ring-emerald-400"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ liên hệ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInfoChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú về bản thân / thú cưng
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInfoChange}
                placeholder="Ví dụ: Tôi thường bận vào các buổi sáng trong tuần, ưu tiên đặt lịch vào cuối tuần..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  gender: user?.gender || 'Nam',
                  birthday: user?.birthday || '1998-05-15',
                  address: user?.address || '',
                  bio: user?.bio || ''
                })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Hoàn tác</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save size={13} />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Change Password Form */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-800">
              Đổi mật khẩu tài khoản
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Đảm bảo tài khoản an toàn bằng mật khẩu có độ bảo mật cao
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  placeholder="Nhập mật khẩu đang dùng"
                  className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  required
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Mẹo tạo mật khẩu an toàn:</p>
              <p>• Dài ít nhất 6-8 ký tự</p>
              <p>• Kết hợp chữ cái in hoa, chữ thường và chữ số</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck size={14} />
                <span>{isSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Sổ địa chỉ của bạn
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý các địa chỉ đưa đón thú cưng thuận tiện
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newDetail = prompt('Nhập địa chỉ mới của bạn:');
                if (newDetail) {
                  setAddresses((prev) => [
                    ...prev,
                    { id: Date.now(), type: 'Địa chỉ phụ', detail: newDetail, isDefault: false }
                  ]);
                  showToast('Đã thêm địa chỉ mới!');
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Thêm mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {addr.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddresses((prev) =>
                          prev.map((a) => ({ ...a, isDefault: a.id === addr.id }))
                        );
                        showToast('Đã đặt làm địa chỉ mặc định!');
                      }}
                      className="text-[11px] text-slate-400 hover:text-emerald-600 font-medium px-2 py-1 rounded hover:bg-white"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
                        showToast('Đã xóa địa chỉ!');
                      }}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-white"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-800">
              Cài đặt thông báo
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chọn các hình thức nhận thông báo về dịch vụ và thú cưng
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Thông báo lịch hẹn qua Email</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nhận email xác nhận khi đặt lịch thành công hoặc thay đổi trạng thái
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailBooking}
                onChange={(e) => setNotifications((p) => ({ ...p, emailBooking: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Nhắc lịch hẹn qua SMS</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nhận tin nhắn nhắc hẹn trước 2 giờ khi lịch hẹn bắt đầu
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsReminder}
                onChange={(e) => setNotifications((p) => ({ ...p, smsReminder: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Nhắc lịch tiêm chủng thú cưng</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nhận nhắc nhở định kỳ về mũi tiêm và tẩy giun cho thú cưng
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.petVaccination}
                onChange={(e) => setNotifications((p) => ({ ...p, petVaccination: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Khuyến mãi và ưu đãi</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nhận tin về các chương trình giảm giá và quà tặng thành viên
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) => setNotifications((p) => ({ ...p, promotions: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Đã lưu cấu hình thông báo!')}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Save size={13} />
                <span>Lưu cài đặt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForms;