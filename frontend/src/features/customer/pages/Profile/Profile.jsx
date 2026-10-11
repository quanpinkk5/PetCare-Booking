import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Star,
  Clock
} from 'lucide-react';

import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileSummary from '../../components/Profile/ProfileSummary';
import ProfileForms from '../../components/Profile/ProfileForms';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { useAuth } from '../../../../context/AuthContext';
import { DEFAULT_USER } from '../../../auth/data/mockUsers';

const PETS = [
  {
    id: 1,
    name: 'Milo',
    gender: '♂',
    breed: 'Golden Retriever',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU',
  },
  {
    id: 2,
    name: 'Mimi',
    gender: '♀',
    breed: 'British Shorthair',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME',
  },
];

const ACTIVITIES = [
  {
    id: 1,
    title: 'Hoàn thành dịch vụ Spa & Tắm cho Milo',
    time: 'Hôm qua, 15:30',
    icon: Sparkles
  },
  {
    id: 2,
    title: 'Đặt lịch Khám tổng quát tại CS Cầu Giấy',
    time: '3 ngày trước',
    icon: Calendar
  },
  {
    id: 3,
    title: 'Đánh giá 5 sao cho dịch vụ Grooming',
    time: '1 tuần trước',
    icon: Star
  },
  {
    id: 4,
    title: 'Cập nhật sổ tiêm chủng cho Mimi',
    time: '2 tuần trước',
    icon: Clock
  }
];

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'info';

  const { user: authUser, updateUser } = useAuth();
  const [activeTab, setActiveTabState] = useState(currentTab);
  const user = authUser || DEFAULT_USER;

  const handleTabChange = (tabId) => {
    setActiveTabState(tabId);
    setSearchParams(tabId === 'info' ? {} : { tab: tabId });
  };

  const handleSaveUser = (updatedData) => {
    updateUser(updatedData);
  };

  const handleAvatarChange = (newAvatarUrl) => {
    updateUser({ avatar: newAvatarUrl });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-12">
      {/* Banner & Breadcrumbs */}
      <ProfileBanner />

      {/* Main Profile Grid */}
      <main className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Cột trái: Tóm tắt thông tin người dùng + Menu chuyển mục */}
          <ProfileSummary
            user={user}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onAvatarChange={handleAvatarChange}
          />

          {/* Cột giữa: Các biểu mẫu thông tin (Thông tin cá nhân, Đổi mật khẩu, Địa chỉ, Cài đặt) */}
          <ProfileForms
            user={user}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onSaveUser={handleSaveUser}
          />

          {/* Cột phải: Thú cưng, Hoạt động gần đây, Hỗ trợ */}
          <ProfileSidebar
            pets={PETS}
            activities={ACTIVITIES}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;
