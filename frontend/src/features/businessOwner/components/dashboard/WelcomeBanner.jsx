import { Link } from "react-router-dom";
import { Building2, ChevronRight, GitFork, Sparkles } from "lucide-react";

export default function WelcomeBanner() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-50/50 p-6 shadow-sm">
            <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/30 bg-white p-1 text-center shadow-sm">
                        <span className="text-2xl">🐾</span>
                        <span className="mt-1 text-[9px] font-bold leading-none text-emerald-700">
                            Happy Pet
                        </span>
                    </div>

                    <div>
                        <span className="mb-1 inline-block rounded-full bg-emerald-200/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            Xin chào, Happy Pet! 👋
                        </span>

                        <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                            Happy Pet - Cầu Giấy
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 md:text-sm">
                            Chúc bạn một ngày làm việc hiệu quả! Hãy cùng chăm sóc thú cưng
                            thật tuyệt vời hôm nay.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-end">
                    <div className="hidden items-center gap-2 lg:flex">
                        <span className="text-4xl drop-shadow-sm">🦮</span>
                        <span className="text-3xl drop-shadow-sm">🐈</span>
                        <span className="animate-pulse text-2xl font-extrabold text-emerald-500">
                            🌿
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}