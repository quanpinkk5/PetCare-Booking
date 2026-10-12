import {
    QrCode,
    Wallet,
    Landmark,
    Banknote,
    CheckCircle2,
    Clock,
    RotateCcw,
    XCircle,
} from "lucide-react";

export const PAYMENT_METHODS = {
    vnpay: {
        id: "vnpay",
        name: "VNPAY-QR",
        icon: QrCode,
        color: "text-blue-600",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    },
    momo: {
        id: "momo",
        name: "Ví MoMo",
        icon: Wallet,
        color: "text-pink-600",
        badgeBg: "bg-pink-50 text-pink-700 border-pink-200",
    },
    bank_transfer: {
        id: "bank_transfer",
        name: "Chuyển khoản Napas247",
        icon: Landmark,
        color: "text-emerald-600",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    cash: {
        id: "cash",
        name: "Tiền mặt tại cơ sở",
        icon: Banknote,
        color: "text-amber-600",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    },
};

export const PAYMENT_STATUSES = {
    completed: {
        id: "completed",
        label: "Thành công",
        icon: CheckCircle2,
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
        dotColor: "bg-emerald-500",
        stampClass: "border-emerald-600 text-emerald-600 bg-emerald-50/50",
    },
    pending: {
        id: "pending",
        label: "Chờ thanh toán",
        icon: Clock,
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
        dotColor: "bg-amber-500",
        stampClass: "border-amber-600 text-amber-600 bg-amber-50/50",
    },
    refunded: {
        id: "refunded",
        label: "Đã hoàn tiền",
        icon: RotateCcw,
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20",
        dotColor: "bg-purple-500",
        stampClass: "border-purple-600 text-purple-600 bg-purple-50/50",
    },
    failed: {
        id: "failed",
        label: "Đã hủy / Thất bại",
        icon: XCircle,
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
        dotColor: "bg-rose-500",
        stampClass: "border-rose-600 text-rose-600 bg-rose-50/50",
    },
};

export const PAYMENT_TRANSACTIONS = [
    {
        id: "TXN-20260825-001",
        invoiceNo: "INV-2026-082501",
        bookingId: "BK20260825001",
        createdAt: "25/08/2026 14:15",
        rawDate: "2026-08-25T14:15:00",
        serviceName: "Grooming & Cắt tỉa tạo kiểu",
        serviceDesc: "Cắt tỉa lông toàn thân, vệ sinh tai, cắt mài móng, xịt dưỡng lông hương lavender",
        facilityName: "Happy Pet - Chi nhánh Cầu Giấy",
        facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
        facilityPhone: "0988 123 456",
        petName: "Milo",
        petBreed: "Golden Retriever (2 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "vnpay",
        methodLabel: "VNPAY-QR",
        gatewayRef: "VNP20260825983712",
        status: "pending",
        statusLabel: "Chờ thanh toán",
        basePrice: 300000,
        platformFee: 15000,
        discount: 30000,
        discountCode: "PETCARE10",
        totalAmount: 285000,
        note: "Đặt cọc dịch vụ chăm sóc thú cưng",
        paidAt: null,
    },
    {
        id: "TXN-20260824-002",
        invoiceNo: "INV-2026-082402",
        bookingId: "BK20260824002",
        createdAt: "24/08/2026 09:45",
        rawDate: "2026-08-24T09:45:00",
        serviceName: "Tắm Spa thảo dược & sấy dưỡng",
        serviceDesc: "Ngâm bồn sục thảo dược, massage thư giãn, sấy phồng và dưỡng lông chuyên sâu",
        facilityName: "PetSpa Deluxe - Đống Đa",
        facilityAddress: "45 Thái Hà, Đống Đa, Hà Nội",
        facilityPhone: "0988 654 321",
        petName: "Mimi",
        petBreed: "British Shorthair (1 tuổi)",
        petGender: "♀",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "momo",
        methodLabel: "Ví MoMo",
        gatewayRef: "MM20260824773821",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 250000,
        platformFee: 15000,
        discount: 15000,
        discountCode: "FREESHIP",
        totalAmount: 250000,
        note: "Thanh toán thành công qua Ví MoMo",
        paidAt: "24/08/2026 09:46",
    },
    {
        id: "TXN-20260822-003",
        invoiceNo: "INV-2026-082203",
        bookingId: "BK20260822003",
        createdAt: "22/08/2026 10:10",
        rawDate: "2026-08-22T10:10:00",
        serviceName: "Khách sạn lưu trú thú cưng (2 ngày)",
        serviceDesc: "Phòng VIP điều hòa riêng biệt, giám sát camera 24/7, thực đơn hạt cao cấp & pate tươi",
        facilityName: "PetCare Hotel - Ba Đình",
        facilityAddress: "88 Kim Mã, Ba Đình, Hà Nội",
        facilityPhone: "0988 222 333",
        petName: "Milo",
        petBreed: "Golden Retriever (2 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "bank_transfer",
        methodLabel: "Chuyển khoản Napas247",
        gatewayRef: "NAPAS8923019842",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 600000,
        platformFee: 15000,
        discount: 50000,
        discountCode: "GIAM50K",
        totalAmount: 565000,
        note: "Thanh toán phòng VIP 2 ngày lưu trú",
        paidAt: "22/08/2026 10:12",
    },
    {
        id: "TXN-20260820-004",
        invoiceNo: "INV-2026-082004",
        bookingId: "BK20260820004",
        createdAt: "20/08/2026 15:20",
        rawDate: "2026-08-20T15:20:00",
        serviceName: "Combo Tắm dưỡng & Cắt tỉa style gấu",
        serviceDesc: "Tạo hình phong cách Teddy Bear, vệ sinh tai móng, xịt nước hoa cao cấp cho thú cưng",
        facilityName: "Puppy Spa - Tây Hồ",
        facilityAddress: "12 Xuân Diệu, Tây Hồ, Hà Nội",
        facilityPhone: "0988 444 555",
        petName: "Bông",
        petBreed: "Poodle Tiny (8 tháng)",
        petGender: "♀",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "vnpay",
        methodLabel: "VNPAY-QR",
        gatewayRef: "VNP20260820129384",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 280000,
        platformFee: 15000,
        discount: 0,
        discountCode: null,
        totalAmount: 295000,
        note: "Thanh toán gói dịch vụ combo tắm & cắt tỉa",
        paidAt: "20/08/2026 15:21",
    },
    {
        id: "TXN-20260818-005",
        invoiceNo: "INV-2026-081805",
        bookingId: "BK20260818005",
        createdAt: "18/08/2026 16:35",
        rawDate: "2026-08-18T16:35:00",
        serviceName: "Tiêm phòng vaccine & Khám tổng quát",
        serviceDesc: "Gói vaccine 7 bệnh, tẩy giun định kỳ, kiểm tra tai mắt tim phổi bởi bác sĩ thú y",
        facilityName: "Bệnh viện Thú Y PetCare",
        facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
        facilityPhone: "0988 123 456",
        petName: "LuLu",
        petBreed: "Corgi Pembroke (1.5 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "cash",
        methodLabel: "Tiền mặt tại cơ sở",
        gatewayRef: "POS20260818009",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 450000,
        platformFee: 0,
        discount: 0,
        discountCode: null,
        totalAmount: 450000,
        note: "Thanh toán tiền mặt tại quầy thu ngân cơ sở",
        paidAt: "18/08/2026 17:30",
    },
    {
        id: "TXN-20260817-006",
        invoiceNo: "INV-2026-081706",
        bookingId: "BK20260817006",
        createdAt: "17/08/2026 10:35",
        rawDate: "2026-08-17T10:35:00",
        serviceName: "Spa thư giãn & Vệ sinh tai móng",
        serviceDesc: "Đang được chuyên viên chăm sóc và sấy lông tại phòng chăm sóc chuyên biệt tầng 2",
        facilityName: "Happy Pet - Cầu Giấy",
        facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
        facilityPhone: "0988 123 456",
        petName: "Mimi",
        petBreed: "British Shorthair (1 tuổi)",
        petGender: "♀",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "vnpay",
        methodLabel: "VNPAY-QR",
        gatewayRef: "VNP20260817882910",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 220000,
        platformFee: 15000,
        discount: 0,
        discountCode: null,
        totalAmount: 235000,
        note: "Thanh toán trước dịch vụ chăm sóc",
        paidAt: "17/08/2026 10:36",
    },
    {
        id: "TXN-20260810-007",
        invoiceNo: "INV-2026-081007",
        bookingId: "BK20260810007",
        createdAt: "10/08/2026 08:35",
        rawDate: "2026-08-10T08:35:00",
        serviceName: "Combo Tắm trị liệu & Cắt lông bàn",
        serviceDesc: "Dầu tắm thảo dược trị ve rận, khử mùi hôi cơ thể, tỉa gọn lông bàn chân và mông",
        facilityName: "Happy Pet - Cầu Giấy",
        facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
        facilityPhone: "0988 123 456",
        petName: "Milo",
        petBreed: "Golden Retriever (2 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "momo",
        methodLabel: "Ví MoMo",
        gatewayRef: "MM20260810991823",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 350000,
        platformFee: 15000,
        discount: 30000,
        discountCode: "PETCARE10",
        totalAmount: 335000,
        note: "Thanh toán gói tắm trị liệu ve rận",
        paidAt: "10/08/2026 08:36",
    },
    {
        id: "TXN-20260805-008",
        invoiceNo: "INV-2026-080508",
        bookingId: "BK20260805008",
        createdAt: "05/08/2026 14:05",
        rawDate: "2026-08-05T14:05:00",
        serviceName: "Chăm sóc móng & Vệ sinh tai mắt",
        serviceDesc: "Làm sạch tuyến lệ, nhỏ dưỡng mắt, cạo lông đệm chân và nhỏ giọt khử rận tai",
        facilityName: "PetSpa Deluxe - Đống Đa",
        facilityAddress: "45 Thái Hà, Đống Đa, Hà Nội",
        facilityPhone: "0988 654 321",
        petName: "Mimi",
        petBreed: "British Shorthair (1 tuổi)",
        petGender: "♀",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "bank_transfer",
        methodLabel: "Chuyển khoản Napas247",
        gatewayRef: "NAPAS7782910384",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 150000,
        platformFee: 15000,
        discount: 0,
        discountCode: null,
        totalAmount: 165000,
        note: "Chuyển khoản thanh toán nhanh",
        paidAt: "05/08/2026 14:06",
    },
    {
        id: "TXN-20260728-009",
        invoiceNo: "INV-2026-072809",
        bookingId: "BK20260728009",
        createdAt: "28/07/2026 11:15",
        rawDate: "2026-07-28T11:15:00",
        serviceName: "Grooming cắt tỉa tạo hình mông tim",
        serviceDesc: "Cắt tỉa tạo hình mông trái tim đặc trưng Corgi, tỉa viền tai và sấy đánh phồng lông",
        facilityName: "Puppy Spa - Tây Hồ",
        facilityAddress: "12 Xuân Diệu, Tây Hồ, Hà Nội",
        facilityPhone: "0988 444 555",
        petName: "LuLu",
        petBreed: "Corgi Pembroke (1.5 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "vnpay",
        methodLabel: "VNPAY-QR",
        gatewayRef: "VNP20260728102938",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 320000,
        platformFee: 15000,
        discount: 60000,
        discountCode: "PETCARE20",
        totalAmount: 275000,
        note: "Áp dụng voucher VIP 20%",
        paidAt: "28/07/2026 11:16",
    },
    {
        id: "TXN-20260720-010",
        invoiceNo: "INV-2026-072010",
        bookingId: "BK20260720010",
        createdAt: "20/07/2026 10:05",
        rawDate: "2026-07-20T10:05:00",
        serviceName: "Khách sạn thú cưng lưu trú 3 ngày",
        serviceDesc: "Dịch vụ phòng đơn cao cấp, dạo chơi sân cỏ 2 lần/ngày, ăn uống theo chế độ riêng",
        facilityName: "PetCare Hotel - Ba Đình",
        facilityAddress: "88 Kim Mã, Ba Đình, Hà Nội",
        facilityPhone: "0988 222 333",
        petName: "Milo",
        petBreed: "Golden Retriever (2 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "bank_transfer",
        methodLabel: "Chuyển khoản Napas247",
        gatewayRef: "NAPAS9901827461",
        status: "completed",
        statusLabel: "Thành công",
        basePrice: 900000,
        platformFee: 15000,
        discount: 50000,
        discountCode: "GIAM50K",
        totalAmount: 865000,
        note: "Thanh toán đặt phòng khách sạn lưu trú 3 ngày",
        paidAt: "20/07/2026 10:07",
    },
    {
        id: "TXN-20260625-013",
        invoiceNo: "INV-2026-062513",
        bookingId: "BK20260625013",
        createdAt: "25/06/2026 13:50",
        rawDate: "2026-06-25T13:50:00",
        serviceName: "Tắm Spa thảo dược & cắt móng",
        serviceDesc: "Khách hàng bận việc đột xuất nên đã yêu cầu hủy lịch hẹn",
        facilityName: "PetSpa Deluxe - Đống Đa",
        facilityAddress: "45 Thái Hà, Đống Đa, Hà Nội",
        facilityPhone: "0988 654 321",
        petName: "Mimi",
        petBreed: "British Shorthair (1 tuổi)",
        petGender: "♀",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "momo",
        methodLabel: "Ví MoMo",
        gatewayRef: "MM20260625881920",
        status: "refunded",
        statusLabel: "Đã hoàn tiền",
        basePrice: 250000,
        platformFee: 15000,
        discount: 0,
        discountCode: null,
        totalAmount: 265000,
        refundedAmount: 265000,
        refundReason: "Khách hàng hủy trước 24 giờ - Hoàn trả 100% về ví MoMo",
        refundDate: "25/06/2026 14:10",
        note: "Hoàn tiền tự động theo chính sách PetCare",
        paidAt: "25/06/2026 13:51",
    },
    {
        id: "TXN-20260610-014",
        invoiceNo: "INV-2026-061014",
        bookingId: "BK20260610014",
        createdAt: "10/06/2026 16:00",
        rawDate: "2026-06-10T16:00:00",
        serviceName: "Khám chuyên khoa da liễu cho thú cưng",
        serviceDesc: "Xét nghiệm nấm, soi mẫu da và tư vấn phác đồ điều trị viêm da dị ứng",
        facilityName: "Bệnh viện Thú Y PetCare",
        facilityAddress: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
        facilityPhone: "0988 123 456",
        petName: "Milo",
        petBreed: "Golden Retriever (2 tuổi)",
        petGender: "♂",
        customerName: "Nguyễn Văn An",
        customerPhone: "0912 345 678",
        customerEmail: "nguyenvanan@gmail.com",
        customerAddress: "Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        method: "vnpay",
        methodLabel: "VNPAY-QR",
        gatewayRef: "VNP20260610992837",
        status: "failed",
        statusLabel: "Thất bại",
        basePrice: 350000,
        platformFee: 15000,
        discount: 0,
        discountCode: null,
        totalAmount: 365000,
        note: "Giao dịch hết thời gian chờ thanh toán (Timeout)",
        paidAt: null,
    },
];

export function formatCurrency(amount) {
    if (amount === undefined || amount === null) return "0đ";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export function numberToWordsVietnamese(number) {
    // Helper chuyển số tiền thành chữ tiếng Việt cho hóa đơn
    const units = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
    const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    if (number === 0) return "Không đồng";

    function readThree(b, isFirst) {
        let str = "";
        const h = Math.floor(b / 100);
        const t = Math.floor((b % 100) / 10);
        const u = b % 10;

        if (h > 0 || !isFirst) {
            str += digits[h] + " trăm ";
        }

        if (t > 1) {
            str += digits[t] + " mươi ";
            if (u === 1) str += "mốt ";
            else if (u === 5) str += "lăm ";
            else if (u > 0) str += digits[u] + " ";
        } else if (t === 1) {
            str += "mười ";
            if (u === 5) str += "lăm ";
            else if (u > 0) str += digits[u] + " ";
        } else if (t === 0 && u > 0) {
            if (h > 0 || !isFirst) str += "lẻ ";
            str += digits[u] + " ";
        }

        return str;
    }

    let n = Math.abs(number);
    let result = "";
    let unitIdx = 0;

    while (n > 0) {
        const three = n % 1000;
        n = Math.floor(n / 1000);
        if (three > 0) {
            const part = readThree(three, n === 0);
            result = part + units[unitIdx] + " " + result;
        }
        unitIdx++;
    }

    result = result.trim();
    if (!result) return "Không đồng";
    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1) + " đồng chẵn";
}

export function getPaymentSummary(transactions = PAYMENT_TRANSACTIONS) {
    const totalTransactions = transactions.length;

    // Total successful spend
    const completedList = transactions.filter((t) => t.status === "completed");
    const totalSpent = completedList.reduce((sum, t) => sum + t.totalAmount, 0);

    const pendingList = transactions.filter((t) => t.status === "pending");
    const totalPending = pendingList.reduce((sum, t) => sum + t.totalAmount, 0);

    const refundedList = transactions.filter((t) => t.status === "refunded");
    const totalRefunded = refundedList.reduce((sum, t) => sum + (t.refundedAmount || t.totalAmount), 0);

    const failedCount = transactions.filter((t) => t.status === "failed").length;

    return {
        totalTransactions,
        completedCount: completedList.length,
        totalSpent,
        pendingCount: pendingList.length,
        totalPending,
        refundedCount: refundedList.length,
        totalRefunded,
        failedCount,
    };
}
