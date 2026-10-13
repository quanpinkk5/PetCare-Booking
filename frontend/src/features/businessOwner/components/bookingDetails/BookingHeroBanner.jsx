
import { PawPrint } from "lucide-react";

export default function BookingHeroBanner() {
    return (
        <section className="relative bg-gradient-to-r from-[#EBF9F3] via-[#EFFBF6] to-[#E5F7EE] rounded-2xl p-6 md:p-8 mb-6 overflow-hidden border border-emerald-100/60 shadow-sm">
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                <PawPrint className="absolute -left-6 -top-6 w-32 h-32 text-emerald-300" />
                <PawPrint className="absolute left-1/3 top-2 w-20 h-20 text-emerald-300" />
                <PawPrint className="absolute right-96 bottom-1 w-28 h-28 text-emerald-300" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                        <a href="/business-owner" className="hover:text-emerald-600">Trang chủ</a>
                        <span>/</span>
                        <a href="/business-owner/bookings" className="hover:text-emerald-600">
                            Lịch đặt của tôi
                        </a>
                        <span>/</span>
                        <span className="text-slate-700">Chi tiết lịch đặt</span>
                    </nav>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                        Chi tiết <span className="text-emerald-600">lịch đặt</span>
                    </h1>

                    <p className="text-slate-600 text-sm mt-1 max-w-xl">
                        Theo dõi thông tin đặt lịch, tiến trình dịch vụ, trạng thái thanh toán
                        và nhật ký chăm sóc của thú cưng.
                    </p>
                </div>

                <div className="relative shrink-0 flex items-center justify-center">
                    <div className="relative w-56 h-32 md:w-64 md:h-36 rounded-xl overflow-hidden shadow-sm">
                        <img
                            alt="Pet Spa Wellness"
                            src="GIỮ_NGUYÊN_URL_ẢNH_BANNER"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-emerald-500 animate-pulse">✨</span>
                    <span className="absolute bottom-2 -left-3 text-emerald-400">✨</span>
                </div>
            </div>
        </section>
    );
}
