import {
    ShieldCheck,
    CheckCircle2,
    Headphones,
    PhoneCall,
    Sparkles,
    HeartHandshake,
    AlertCircle,
    BadgeCheck,
} from "lucide-react";

export default function PaymentSidebar({ onOpenSupport }) {
    return (
        <div className="space-y-4">
            {/* 1. Security & Policy Guarantees Card */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <ShieldCheck size={16} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">
                        Cam kết an toàn từ PetCare
                    </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span>
                            <strong className="text-slate-800 font-semibold">Hoàn tiền 100%</strong> nếu hủy lịch hẹn trước 24 giờ.
                        </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span>
                            <strong className="text-slate-800 font-semibold">Bảo hiểm sức khỏe</strong> cho thú cưng trong suốt quá trình chăm sóc.
                        </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span>
                            <strong className="text-slate-800 font-semibold">Mã hóa 256-bit SSL</strong> bảo mật tuyệt đối thông tin thẻ & tài khoản.
                        </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span>
                            <strong className="text-slate-800 font-semibold">Hóa đơn điện tử VAT</strong> tự động xuất sau khi giao dịch thành công.
                        </span>
                    </li>
                </ul>
            </section>

            {/* 2. Customer Care & Urgent Support */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Headphones size={20} />
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Cần hỗ trợ thanh toán?</h3>
                        <p className="text-[11px] text-slate-400">
                            Tổng đài chăm sóc khách hàng 24/7
                        </p>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Hotline miễn cước:</span>
                    <strong className="text-emerald-700 font-extrabold font-mono text-sm">
                        1900 6868
                    </strong>
                </div>

                <button
                    type="button"
                    onClick={onOpenSupport}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 py-2.5 px-4 text-xs font-bold text-emerald-800 transition cursor-pointer shadow-2xs"
                >
                    <PhoneCall size={14} />
                    <span>Yêu cầu nhân viên gọi lại</span>
                </button>
            </section>
        </div>
    );
}