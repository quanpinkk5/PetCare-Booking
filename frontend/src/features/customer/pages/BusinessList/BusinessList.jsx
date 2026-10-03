import {
    PawPrint,
    Search,
    MapPin,
    LayoutGrid,
    Star,
    CheckCircle2,
    List,
    Grid,
    ChevronLeft,
    ChevronRight,
    CalendarPlus,
    RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";
import BusinessCard from "../../components/BusinessCard";
import { mockBusinesses } from "../../services/mockBusinesses";

/* =========================
FILTER BAR
========================= */

const FilterBar = () => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

                {/* Search */}
                <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Tìm tên cơ sở hoặc dịch vụ
                    </label>

                    <div className="relative flex items-center">
                        <Search
                            size={14}
                            className="absolute left-2.5 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Ví dụ: Puppy Love, Grooming..."
                            className="w-full pl-8 pr-2 py-1.5 text-xs text-gray-800 bg-gray-50 rounded-lg border-gray-200 focus:border-[#0fa958] focus:ring-1 focus:ring-[#0fa958] placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Địa điểm
                    </label>

                    <div className="relative flex items-center">
                        <MapPin
                            size={14}
                            className="absolute left-2 text-[#0fa958]"
                        />

                        <select className="w-full pl-7 pr-7 py-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg border-gray-200 focus:border-[#0fa958] focus:ring-1 focus:ring-[#0fa958]">
                            <option>Chọn khu vực</option>
                            <option>Hà Nội</option>
                            <option>TP. Hồ Chí Minh</option>
                            <option>Đà Nẵng</option>
                        </select>
                    </div>
                </div>

                {/* Service */}
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Danh mục dịch vụ
                    </label>

                    <div className="relative flex items-center">
                        <LayoutGrid
                            size={14}
                            className="absolute left-2 text-[#0fa958]"
                        />

                        <select className="w-full pl-7 pr-7 py-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg border-gray-200 focus:border-[#0fa958] focus:ring-1 focus:ring-[#0fa958]">
                            <option>Tất cả dịch vụ</option>
                            <option>Tắm & Spa</option>
                            <option>Grooming / Cắt tỉa</option>
                            <option>Lưu trú thú cưng</option>
                        </select>
                    </div>
                </div>

                {/* Rating */}
                <div className="md:col-span-1">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Đánh giá
                    </label>

                    <div className="relative flex items-center">
                        <Star
                            size={14}
                            className="absolute left-1.5 text-yellow-500 fill-current"
                        />

                        <select className="w-full pl-5 pr-6 py-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg border-gray-200 focus:border-[#0fa958] focus:ring-1 focus:ring-[#0fa958]">
                            <option>Tất cả</option>
                            <option>4.5+ ⭐</option>
                            <option>4.0+ ⭐</option>
                        </select>
                    </div>
                </div>

                {/* Price */}
                <div className="md:col-span-1">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Khoảng giá
                    </label>

                    <select className="w-full px-2 py-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg border-gray-200 focus:border-[#0fa958] focus:ring-1 focus:ring-[#0fa958]">
                        <option>Tất cả</option>
                        <option>&lt; 150k</option>
                        <option>150k - 300k</option>
                        <option>&gt; 300k</option>
                    </select>
                </div>

                {/* Open now */}
                <div className="md:col-span-1 flex items-center pt-3">
                    <label className="inline-flex items-center text-[11px] text-gray-700 font-medium cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-3.5 h-3.5 text-[#0fa958] border-gray-300 rounded focus:ring-[#0fa958]"
                        />

                        <span className="ml-1.5 leading-tight">
                            Chỉ hiển thị đang mở cửa
                        </span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex items-center space-x-2 pt-2 md:pt-3">

                    <button className="flex-1 inline-flex items-center justify-center space-x-1 bg-[#0fa958] hover:bg-[#0c8e4a] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition">
                        <Search size={14} />
                        <span>Tìm kiếm</span>
                    </button>

                    <button className="inline-flex items-center justify-center space-x-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium py-2 px-2.5 rounded-lg transition">
                        <RotateCcw size={14} />
                        <span>Đặt lại</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

/* =========================
HERO
========================= */

const HeroBanner = () => {
    return (
        <section
            className="relative pt-6 pb-20 border-b border-gray-100 overflow-hidden"
            style={{
                background:
                    "radial-gradient(circle at 85% 30%, #e1f7ec 0%, #f4fbf7 60%, #ffffff 100%)",
            }}
        >
            {/* Decorative paws */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <PawPrint className="absolute w-20 h-20 text-emerald-300 top-4 left-6" />

                <PawPrint className="absolute w-14 h-14 text-emerald-400 top-12 left-1/3" />

                <PawPrint className="absolute w-24 h-24 text-emerald-200 top-6 right-1/4" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col md:flex-row items-center justify-between pb-6">

                    {/* Text */}
                    <div className="max-w-2xl">

                        <div className="text-xs text-gray-500 font-medium mb-2 flex items-center space-x-1">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
                            <span>/</span>
                            <span className="text-gray-700 font-semibold">
                                Cơ sở
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                            Khám phá các{" "}
                            <span className="text-[#0fa958]">
                                cơ sở
                            </span>{" "}
                            chăm sóc thú cưng
                        </h1>

                        <p className="text-xs sm:text-sm text-gray-600 mt-2">
                            So sánh, đánh giá và đặt lịch tại các cơ sở uy tín gần bạn.
                            Chăm sóc thú cưng dễ dàng và an tâm hơn.
                        </p>

                    </div>

                    {/* Image */}
                    <div className="relative mt-4 md:mt-0 flex items-center">

                        <div className="relative w-64 h-28 sm:w-80 sm:h-32 rounded-2xl overflow-hidden shadow-sm border-2 border-white">

                            <img
                                alt="Pet Shop & Cute Pets"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBim0Cy7VHJKdkaGSAG-kU_8I_NcSlwT02NJdvpi03T9RsdvEbE2E7YQOLdew0zpIfFo_hY0pMO3WIth8THfL-R2s5xtKa8JBqcmdDqobPh4mW_upU1GLjLvBVyX7dGXvVZNhyzbDlk6Xbmd8sZdfDPY8PfbI5sImo7xWH-_GU_MsL54hhp8s7ovLB6v_wu0L9060fyU4zjhCpTbvutUmTXWeecFjGJ_nJXXUNa8G9ifz1waZjfrqON"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-2 text-white text-xs font-semibold">
                                Uy tín & Chất lượng
                            </div>

                        </div>

                        <div className="absolute -right-3 -top-2 bg-[#0fa958] text-white p-2 rounded-full shadow-md">
                            <PawPrint
                                size={16}
                                fill="currentColor"
                            />
                        </div>

                    </div>
                </div>

                <FilterBar />

            </div>
        </section>
    );
};

/* =========================
SIDEBAR
========================= */

const Sidebar = () => {
    return (
        <aside className="lg:col-span-3 space-y-4">

            {/* Benefits */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">

                <h2 className="text-sm font-bold text-gray-900 mb-3.5">
                    Vì sao chọn PetCare Booking?
                </h2>

                <div className="space-y-3.5">

                    <div className="flex items-start space-x-2.5">
                        <div className="w-7 h-7 rounded-lg border border-emerald-200 bg-emerald-50 text-[#0fa958] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} />
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-900">
                                Cơ sở đã xác minh
                            </h4>

                            <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                                Tất cả cơ sở đều được kiểm duyệt thông tin rõ ràng.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                        <div className="w-7 h-7 rounded-lg border border-emerald-200 bg-emerald-50 text-[#0fa958] flex items-center justify-center shrink-0">
                            <Star size={16} />
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-900">
                                Đánh giá thực tế
                            </h4>

                            <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                                Xem đánh giá, hình ảnh và trải nghiệm từ khách hàng thật.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                        <div className="w-7 h-7 rounded-lg border border-emerald-200 bg-emerald-50 text-[#0fa958] flex items-center justify-center shrink-0">
                            <CalendarPlus size={16} />
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-900">
                                Đặt lịch nhanh chóng
                            </h4>

                            <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                                Đặt lịch dễ dàng, xác nhận tức thì, tiết kiệm thời gian.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* App */}
            
        </aside>
    );
};

/* =========================
PAGE
========================= */

const BusinessList = () => {
    return (
        <div className="antialiased">

                <HeroBanner />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Business list */}
                        <section className="lg:col-span-9">

                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-200 mb-5 gap-3">

                                <div className="text-sm font-bold text-gray-900">
                                    Hiển thị{" "}
                                    <span className="text-gray-900 font-extrabold">
                                        {mockBusinesses.length} cơ sở
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3">

                                    <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                                        <span>Sắp xếp theo:</span>

                                        <select className="py-1 pl-2.5 pr-7 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0fa958]">
                                            <option>Phổ biến nhất</option>
                                            <option>Đánh giá cao nhất</option>
                                            <option>Giá thấp đến cao</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-1 bg-gray-100 p-0.5 rounded-md border border-gray-200">

                                        <button
                                            className="p-1 rounded bg-[#0fa958] text-white shadow-xs"
                                            title="Grid view"
                                        >
                                            <Grid size={14} />
                                        </button>

                                        <button
                                            className="p-1 rounded text-gray-500 hover:text-gray-800"
                                            title="List view"
                                        >
                                            <List size={14} />
                                        </button>

                                    </div>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">

                                {mockBusinesses.map((business) => (
                                    <BusinessCard
                                        key={business.id}
                                        business={business}
                                    />
                                ))}

                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center space-x-1.5 mt-8 text-xs font-semibold">

                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-gray-200 bg-white">
                                    <ChevronLeft size={14} />
                                </button>

                                <button className="w-7 h-7 bg-[#0fa958] text-white rounded shadow-xs flex items-center justify-center">
                                    1
                                </button>

                                <button className="w-7 h-7 text-gray-700 hover:bg-gray-100 rounded border border-gray-200 bg-white flex items-center justify-center">
                                    2
                                </button>

                                <button className="w-7 h-7 text-gray-700 hover:bg-gray-100 rounded border border-gray-200 bg-white flex items-center justify-center">
                                    3
                                </button>

                                <span className="px-1 text-gray-400">
                                    ...
                                </span>

                                <button className="w-7 h-7 text-gray-700 hover:bg-gray-100 rounded border border-gray-200 bg-white flex items-center justify-center">
                                    6
                                </button>

                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-gray-200 bg-white">
                                    <ChevronRight size={14} />
                                </button>

                            </div>

                        </section>

                        <Sidebar />

                    </div>
                </main>

            </div>
    );
};

export default BusinessList;