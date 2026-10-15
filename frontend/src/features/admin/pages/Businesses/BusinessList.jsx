// src/features/admin/pages/Businesses/BusinessList.jsx

import { useState, useMemo } from 'react';
import BusinessTable from '../../components/BusinessTable';
import {
  Search,
  ChevronDown,
  Filter,
  RotateCcw,
  Download,
  Plus,
} from 'lucide-react';

export const initialFacilities = [
  {
    id: 1,
    name: 'Happy Pet',
    email: 'happypet@gmail.com',
    phone: '0912 345 678',
    icon: '🐾',
    iconBg: 'bg-amber-100 border-amber-200 text-amber-700',
    owner: 'Nguyễn Minh Anh',
    ownerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmqEgUWziCwgtqyQx1gixOqm2x7iR5K4Dhgc-7Lbm-WIYNthE_UaH8-76YGWNYRj37vPcVhdt9d0U28DBwjUhpGKlreNDrn4BSVLX_fjr4ovLxd6PNaHG8KAfum7cESi3G30UJW2HGmeSy6cqMKCsC1xsTviMBaG8y6wJ3N11dwtG4jjufG5DafuF-Le66f-PTp2c95HRkD-uWe0iA0SHWYt7uTNZ7_pWPPOmTew',
    branches: 3,
    location: 'Hà Nội',
    status: 'Đã duyệt',
    rating: 4.8,
    ratingCount: 256,
    stars: '★★★★★',
    registerDate: '12/02/2025',
    registerTime: '14:25',
    actionType: 'standard',
  },
  {
    id: 2,
    name: 'Pet Paradise',
    email: 'petparadise@gmail.com',
    phone: '0933 222 111',
    icon: '🐕',
    iconBg: 'bg-cyan-100 border-cyan-200 text-cyan-700',
    owner: 'Trần Hoàng Nam',
    ownerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvRAOyp5ar80ppPhYSMczfbdfmK5UWB0ZIA9Bl1GWqeDsXSOKwbo5qMMLND6Qfb8AC1seSGl1o7ver6e5gcVNfQjT_wjPpQxBkx_siiyOtU8y-Ed_holYYRlec86bAGZPWvue7UvUio19osJpRqbuaHvWHhfwKmflo7kKNpRAITu8ehGNDGcO5-EWnBg5mJG8A1Z-op48_ICvSUV4EeJEh4XwksYRRL_4nrbxWsWI',
    branches: 5,
    location: 'TP. Hồ Chí Minh',
    status: 'Chờ duyệt',
    rating: 4.6,
    ratingCount: 189,
    stars: '★★★★★',
    registerDate: '22/05/2025',
    registerTime: '09:30',
    actionType: 'approval',
  },
  {
    id: 3,
    name: 'Meow Care',
    email: 'meowcare@gmail.com',
    phone: '0987 654 321',
    icon: '🐱',
    iconBg: 'bg-orange-100 border-orange-200 text-orange-700',
    owner: 'Lê Thu Hà',
    ownerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFWT7GSXKka52IFBTF5J3kJMKvY1kENikxFE0AcW1dQl3darw0xnyBh3wxOezhUhMWnnuK1KuwuIes3U56tZRX3vdrrETrUSWhNfpMVOtSVhRuUC3RVVCOEcm983N_rxHBxPORGtZ1MvZv7ot9LxyJRiGO6GUmGAIhipgBi44_PLq0mbejG_fatkgVeB7ml7u491viLblm31yEbUNTiY1HVkje3CqF9qSd2i7eWLw',
    branches: 2,
    location: 'Đà Nẵng',
    status: 'Đã duyệt',
    rating: 4.7,
    ratingCount: 142,
    stars: '★★★★★',
    registerDate: '05/01/2025',
    registerTime: '11:15',
    actionType: 'standard',
  },
  {
    id: 4,
    name: 'Poodle House',
    email: 'poodlehouse@gmail.com',
    phone: '0909 876 543',
    icon: '🐩',
    iconBg: 'bg-stone-100 border-stone-200 text-stone-700',
    owner: 'Phạm Quốc Bảo',
    ownerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKhm0ceNzJrYZQmDcbaH8ARLzsrgQ9EPLlC112fhrsxyMf7cwWCf9Qg73m1AsvtPbu9LvWXsrq6nfwDTGUrxVql_Dm0BmXjVB0rIwuEHqN6dqOdW3wgL25xpCS-eGmxG57Ns_uRxH6ToUVvyM11QTT55R8b_v5vwaS2U3BhTZl6hCMCVgY-8cV69K8iPpVL9XWUh5SNiY1tOKOGEp9TwFDVK7pW8-P8ZwmhwFtfbA',
    branches: 4,
    location: 'Hải Phòng',
    status: 'Tạm khóa',
    rating: 4.2,
    ratingCount: 98,
    stars: '★★★★☆',
    registerDate: '18/03/2025',
    registerTime: '16:40',
    actionType: 'unblock',
  },
  {
    id: 5,
    name: 'Paws Spa',
    email: 'pawsspa@gmail.com',
    phone: '0899 123 456',
    icon: '🐾',
    iconBg: 'bg-blue-100 border-blue-200 text-blue-700',
    owner: 'Vũ Thị Thanh Tâm',
    ownerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDT_wh80XUAz1Z6krL7ChWbrDEpqZLTYsWxGwjIq2AfL6s30tdnlRphLzlJQeBt2-lslWMmosVlZjcZ4elpuk_3t3B3iOWTi1I_v23GhZ6HGDxfuLjnSyPTSuu4TXGcTdGSAYaR-Yf_GZyYqD6e_YzlXa3QzrTZ-msLsZVhq0NGI8v405Atn6M-j-8m71v_kMgnTiJUEyFsruEHh4giATY3T2vJYgUaXV6TMJoJQ7g',
    branches: 3,
    location: 'Cần Thơ',
    status: 'Từ chối',
    rating: 3.9,
    ratingCount: 54,
    stars: '★★★☆☆',
    registerDate: '30/04/2025',
    registerTime: '10:20',
    actionType: 'standard',
  },
];

export default function BusinessList() {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'all',
    location: 'all',
  });

  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      const matchSearch =
        appliedFilters.search === '' ||
        item.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.owner.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.email.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.phone.includes(appliedFilters.search);

      const matchStatus =
        appliedFilters.status === 'all' || item.status === appliedFilters.status;

      const matchLocation =
        appliedFilters.location === 'all' || item.location === appliedFilters.location;

      return matchSearch && matchStatus && matchLocation;
    });
  }, [facilities, appliedFilters]);

  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchQuery.trim(),
      status: statusFilter,
      location: locationFilter,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setLocationFilter('all');
    setAppliedFilters({
      search: '',
      status: 'all',
      location: 'all',
    });
  };

  const handleApprove = (id) => {
    setFacilities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'Đã duyệt', actionType: 'standard' }
          : item
      )
    );
  };

  const handleReject = (id) => {
    setFacilities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'Từ chối', actionType: 'standard' }
          : item
      )
    );
  };

  const handleUnblock = (id) => {
    setFacilities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'Đã duyệt', actionType: 'standard' }
          : item
      )
    );
  };

  return (
    <div className="p-8 space-y-6 flex-1">
      {/* Filter Bar */}
      <section className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Filter */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilter();
                }
              }}
              className="w-full pr-10 pl-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
              placeholder="Tìm theo tên cơ sở, chủ sở hữu, SĐT..."
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Tạm khóa">Tạm khóa</option>
              <option value="Từ chối">Từ chối</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Location Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer"
            >
              <option value="all">Khu vực: Tất cả</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Nút Lọc và Reset cạnh bộ lọc khu vực */}
          <button
            onClick={handleApplyFilter}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer"
            title="Áp dụng bộ lọc"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer">
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất dữ liệu</span>
          </button>

          <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Thêm cơ sở</span>
          </button>
        </div>
      </section>

      {/* Facilities Table */}
      <BusinessTable
        data={filteredFacilities}
        onApprove={handleApprove}
        onReject={handleReject}
        onUnblock={handleUnblock}
        totalCount={facilities.length}
      />
    </div>
  );
}