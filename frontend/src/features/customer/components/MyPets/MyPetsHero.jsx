import { Link } from 'react-router-dom';
import {
    PawPrint,
    CalendarDays,
    Home,
    ShieldHalf,
    Heart,
} from 'lucide-react';

const MyPetsHero = ({ totalPets = 6 }) => {
    const stats = [
        {
            icon: PawPrint,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            label: 'Tổng thú cưng',
            value: String(totalPets),
        },
        {
            icon: CalendarDays,
            color: 'text-teal-600',
            bg: 'bg-teal-100',
            label: 'Lịch sắp tới',
            value: '2',
        },
        {
            icon: Home,
            color: 'text-cyan-600',
            bg: 'bg-cyan-100',
            label: 'Đang lưu trú',
            value: '1',
        },
        {
            icon: ShieldHalf,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            label: 'Hồ sơ hoàn chỉnh',
            value: '100%',
        },
    ];

    return (
        <section className="relative bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-100/60 rounded-3xl p-6 sm:p-8 mb-8 border border-emerald-100 overflow-hidden">
            <div className="absolute -left-6 top-6 text-emerald-200/40 select-none -rotate-12 pointer-events-none">
                <PawPrint size={100} strokeWidth={1} />
            </div>

            <div className="absolute right-72 bottom-4 text-emerald-200/30 select-none rotate-45 pointer-events-none">
                <PawPrint size={120} strokeWidth={1} />
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="max-w-2xl">
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <span>Tài khoản</span>
                        <span>/</span>
                        <span className="text-emerald-700 font-semibold">
                            Thú cưng của tôi
                        </span>
                    </nav>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Thú cưng <span className="text-emerald-600">của tôi</span>
                    </h1>

                    <p className="text-slate-600 text-sm mb-6">
                        Quản lý hồ sơ thú cưng và đặt dịch vụ dễ dàng, nhanh chóng hơn.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={index}
                                    className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-white flex items-center gap-3 shadow-xs"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                                    >
                                        <Icon size={18} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-500 font-medium leading-none mb-1">
                                            {stat.label}
                                        </p>

                                        <p
                                            className={`text-lg font-bold leading-none ${stat.value === '100%'
                                                    ? 'text-emerald-600'
                                                    : 'text-slate-800'
                                                }`}
                                        >
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center relative pr-4">
                    <div className="absolute -top-1 left-2 bg-emerald-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce duration-1000">
                        <PawPrint size={14} />
                    </div>

                    <div className="absolute bottom-2 -left-4 bg-white text-teal-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-teal-100">
                        <Heart size={14} />
                    </div>

                    <div className="w-72 h-44 flex items-end justify-center relative">
                        <img
                            alt="Pets banner"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYiyBcpc9fVuLXbzaEetp6zaEM9GGYdI4elwopBsZbIBqbyVuBg3egXas_LcjCSiT3NmEGDTfgvA7So-Vts0EX2Sf1Qo7ubV8pcdijbOQNB9yWejkSKgo5PKvxY1qtg4zRfKvSZTQIwqfG7fUy4cYQyWofDwqq4egB75LejAQUT1JEhljgHBl-Cu0UkrgHNlEF8gw5jpU1ww5UBGNoauzrRZhDUu25Yv5k4s6YmJ0"
                            className="h-44 object-contain filter drop-shadow-xl z-10 scale-105 transform hover:scale-110 transition duration-300"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyPetsHero;