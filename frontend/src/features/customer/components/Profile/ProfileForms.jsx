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
} from 'lucide-react';

const getFormData = (user) => ({
  name: user?.fullName || user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  gender: user?.gender || '',
  birthday: user?.birthday || '',
  address: typeof user?.address === 'string'
    ? { province: '', district: '', ward: '', detail: user.address }
    : { province: '', district: '', ward: '', detail: '', ...user?.address },
  bio: user?.bio || ''
});

const ProfileForms = ({
  user,
  activeTab = 'info',
  setActiveTab = () => {},
  onSaveUser = () => {}
}) => {
  const [formData, setFormData] = useState(() => getFormData(user));
  const [addressData, setAddressData] = useState(() => getFormData(user).address);
  const [savedUser, setSavedUser] = useState(user);
  if (savedUser !== user) {
    setSavedUser(user);
    // Avatar updates must not erase an unfinished form.
    if (JSON.stringify(getFormData(savedUser)) !== JSON.stringify(getFormData(user))) {
      setFormData(getFormData(user));
      setAddressData(getFormData(user).address);
    }
  }

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

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    smsReminder: true,
    petVaccination: true,
    promotions: false
  });

  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const saveProfile = async (payload, message) => {
    if (isSaving) return;
    setIsSaving(true);
    setToastMessage('');
    setErrorMessage('');
    try {
      const result = await onSaveUser(payload);
      if (!result?.success) throw new Error(result?.error || 'Không thể lưu thông tin.');
      showToast(message);
    } catch (error) {
      setErrorMessage(error.message || 'Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Họ tên không được để trống.');
      return;
    }
    return saveProfile({
      fullName: formData.name.trim(), phone: formData.phone.trim(),
      gender: formData.gender, birthday: formData.birthday,
      bio: formData.bio, address: formData.address
    }, 'Cập nhật thông tin cá nhân thành công!');
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
    if (passwordData.newPassword.length < 8) {
      alert('Mật khẩu mới phải có tối thiểu 8 ký tự!');
      return;
    }
    setErrorMessage('Chức năng đổi mật khẩu chưa được hỗ trợ. Vui lòng dùng Quên mật khẩu tại trang đăng nhập.');
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

      {errorMessage && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs">
          {errorMessage}
        </div>
      )}
      {/* Success Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span role="status" className="font-medium">{toastMessage}</span>
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
            <fieldset disabled={isSaving} className="space-y-4">
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
                  readOnly
                  title="Email đăng nhập không thể thay đổi tại đây"
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
                {['', 'Nam', 'Nữ', 'Khác'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInfoChange}
                      className="text-emerald-500 focus:ring-emerald-400"
                    />
                    <span>{g || 'Chưa cập nhật'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries({ province: 'Tỉnh / Thành phố', district: 'Quận / Huyện', ward: 'Phường / Xã', detail: 'Số nhà, tên đường' }).map(([field, label]) => (
                <label key={field} className="block text-xs font-semibold text-slate-700">
                  {label}
                  <input type="text" value={formData.address[field]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: { ...prev.address, [field]: e.target.value } }))}
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú về bản thân / thú cưng
              </label>
              <textarea
                name="bio"
                rows={3}
                maxLength={1000}
                value={formData.bio}
                onChange={handleInfoChange}
                placeholder="Ví dụ: Tôi thường bận vào các buổi sáng trong tuần, ưu tiên đặt lịch vào cuối tuần..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormData(getFormData(user))}
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
          </fieldset>
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
            <p className="text-xs text-amber-700 mt-2">Chức năng này chưa được hỗ trợ. Bạn có thể dùng Quên mật khẩu tại trang đăng nhập.</p>
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
              <p>• Dài ít nhất 8 ký tự</p>
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

      {activeTab === 'address' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Địa chỉ liên hệ</h3>
          <p className="text-xs text-slate-400 mb-5">Địa chỉ dùng cho hồ sơ và liên hệ của bạn.</p>
          <form onSubmit={(e) => { e.preventDefault(); saveProfile({ address: addressData }, 'Đã lưu địa chỉ!'); }}>
            <fieldset disabled={isSaving} className="space-y-4">
              {Object.entries({ province: 'Tỉnh / Thành phố', district: 'Quận / Huyện', ward: 'Phường / Xã', detail: 'Số nhà, tên đường' }).map(([field, label]) => (
                <label key={field} className="block text-xs font-semibold text-slate-700">
                  {label}
                  <input type="text" value={addressData[field]}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
                </label>
              ))}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setAddressData(getFormData(user).address)} className="text-xs px-4 py-2">Hoàn tác</button>
                <button type="submit" className="text-xs bg-emerald-500 text-white rounded-xl px-5 py-2.5 disabled:opacity-50">
                  {isSaving ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </fieldset>
          </form>
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
            <p className="text-xs text-amber-700 mt-2">Chức năng lưu cài đặt thông báo đang được phát triển.</p>
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
                onClick={() => setErrorMessage('Cài đặt thông báo chưa được hỗ trợ lưu.')}
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
