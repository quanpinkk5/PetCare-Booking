import { useState } from 'react';
import NotificationTable from '../../components/notification/NotificationTable';

const initialNotifications = [
  {
    id: 1,
    title: 'Yêu cầu phê duyệt cơ sở mới',
    desc: 'Pet Paradise Spa đã gửi yêu cầu đăng ký cơ sở mới tại Quận 7, TP. Hồ Chí Minh.',
    category: 'Hệ thống',
    categoryStyle: 'bg-emerald-50 text-emerald-600',
    time: '10 phút trước',
  },
  {
    id: 2,
    title: 'Báo cáo mới được gửi',
    desc: 'Báo cáo doanh thu tháng 5/2025 đã được gửi từ hệ thống.',
    category: 'Báo cáo',
    categoryStyle: 'bg-purple-50 text-purple-600',
    time: '25 phút trước',
  },
  {
    id: 3,
    title: 'Giao dịch thanh toán thất bại',
    desc: 'Thanh toán #PAY250522-7890 của khách hàng Minh Anh bị thất bại.',
    category: 'Thanh toán',
    categoryStyle: 'bg-amber-50 text-amber-600',
    time: '45 phút trước',
  },
  {
    id: 4,
    title: 'Đánh giá đáng ngờ được báo cáo',
    desc: 'Có 3 đánh giá bị báo cáo là spam tại cơ sở "Happy Paws Spa".',
    category: null,
    categoryStyle: '',
    time: '1 giờ trước',
  },
  {
    id: 5,
    title: 'Tranh chấp booking cần xử lý',
    desc: 'Booking #BK250521-4567 đang có tranh chấp giữa khách hàng và cơ sở.',
    category: 'Booking',
    categoryStyle: 'bg-blue-50 text-blue-600',
    time: '2 giờ trước',
  },
  {
    id: 6,
    title: 'Cập nhật chính sách hệ thống',
    desc: 'Chính sách hoàn tiền và hủy dịch vụ đã được cập nhật từ ngày 21/05/2025.',
    category: 'Hệ thống',
    categoryStyle: 'bg-emerald-50 text-emerald-600',
    time: '3 giờ trước',
  },
  {
    id: 7,
    title: 'Bảo trì hệ thống định kỳ',
    desc: 'Hệ thống sẽ bảo trì từ 02:00 đến 04:00 ngày 23/05/2025.',
    category: 'Hệ thống',
    categoryStyle: 'bg-emerald-50 text-emerald-600',
    time: '1 ngày trước',
  },
];

export default function NotificationList() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [selectedIds, setSelectedIds] = useState([]);

  // Kiểm tra tất cả thông báo hiện có đã được chọn hay chưa.
  const isAllSelected =
    notifications.length > 0 &&
    notifications.every((item) => selectedIds.includes(item.id));

  // Chọn hoặc bỏ chọn tất cả thông báo.
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(notifications.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Chọn hoặc bỏ chọn một thông báo.
  const handleSelectOne = (id) => {
    setSelectedIds((previousIds) =>
      previousIds.includes(id)
        ? previousIds.filter((itemId) => itemId !== id)
        : [...previousIds, id]
    );
  };

  // Xóa các thông báo được chọn.
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    setNotifications((previousNotifications) =>
      previousNotifications.filter(
        (item) => !selectedIds.includes(item.id)
      )
    );

    setSelectedIds([]);
  };

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Quản lý thông báo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Theo dõi và quản lý tất cả thông báo hệ thống và
          thông báo quan trọng.
        </p>
      </div>

      <NotificationTable
        notifications={notifications}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onDeleteSelected={handleDeleteSelected}
      />
    </main>
  );
}
