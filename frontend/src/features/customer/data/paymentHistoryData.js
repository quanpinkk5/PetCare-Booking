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

export function getPaymentSummary(transactions = []) {
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
