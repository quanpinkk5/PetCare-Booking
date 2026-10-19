import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileSummary from '../../components/Profile/ProfileSummary';
import ProfileForms from '../../components/Profile/ProfileForms';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { useAuth } from '../../../../context/AuthContext';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'info';
  const activeTab = ['info', 'security', 'address', 'notifications'].includes(tab) ? tab : 'info';
  const { user, updateUser, isAuthLoading } = useAuth();
  const [avatarStatus, setAvatarStatus] = useState(null);
  const [isAvatarSaving, setIsAvatarSaving] = useState(false);

  if (isAuthLoading) return <p role="status">Đang tải thông tin cá nhân...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'CUSTOMER') return <Navigate to="/" replace />;

  const handleTabChange = (tabId) => {
    setSearchParams(tabId === 'info' ? {} : { tab: tabId });
  };

  const handleAvatarChange = async (file) => {
    if (isAvatarSaving) return;
    setAvatarStatus(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 256 * 1024) {
      setAvatarStatus({ success: false, message: 'Chọn ảnh PNG, JPEG hoặc WebP tối đa 256 KB.' });
      return;
    }
    setIsAvatarSaving(true);
    try {
      const avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không thể đọc ảnh đã chọn.'));
        reader.readAsDataURL(file);
      });
      const result = await updateUser({ avatar });
      setAvatarStatus({ success: result.success, message: result.success ? 'Đã lưu ảnh đại diện.' : result.error });
    } catch (error) {
      setAvatarStatus({ success: false, message: error.message || 'Không thể cập nhật ảnh đại diện.' });
    } finally {
      setIsAvatarSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-12">
      <ProfileBanner />
      <main className="max-w-[1400px] mx-auto px-6">
        {avatarStatus && (
          <p role={avatarStatus.success ? 'status' : 'alert'} className="mb-4 rounded-xl bg-white p-3 text-sm">
            {avatarStatus.message}
          </p>
        )}
        <div className="grid grid-cols-12 gap-6 items-start">
          <ProfileSummary user={user} activeTab={activeTab} setActiveTab={handleTabChange}
            onAvatarChange={handleAvatarChange} isAvatarSaving={isAvatarSaving} />
          <ProfileForms key={user.id} user={user} activeTab={activeTab}
            setActiveTab={handleTabChange} onSaveUser={updateUser} />
          <ProfileSidebar />
        </div>
      </main>
    </div>
  );
};

export default Profile;
