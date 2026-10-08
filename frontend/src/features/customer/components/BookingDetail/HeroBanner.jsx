import React from "react";
import { PawPrint } from "lucide-react";

const HeroBanner = () => {
    return (
        <section className="relative bg-gradient-to-r from-[#EBF9F3] via-[#EFFBF6] to-[#E5F7EE] rounded-2xl p-6 md:p-8 mb-6 overflow-hidden border border-emerald-100/60 shadow-sm">
            {/* Background decoration */}
            <div className="absolute -left-6 -top-6 text-emerald-200/40 select-none pointer-events-none">
                <PawPrint size={140} />
            </div>

            <div className="absolute right-96 bottom-1 text-emerald-200/40 select-none pointer-events-none">
                <PawPrint size={100} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Title */}
                <div>
                    <nav className="flex items-center gap-2 text-[12px] text-slate-500 mb-2 font-medium">
                        <a
                            href="#"
                            className="hover:text-emerald-600 transition"
                        >
                            Trang chủ
                        </a>

                        <span>/</span>

                        <a
                            href="#"
                            className="hover:text-emerald-600 transition"
                        >
                            Lịch đặt của tôi
                        </a>

                        <span>/</span>

                        <span className="text-slate-700">
                            Chi tiết lịch đặt
                        </span>
                    </nav>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                        Chi tiết{" "}
                        <span className="text-emerald-600">
                            lịch đặt
                        </span>
                    </h1>

                    <p className="text-slate-600 text-sm mt-1 max-w-xl">
                        Theo dõi thông tin đặt lịch, tiến trình dịch vụ,
                        trạng thái thanh toán và nhật ký chăm sóc của
                        thú cưng.
                    </p>
                </div>

                {/* Image */}
                <div className="relative shrink-0 flex items-center justify-center">
                    <div className="relative w-56 h-32 md:w-64 md:h-36 rounded-xl overflow-hidden shadow-sm">
                        <img
                            alt="Pet Spa Wellness"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO9FaDBAgwog9kAPqKorbNis9bfNAfgOYuRW9gFoH6Yo2-DnAYcgBjHQd-LqGlkA_YJTWSe_TeHWn9WZ6QHyR6u8wiwIQgRNVN31qMUBl_e_ToOHi88PByYt7kXuJdK2L6c64aSRxg6d7hGN32q2rPGm7HBu4vBaBaHjj_h5aCEvfN8lzrLhUbB1ScLTGlA60Kx6NbfnCL3b3sYSUptBXNXUZjJUBDVCzr2YY92RU"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <span className="absolute -top-2 -right-2 text-emerald-500 text-base animate-pulse">
                        ✨
                    </span>

                    <span className="absolute bottom-2 -left-3 text-emerald-400 text-sm">
                        ✨
                    </span>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;