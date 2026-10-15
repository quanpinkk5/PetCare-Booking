import React, { useMemo, useState } from 'react';
import {
  PawPrint,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import BookingMetrics from '../../components/booking/BookingMetrics';
import BookingFilter from '../../components/booking/BookingFilter';
import BookingTable from '../../components/booking/BookingTable';

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [bookingTypeFilter, setBookingTypeFilter] = useState(
    'Tất cả loại booking'
  );

  // ==============================
  // METRICS DATA
  // ==============================
  const metrics = [
    {
      title: 'Tổng booking',
      value: '3.892',
      icon: Calendar,
      bg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Chờ xác nhận',
      value: '512',
      icon: Clock,
      bg: 'bg-amber-50 text-amber-500',
    },
    {
      title: 'Đang thực hiện',
      value: '1.246',
      icon: PawPrint,
      bg: 'bg-sky-50 text-sky-500',
    },
    {
      title: 'Hoàn thành',
      value: '1.987',
      icon: CheckCircle2,
      bg: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Đã hủy',
      value: '147',
      icon: XCircle,
      bg: 'bg-rose-50 text-rose-500',
    },
  ];

  // ==============================
  // BOOKING DATA
  // ==============================
  const [bookings] = useState([
    {
      id: 'BIZ250522-0987',
      customer: {
        name: 'Nguyễn Minh Anh',
        phone: '0912 345 678',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAH0yL6DbbkRZLDEktPDhc4zHZvHzJCx1OMdjL5TLclLt81MZllJUI6oK9f9p0zoQhCc0AvQHPoyzQLMYnxLx1XvAGOdbAo1o26KUnuhn2IoRccGGsEl5tZWlof9WGkhgJtDsdSgsG5f3emOry6KRkffsEFcYaQvjn_-zXIaz28T6OGf1HvpuVIETzXD1BWqMN4AzcXzTcjXIG0k42bVwLZTQf19xzF_tK71-uIw6g',
      },
      facility: {
        name: 'Happy Pet Cầu Giấy',
        address: '123 Nguyễn Khang, Cầu Giấy',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Chờ xác nhận',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0986',
      customer: {
        name: 'Trần Hoàng Nam',
        phone: '0912 345 678',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3lAe2vtrQJ9CXIOt_8sMml9o6P0wdj4q3OKU5jDtb_Py2nDJ3-bgq3Y0qBW12BbpxQRwhbqctCofRHb2P-_fpDOYnCCSMTlvh_l8jL0WGbg2CeeEjeWl8KcKeycd3eM9iMMREgnsvBdn51lJH8jB9Ojfqd58wIBrzMpGELlapscjmN9JJsCG6RjKbzY0UaX-JAMBNA9Wo9cv4HAWsaADil1ANwLl0ZwXyRcjG7w',
      },
      facility: {
        name: 'Happy Pet Hà Đông',
        address: '45 Trần Phú, Hà Đông',
      },
      paymentStatus: 'Chưa thanh toán',
      bookingStatus: 'Đã xác nhận',
      type: 'BOARDING',
    },
    {
      id: 'BIZ250522-0985',
      customer: {
        name: 'Lê Thu Hà',
        phone: '0909 876 543',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDW-Z2hQMKs4gShach8ZLUng_SmF1fQDpsEYTVsJjJZg4hmV5UJHazXKVPxkOGLMedoTaTEvsEpE4QbveKLWOPNCl_UAvU5QplXgYHO4SwSvDXuHhaVU4DeFBZ7NSTCpePaInWzRLHr6epC5ZLrmhI6JW30sZZaTGtU0cifR_-6MqcSgEegsuK_K-SrRguYG8GTjO3k-QYmzzQoPP-6dxQXupSe84gtqtvGKPdRlPc',
      },
      facility: {
        name: 'Happy Pet Cầu Giấy',
        address: '123 Nguyễn Khang, Cầu Giấy',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Đang thực hiện',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0984',
      customer: {
        name: 'Phạm Quốc Bảo',
        phone: '0976 543 210',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDGlOmp1K7bihbSDsTECmNihPAyVxx-6qxZ3-2g13nJ27KbzT_1_N4jpDmDPYHytwx1C9-ffrDzFhnLfp5ktlm-JpnNr3vhx-PpPU9YGt122RLmG1ZAjPuBvdKvCWMeona9-khsEWy5lJOyiMjk7I9G9KA9ZbDxPtfXw_EaEeSKbk8mccN2OaWKqaZ7t28cEFGIjfXT7FiBM1NetikQCq7w5pAJ3-qhhzJMhRJzYDo',
      },
      facility: {
        name: 'Happy Pet Hà Đông',
        address: '45 Trần Phú, Hà Đông',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Hoàn thành',
      type: 'BOARDING',
    },
    {
      id: 'BIZ250522-0983',
      customer: {
        name: 'Vũ Thị Thanh Tâm',
        phone: '0888 123 456',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDBKABkqmMiAbbT7C8fSyzhNq77nam2--WOq1jXuVgJvPwDUR08zbGy8E1Cy6wX1gbJIAMkT6mrcmm7lxpIK5VzDmvHfegrWz9VxHCDaHqCA_2KebRrZKeMQG6wnX32MLpC7v1c7-femVLLVAqNioIqtoB5MxUR5YI-kg7Obv63syTcBwf3XW6BrSuRXpa4YskOQwzbY3LHY1Ktm3xwJNG_bziDIDt2BA8bngpMFZ8',
      },
      facility: {
        name: 'Happy Pet Cầu Giấy',
        address: '123 Nguyễn Khang, Cầu Giấy',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Đang thực hiện',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0982',
      customer: {
        name: 'Đặng Minh Quân',
        phone: '0938 765 432',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCg7vMggLkDMAxIjWUEDTFy6enYRZc29mNG2rbgJfhucujppbnYN5U7tN5JV-_Xx4R_j6vHPa9uGE3HoGJt17VqSgwFQ4_qMMHRlNC8xlioJrjEj5TNqzIuum9JtHgCe6AhrGjgcB9tmpJaPyrRyeL6DQqwGeZKzZymw7fZyvaonnd4McYXxh8a7RVUgNS04zgdVrBHOKhtn6UkxtdShBcKk79Hx1t0Kq-yPpZRy54',
      },
      facility: {
        name: 'Happy Pet Hà Đông',
        address: '45 Trần Phú, Hà Đông',
      },
      paymentStatus: 'Chưa thanh toán',
      bookingStatus: 'Chờ xác nhận',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0981',
      customer: {
        name: 'Nguyễn Văn Phúc',
        phone: '0911 222 333',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBBuGoh3HXsup468dvvXwKvUG9Sb85PdwEzVhkobRtob_x94AIK-y3BHNhAMnXqZODvvGiwKjQONkSSfDC4KbeE8Z-iGjWHK4ENpaWyyjV70P32oGevEI5qDEAYWkcIeWxsptXfjT4rsAsOAolZPBi3BZHDF6-C_SBn_MtkTvJ5tqnbSufPXAZd2erNO1cmRxAtiWjS2L-3TXHrVjcFjlhLz-4tSimehQmqNv2HwlM',
      },
      facility: {
        name: 'Happy Pet Cầu Giấy',
        address: '123 Nguyễn Khang, Cầu Giấy',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Hoàn thành',
      type: 'BOARDING',
    },
    {
      id: 'BIZ250522-0980',
      customer: {
        name: 'Mai Anh Thư',
        phone: '0901 234 567',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBIWg6m458h2AJfZLERwvB3c-vdMLQJsUaqVi5KukmzJFNlhnNmSMqSmjUdXxVoxjluOreQwR6n-5LoYNoDLetDcikkzPAjS7ODMBO6V4aM8Nlg7RPP41RTFR2Wok5URxvTr3rrRQjQtHtEEHOcJ9mrxVAugoNSzx98o5biViSqcFs9fB9GASMHTifvUNdZllgt8S-kUB18gCu0LDYdtkB8YtVgvZh_4qhA8v9Fo14',
      },
      facility: {
        name: 'Happy Pet Hà Đông',
        address: '45 Trần Phú, Hà Đông',
      },
      paymentStatus: 'Hoàn tiền',
      bookingStatus: 'Đã hủy',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0979',
      customer: {
        name: 'Hoàng Đức Long',
        phone: '0912 456 789',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBmZl4zGI06-hqKy12AHn8AaEZfJnRAi3FG_U0JQrPgmdPCi1mC19A2Gf1dInCG0UOPGSnMZQQmNkdgvbYjONkVadb65HZUxo2q_3ZxzBoIDzBtgqjfjhom92x9pmdCI0d-payIdnPrmQSEiiBJ0fgIrVipHpBelyGKMj98WPvOSOHAH3zxzeM4E69AXQhrWNhjoZsq3q6kdsNDxNac4NPEXt7GGE1N9NhiiaE5MtI',
      },
      facility: {
        name: 'Happy Pet Cầu Giấy',
        address: '123 Nguyễn Khang, Cầu Giấy',
      },
      paymentStatus: 'Đã thanh toán',
      bookingStatus: 'Hoàn thành',
      type: 'APPOINTMENT',
    },
    {
      id: 'BIZ250522-0978',
      customer: {
        name: 'Ngọc Bảo Trân',
        phone: '0913 678 901',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB_VK5AQF2wCzHI2Dd9AUFhhhFxs9Vkv1QdWQWb4RwVLZtCYPk9Pwii3nLMhwVZCS11tWlxPt9DyMmulnfi5PGJ5GAUb5ICHnXepIgAYrerwjHPA1MSUqmnqk2Iedc8OwaZX-5YXjAZmPed6AaIPmk0EfQ84TE-kAYOwTLifsvS85n-Sta1GnCBHtW5mMSmyItd-OOOWXDHWIkRFr1ISGHIQD1pPv_ri6KhxBBfTow',
      },
      facility: {
        name: 'Happy Pet Hà Đông',
        address: '45 Trần Phú, Hà Đông',
      },
      paymentStatus: 'Chưa thanh toán',
      bookingStatus: 'Chờ xác nhận',
      type: 'BOARDING',
    },
  ]);

  // ==============================
  // FILTER LOGIC
  // ==============================
  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      if (
        statusFilter !== 'Tất cả trạng thái' &&
        item.bookingStatus !== statusFilter
      ) {
        return false;
      }

      if (
        bookingTypeFilter !== 'Tất cả loại booking' &&
        item.type !== bookingTypeFilter
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();

        const matchId = item.id.toLowerCase().includes(query);
        const matchName = item.customer.name.toLowerCase().includes(query);
        const matchPhone = item.customer.phone.toLowerCase().includes(query);

        return matchId || matchName || matchPhone;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, bookingTypeFilter]);

  // ==============================
  // RESET FILTER
  // ==============================
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Tất cả trạng thái');
    setBookingTypeFilter('Tất cả loại booking');
  };

  return (
    <div className="p-8 space-y-6 flex-1">
      <BookingMetrics metrics={metrics} />

      <BookingFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        bookingTypeFilter={bookingTypeFilter}
        setBookingTypeFilter={setBookingTypeFilter}
        onReset={handleResetFilters}
      />

      <BookingTable bookings={filteredBookings} />
    </div>
  );
}