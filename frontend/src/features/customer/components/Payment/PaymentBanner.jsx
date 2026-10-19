import { ShieldCheck, PawPrint, Sparkles, CheckCircle2 } from "lucide-react";

export default function PaymentBanner() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-6 py-8 text-white md:px-10 shadow-lg shadow-emerald-900/10">
            {/* Background glowing orbs */}
            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 -top-10 h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl" />

            <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20 text-emerald-50">
                    <ShieldCheck size={15} className="text-emerald-200" />
                    <span>Cổng thanh toán bảo mật SSL 256-bit tiêu chuẩn quốc tế</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    Xác nhận & <span className="text-emerald-200">Thanh toán</span> dịch vụ
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-emerald-50/90 max-w-2xl">
                    Chỉ còn một bước nữa để hoàn tất lịch hẹn chăm sóc cho thú cưng của bạn. PetCare cam kết an toàn tuyệt đối và bảo chứng quyền lợi khách hàng 100%.
                </p>

                {/* Trust guarantee badges */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1 font-medium backdrop-blur-sm border border-white/10">
                        <CheckCircle2 size={13} className="text-emerald-300" />
                        <span>Hoàn tiền 100% trước 24h</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1 font-medium backdrop-blur-sm border border-white/10">
                        <Sparkles size={13} className="text-emerald-300" />
                        <span>Bảo hiểm an toàn thú cưng</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1 font-medium backdrop-blur-sm border border-white/10">
                        <PawPrint size={13} className="text-emerald-300" />
                        <span>Đội ngũ chuyên viên chứng chỉ</span>
                    </span>
                </div>
            </div>

            {/* Decorative Paw Print Icon */}
            <PawPrint className="absolute -bottom-6 right-6 w-40 h-40 text-white/10 md:right-12 md:w-52 md:h-52 pointer-events-none select-none -rotate-12" />
        </section>
    );
}