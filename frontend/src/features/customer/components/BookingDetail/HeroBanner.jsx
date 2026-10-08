import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, ArrowLeft } from "lucide-react";

const HeroBanner = ({ booking }) => {
    const navigate = useNavigate();

    const statusType =
        booking?.statusType ||
        (booking?.status?.toLowerCase().includes("chờ")
            ? "pending"
            : booking?.status?.toLowerCase().includes("đã xác nhận")
            ? "confirmed"
            : booking?.status?.toLowerCase().includes("đang thực hiện")
            ? "in-progress"
            : booking?.status?.toLowerCase().includes("hoàn thành")
            ? "completed"
            : booking?.status?.toLowerCase().includes("hủy")
            ? "cancelled"
            : "pending");

    const statusBadgeClass =
        statusType === "pending"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : statusType === "confirmed"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : statusType === "in-progress"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : statusType === "completed"
            ? "bg-teal-50 text-teal-700 border-teal-200"
            : "bg-slate-100 text-slate-600 border-slate-200";

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
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate("/my-bookings")}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-emerald-100 transition cursor-pointer shadow-2xs"
                        >
                            <ArrowLeft size={13} />
                            <span>Quay lại</span>
                        </button>

                        <span className="text-slate-300">|</span>

                        <nav className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                            <Link
                                to="/"
                                className="hover:text-emerald-600 transition"
                            >
                                Trang chủ
                            </Link>

                            <span>/</span>

                            <Link
                                to="/my-bookings"
                                className="hover:text-emerald-600 transition"
                            >
                                Lịch đặt của tôi
                            </Link>

                            <span>/</span>

                            <span className="text-slate-700 font-semibold">
                                Chi tiết lịch đặt
                            </span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mt-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                            Chi tiết lịch đặt{" "}
                            {booking?.id && (
                                <span className="text-emerald-700 font-mono text-xl md:text-2xl font-bold bg-white/70 px-2.5 py-0.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                                    #{booking.id}
                                </span>
                            )}
                        </h1>

                        {booking?.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 shadow-2xs ${statusBadgeClass}`}>
                                <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                                {booking.status}
                            </span>
                        )}
                    </div>

                    <p className="text-slate-600 text-sm mt-1.5 max-w-xl">
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