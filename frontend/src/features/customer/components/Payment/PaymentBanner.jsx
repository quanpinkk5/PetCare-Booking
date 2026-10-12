
import { ShieldCheck, PawPrint } from "lucide-react";

export default function PaymentBanner() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-8 text-white md:px-10">
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-xs">
                    <ShieldCheck size={16} />
                    Thanh toán an toàn
                </span>

                <h1 className="mt-5 text-3xl font-bold md:text-4xl tracking-tight">
                    Hoàn tất thanh toán
                </h1>

                <p className="mt-3 leading-7 text-emerald-50">
                    Chỉ còn một bước nữa để hoàn tất lịch hẹn chăm sóc thú cưng của bạn.
                </p>
            </div>

            <div className="pointer-events-none absolute -right-8 -top-12 h-56 w-56 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-white/10" />

            <PawPrint className="absolute -bottom-4 right-8 w-36 h-36 text-white/15 md:right-16 md:w-44 md:h-44 pointer-events-none" />
        </section>
    );
}