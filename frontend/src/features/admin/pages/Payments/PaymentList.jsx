
import { useMemo, useState } from 'react';
import PaymentFilter from '../../components/payment/PaymentFilter';
import PaymentTable from '../../components/payment/PaymentTable';
import PaymentDetailPanel from '../../components/payment/PaymentDetailPanel';

const initialPayments = [
  {
    id: 'PAY250522-0001',
    bookingCode: 'BK250522-0897',
    customer: {
      name: 'Nguyễn Minh Anh',
      phone: '0901 234 567',
      avatarText: 'NA',
      avatarColor: 'bg-emerald-100 text-emerald-700',
    },
    facility: 'Happy Paws Spa',
    amount: '450.000 đ',
    method: 'MoMo',
    methodBadgeBg: 'bg-pink-50 text-pink-600',
    methodDotColor: 'bg-pink-500',
    status: 'ĐÃ THANH TOÁN',
    statusBadgeBg: 'bg-emerald-100 text-emerald-700',
    date: '22/05/2025',
    time: '14:30',
    transactionNo: '50864678123',
    provider: 'MoMo',
    fee: '0 đ',
    note: '-',
  },
  {
    id: 'PAY250522-0002',
    bookingCode: 'BK250522-0896',
    customer: {
      name: 'Trần Quốc Bảo',
      phone: '0912 345 678',
      avatarText: 'TB',
      avatarColor: 'bg-blue-100 text-blue-700',
    },
    facility: 'Pet Heaven Clinic',
    amount: '850.000 đ',
    method: 'VNPAY',
    methodBadgeBg: 'bg-blue-50 text-blue-600',
    methodDotColor: 'bg-blue-500',
    status: 'ĐANG XỬ LÝ',
    statusBadgeBg: 'bg-amber-100 text-amber-700',
    date: '22/05/2025',
    time: '14:18',
    transactionNo: 'VNP98213412',
    provider: 'VNPAY',
    fee: '0 đ',
    note: 'Đang đợi cổng phản hồi',
  },
  {
    id: 'PAY250522-0003',
    bookingCode: 'BK250522-0895',
    customer: {
      name: 'Lê Phương Linh',
      phone: '0987 654 321',
      avatarText: 'PL',
      avatarColor: 'bg-purple-100 text-purple-700',
    },
    facility: 'Poodle House',
    amount: '1.200.000 đ',
    method: 'Chuyển khoản',
    methodBadgeBg: 'bg-slate-100 text-slate-700',
    methodDotColor: null,
    status: 'ĐÃ THANH TOÁN',
    statusBadgeBg: 'bg-emerald-100 text-emerald-700',
    date: '22/05/2025',
    time: '13:55',
    transactionNo: 'FT250522881',
    provider: 'Vietcombank',
    fee: '0 đ',
    note: '-',
  },
  {
    id: 'PAY250522-0004',
    bookingCode: 'BK250522-0894',
    customer: {
      name: 'Phạm Thu Hà',
      phone: '0938 111 222',
      avatarText: 'TH',
      avatarColor: 'bg-amber-100 text-amber-700',
    },
    facility: 'Meow Care Center',
    amount: '320.000 đ',
    method: 'CASH',
    methodBadgeBg: 'bg-emerald-50 text-emerald-600 font-bold',
    methodDotColor: null,
    status: 'ĐÃ THANH TOÁN',
    statusBadgeBg: 'bg-emerald-100 text-emerald-700',
    date: '22/05/2025',
    time: '13:20',
    transactionNo: 'CASH-250522-04',
    provider: 'Thanh toán trực tiếp',
    fee: '0 đ',
    note: 'Thanh toán tại quầy',
  },
  {
    id: 'PAY250522-0005',
    bookingCode: 'BK250522-0893',
    customer: {
      name: 'Hoàng Văn Nam',
      phone: '0909 333 444',
      avatarText: 'VN',
      avatarColor: 'bg-rose-100 text-rose-700',
    },
    facility: 'Bunny Pet Shop',
    amount: '600.000 đ',
    method: 'MoMo',
    methodBadgeBg: 'bg-pink-50 text-pink-600',
    methodDotColor: 'bg-pink-500',
    status: 'THẤT BẠI',
    statusBadgeBg: 'bg-rose-100 text-rose-700',
    date: '22/05/2025',
    time: '13:20',
    transactionNo: 'MM-FAIL-90812',
    provider: 'MoMo',
    fee: '0 đ',
    note: 'Không đủ số dư ví',
  },
  {
    id: 'PAY250522-0006',
    bookingCode: 'BK250522-0892',
    customer: {
      name: 'Nguyễn Thu Trang',
      phone: '0918 555 666',
      avatarText: 'TT',
      avatarColor: 'bg-teal-100 text-teal-700',
    },
    facility: 'Happy Paws Spa',
    amount: '1.500.000 đ',
    method: 'VNPAY',
    methodBadgeBg: 'bg-blue-50 text-blue-600',
    methodDotColor: 'bg-blue-500',
    status: 'ĐÃ HOÀN TIỀN',
    statusBadgeBg: 'bg-sky-100 text-sky-700',
    date: '22/05/2025',
    time: '11:45',
    transactionNo: 'REFUND-99128',
    provider: 'VNPAY',
    fee: '0 đ',
    note: 'Khách hủy lịch hẹn trước 24h',
  },
  {
    id: 'PAY250522-0007',
    bookingCode: 'BK250522-0891',
    customer: {
      name: 'Đỗ Hoàng Long',
      phone: '0977 888 999',
      avatarText: 'HL',
      avatarColor: 'bg-indigo-100 text-indigo-700',
    },
    facility: 'Pet Heaven Clinic',
    amount: '780.000 đ',
    method: 'Chuyển khoản',
    methodBadgeBg: 'bg-slate-100 text-slate-700',
    methodDotColor: null,
    status: 'ĐANG XỬ LÝ',
    statusBadgeBg: 'bg-amber-100 text-amber-700',
    date: '22/05/2025',
    time: '10:35',
    transactionNo: 'FT250522101',
    provider: 'Techcombank',
    fee: '0 đ',
    note: 'Chờ kế toán đối soát',
  },
  {
    id: 'PAY250522-0008',
    bookingCode: 'BK250522-0890',
    customer: {
      name: 'Vũ Thị Mai',
      phone: '0901 112 233',
      avatarText: 'VM',
      avatarColor: 'bg-violet-100 text-violet-700',
    },
    facility: 'Poodle House',
    amount: '950.000 đ',
    method: 'MoMo',
    methodBadgeBg: 'bg-pink-50 text-pink-600',
    methodDotColor: 'bg-pink-500',
    status: 'ĐÃ THANH TOÁN',
    statusBadgeBg: 'bg-emerald-100 text-emerald-700',
    date: '22/05/2025',
    time: '09:25',
    transactionNo: '50864699120',
    provider: 'MoMo',
    fee: '0 đ',
    note: '-',
  },
  {
    id: 'PAY250521-0009',
    bookingCode: 'BK250521-0889',
    customer: {
      name: 'Ngô Quang Huy',
      phone: '0944 556 677',
      avatarText: 'QH',
      avatarColor: 'bg-cyan-100 text-cyan-700',
    },
    facility: 'Meow Care Center',
    amount: '410.000 đ',
    method: 'CASH',
    methodBadgeBg: 'bg-emerald-50 text-emerald-600 font-bold',
    methodDotColor: null,
    status: 'ĐÃ THANH TOÁN',
    statusBadgeBg: 'bg-emerald-100 text-emerald-700',
    date: '21/05/2025',
    time: '17:40',
    transactionNo: 'CASH-250521-09',
    provider: 'Thanh toán trực tiếp',
    fee: '0 đ',
    note: 'Thanh toán tại quầy',
  },
  {
    id: 'PAY250521-0010',
    bookingCode: 'BK250521-0888',
    customer: {
      name: 'Phan Minh Châu',
      phone: '0966 778 899',
      avatarText: 'MC',
      avatarColor: 'bg-fuchsia-100 text-fuchsia-700',
    },
    facility: 'Bunny Pet Shop',
    amount: '600.000 đ',
    method: 'VNPAY',
    methodBadgeBg: 'bg-blue-50 text-blue-600',
    methodDotColor: 'bg-blue-500',
    status: 'THẤT BẠI',
    statusBadgeBg: 'bg-rose-100 text-rose-700',
    date: '21/05/2025',
    time: '16:20',
    transactionNo: 'VNP-FAIL-1092',
    provider: 'VNPAY',
    fee: '0 đ',
    note: 'Hết thời gian thanh toán (Timeout)',
  },
];

export default function PaymentList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [methodFilter, setMethodFilter] = useState('Tất cả');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredPayments = useMemo(() => {
    return initialPayments.filter((item) => {
      if (
        statusFilter !== 'Tất cả' &&
        item.status !== statusFilter
      ) {
        return false;
      }

      if (methodFilter !== 'Tất cả') {
        const selectedMethod =
          methodFilter === 'Tiền mặt (CASH)'
            ? 'CASH'
            : methodFilter;

        if (item.method !== selectedMethod) {
          return false;
        }
      }

      const query = searchQuery.trim().toLowerCase();

      if (query) {
        const searchableValues = [
          item.id,
          item.bookingCode,
          item.customer.name,
          item.customer.phone,
          item.facility,
        ];

        const matched = searchableValues.some((value) =>
          value.toLowerCase().includes(query)
        );

        if (!matched) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, methodFilter]);

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Tất cả');
    setMethodFilter('Tất cả');
  };

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      <PaymentFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        onReset={handleResetFilters}
      />

      <div className="w-full">
        <PaymentTable
          payments={filteredPayments}
          totalPayments={5892}
          selectedRowId={isDetailOpen ? selectedPayment?.id : null}
          onSelectPayment={handleSelectPayment}
        />
      </div>

      <PaymentDetailPanel
        payment={selectedPayment}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </main>
  );
}
