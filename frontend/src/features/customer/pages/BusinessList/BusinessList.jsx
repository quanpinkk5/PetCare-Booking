import {
    PawPrint,
    Search,
    Star,
    CheckCircle2,
    List,
    Grid,
    ChevronLeft,
    ChevronRight,
    CalendarPlus,
    RotateCcw,
    MapPin,
    Building2,
    Phone,
    ShieldCheck,
    Sparkles,
    Clock,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";
import BusinessCard from "../../components/BusinessList/BusinessCard";
import { useEffect, useState } from "react";
import { businessApi } from "../../services/businessApi.js";

/* =========================
SKELETON LOADER
========================= */
const SkeletonCard = ({ view }) => {
    if (view === "list") {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse flex flex-col sm:flex-row gap-4">
                <div className="h-44 sm:h-36 sm:w-56 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    <div className="h-3 bg-slate-200 rounded-md w-full" />
                    <div className="flex gap-2 pt-2">
                        <div className="h-6 w-20 bg-slate-200 rounded-md" />
                        <div className="h-6 w-24 bg-slate-200 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse flex flex-col justify-between">
            <div>
                <div className="h-44 w-full bg-slate-200" />
                <div className="p-4 space-y-2.5">
                    <div className="h-4 bg-slate-200 rounded-md w-4/5" />
                    <div className="h-3 bg-slate-200 rounded-md w-3/5" />
                    <div className="flex gap-1.5 pt-1">
                        <div className="h-5 w-16 bg-slate-200 rounded" />
                        <div className="h-5 w-16 bg-slate-200 rounded" />
                    </div>
                </div>
            </div>
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <div className="h-8 bg-slate-200 rounded-xl" />
                <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
};

/* =========================
FILTER BAR
========================= */
const QUICK_CHIPS = [
    { label: "Tất cả", location: "", minRating: "" },
    { label: "Hà Nội", location: "Hà Nội", minRating: "" },
    { label: "TP. Hồ Chí Minh", location: "Hồ Chí Minh", minRating: "" },
    { label: "Đánh giá 4.5+ ★", location: "", minRating: "4.5" },
    { label: "Đánh giá 4.0+ ★", location: "", minRating: "4" },
];

const FilterBar = ({ filters, onChange, onSearch, onReset }) => {
    const handleChipClick = (chip) => {
        const updated = {
            ...filters,
            location: chip.location,
            minRating: chip.minRating,
        };
        onChange(updated);
        // Automatically trigger search with chip selection
        onSearch(updated);
    };

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl shadow-emerald-950/5 border border-slate-200/90 mt-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                    {/* Tên cơ sở */}
                    <div className="lg:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Tên cơ sở
                        </label>
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={filters.search}
                                onChange={(e) => onChange({ ...filters, search: e.target.value })}
                                placeholder="Nhập tên cơ sở..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                            />
                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={() => onChange({ ...filters, search: "" })}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Địa điểm */}
                    <div className="lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Khu vực / Địa điểm
                        </label>
                        <div className="relative">
                            <MapPin
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={filters.location}
                                onChange={(e) => onChange({ ...filters, location: e.target.value })}
                                placeholder="Hà Nội, TP.HCM, Quận..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Đánh giá */}
                    <div className="lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Đánh giá sao
                        </label>
                        <div className="relative">
                            <Star
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 fill-amber-500"
                            />
                            <select
                                value={filters.minRating}
                                onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                            >
                                <option value="">Tất cả đánh giá</option>
                                <option value="4">Từ 4.0 sao trở lên</option>
                                <option value="4.5">Từ 4.5 sao trở lên</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="lg:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-emerald-600/30 hover:shadow-md transition-all cursor-pointer"
                        >
                            <Search size={15} />
                            <span>Tìm kiếm</span>
                        </button>

                        <button
                            type="button"
                            onClick={onReset}
                            title="Đặt lại bộ lọc"
                            className="flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 px-3 py-2.5 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                        >
                            <RotateCcw size={15} />
                        </button>
                    </div>
                </div>

                {/* Quick chip filters */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">Gợi ý lọc nhanh:</span>
                    {QUICK_CHIPS.map((chip, idx) => {
                        const isSelected =
                            (chip.location ? filters.location.toLowerCase().includes(chip.location.toLowerCase()) : !filters.location) &&
                            (chip.minRating ? filters.minRating === chip.minRating : !filters.minRating && !chip.location);

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleChipClick(chip)}
                                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-transparent"
                                }`}
                            >
                                {chip.label}
                            </button>
                        );
                    })}
                </div>
            </form>
        </div>
    );
};

/* =========================
HERO BANNER
========================= */
const HeroBanner = ({ children }) => {
    return (
        <section className="relative pt-6 pb-16 bg-gradient-to-b from-emerald-50/80 via-emerald-50/30 to-white border-b border-slate-100 overflow-hidden">
            {/* Background decorative circles & paws */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
                <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute -bottom-24 left-10 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl" />
                <PawPrint className="absolute w-20 h-20 text-emerald-300/40 top-4 left-6" />
                <PawPrint className="absolute w-14 h-14 text-emerald-400/30 top-12 left-1/3" />
                <PawPrint className="absolute w-28 h-28 text-emerald-300/30 top-6 right-1/4" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between pb-6 gap-6">
                    {/* Text header */}
                    <div className="max-w-2xl">
                        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 font-medium mb-3 flex items-center space-x-1.5">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">
                                Trang chủ
                            </Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-700 font-semibold">Cơ sở chăm sóc</span>
                        </nav>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200/60">
                            <Sparkles size={13} className="text-emerald-600" />
                            <span>Mạng lưới cơ sở thú cưng hàng đầu</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            Khám phá các <span className="text-emerald-600">cơ sở chăm sóc</span> uy tín
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                            So sánh bảng giá, đánh giá thực tế và đặt lịch nhanh chóng tại các spa, thú y & khách sạn thú cưng chất lượng cao gần bạn.
                        </p>

                        {/* Trust highlights */}
                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={15} className="text-emerald-600" />
                                <span>100% kiểm duyệt chất lượng</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star size={15} className="text-amber-500 fill-amber-500" />
                                <span>Đánh giá khách quan 4.9★</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={15} className="text-emerald-600" />
                                <span>Đặt lịch & tư vấn 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Banner */}
                    <div className="relative mt-2 md:mt-0 flex items-center shrink-0">
                        <div className="relative w-64 h-32 sm:w-80 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-3 border-white">
                            <img
                                alt="Pet Shop & Cute Pets"
                                className="w-full h-full object-cover"
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3 text-white text-xs font-bold">
                                Chăm sóc tận tâm • Dịch vụ 5 sao
                            </div>
                        </div>

                        <div className="absolute -right-3 -top-3 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-white">
                            <PawPrint size={18} fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Filter bar injected here */}
                {children}
            </div>
        </section>
    );
};

/* =========================
SIDEBAR
========================= */
const Sidebar = () => {
    return (
        <aside className="lg:col-span-3 space-y-5">
            {/* Benefits Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-sm font-bold text-slate-900">
                        Vì sao chọn PetCare?
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800">
                                Cơ sở đã xác minh
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                Giấy phép rõ ràng, không gian vệ sinh và trang thiết bị hiện đại.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Star size={16} className="fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800">
                                Đánh giá từ khách thật
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                Hình ảnh và phản hồi thực tế từ hàng nghìn người nuôi thú cưng.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <CalendarPlus size={16} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800">
                                Đặt lịch tức thì
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                Xác nhận lịch nhanh chóng, không lo hết chỗ hay chờ đợi lâu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 24/7 Hotline Support Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md shadow-emerald-700/20">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-white/20">
                        <Phone size={18} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
                            Hỗ trợ tư vấn 24/7
                        </span>
                        <h3 className="text-sm font-extrabold text-white">Bạn cần hỗ trợ chọn cơ sở?</h3>
                    </div>
                </div>
                <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                    Đội ngũ PetCare sẵn sàng giải đáp thắc mắc về dịch vụ, địa điểm và bảng giá phù hợp nhất cho thú cưng của bạn.
                </p>
                <a
                    href="tel:0912345678"
                    className="mt-4 block w-full text-center bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold py-2.5 rounded-xl shadow-xs transition-colors"
                >
                    Gọi ngay 0912 345 678
                </a>
            </div>

            {/* Popular Services Quick Links */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                    Dịch vụ được quan tâm
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {[
                        "Tắm & vệ sinh",
                        "Grooming tạo kiểu",
                        "Spa thảo dược",
                        "Khách sạn thú cưng",
                        "Khám & tiêm phòng",
                        "Cắt mài móng",
                    ].map((item, index) => (
                        <Link
                            key={index}
                            to={`/services`}
                            className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors font-medium"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
};

/* =========================
MAIN COMPONENT
========================= */
const EMPTY_FILTERS = { search: "", location: "", minRating: "" };

const BusinessList = () => {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [query, setQuery] = useState({ ...EMPTY_FILTERS, page: 1, limit: 9, sort: "newest" });
    const [result, setResult] = useState({ data: [], pagination: { total: 0, totalPages: 0 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [view, setView] = useState("grid");

    useEffect(() => {
        let cancelled = false;
        businessApi
            .list(query)
            .then((response) => {
                if (!cancelled) setResult(response);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || "Không thể tải danh sách cơ sở.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [query, attempt]);

    const changeQuery = (values) => {
        setError("");
        setLoading(true);
        setQuery((current) => ({ ...current, ...values }));
    };

    const handleSearch = (customFilters) => {
        const active = customFilters || filters;
        changeQuery({ ...active, page: 1 });
    };

    const handleReset = () => {
        setFilters(EMPTY_FILTERS);
        changeQuery({ ...EMPTY_FILTERS, page: 1, sort: "newest" });
    };

    const totalPages = result.pagination.totalPages || 0;
    const totalCount = result.pagination.total || 0;

    return (
        <div className="antialiased min-h-screen bg-slate-50/40">
            {/* Hero Banner with Integrated Search */}
            <HeroBanner>
                <FilterBar
                    filters={filters}
                    onChange={setFilters}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />
            </HeroBanner>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Business List column */}
                    <section className="lg:col-span-9">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                                    <Building2 size={16} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {loading ? (
                                        "Đang tìm kiếm cơ sở..."
                                    ) : error ? (
                                        "Không có dữ liệu"
                                    ) : (
                                        <>
                                            Hiển thị <span className="text-emerald-700 font-extrabold">{totalCount}</span> cơ sở chăm sóc
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                    <span className="font-medium text-slate-500">Sắp xếp:</span>
                                    <select
                                        aria-label="Sắp xếp cơ sở"
                                        value={query.sort}
                                        onChange={(e) => changeQuery({ sort: e.target.value, page: 1 })}
                                        className="py-1.5 pl-3 pr-7 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="popular">Nhiều đánh giá nhất</option>
                                        <option value="rating">Đánh giá cao nhất</option>
                                    </select>
                                </div>

                                {/* View Switcher */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                                    <button
                                        type="button"
                                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                            view === "grid"
                                                ? "bg-white text-emerald-700 shadow-2xs font-bold"
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                        title="Dạng lưới"
                                        aria-pressed={view === "grid"}
                                        onClick={() => setView("grid")}
                                    >
                                        <Grid size={15} />
                                    </button>

                                    <button
                                        type="button"
                                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                            view === "list"
                                                ? "bg-white text-emerald-700 shadow-2xs font-bold"
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                        title="Dạng danh sách"
                                        aria-pressed={view === "list"}
                                        onClick={() => setView("list")}
                                    >
                                        <List size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List Content */}
                        {loading ? (
                            <div
                                className={
                                    view === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                                        : "grid grid-cols-1 gap-4"
                                }
                            >
                                {[...Array(6)].map((_, i) => (
                                    <SkeletonCard key={i} view={view} />
                                ))}
                            </div>
                        ) : error ? (
                            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                                <p className="text-sm font-semibold text-red-700">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setLoading(true);
                                        setAttempt((value) => value + 1);
                                    }}
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                                >
                                    <RotateCcw size={13} /> Thử lại
                                </button>
                            </div>
                        ) : result.data.length ? (
                            <div
                                className={
                                    view === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                                        : "grid grid-cols-1 gap-4"
                                }
                            >
                                {result.data.map((business) => (
                                    <BusinessCard
                                        key={business._id || business.id}
                                        business={business}
                                        view={view}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                                <PawPrint size={40} className="mx-auto text-slate-300 mb-3" />
                                <h3 className="text-sm font-bold text-slate-800">Không tìm thấy cơ sở phù hợp</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                    Thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại bộ lọc để xem toàn bộ cơ sở có sẵn.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                >
                                    Xem tất cả cơ sở
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <nav
                                aria-label="Phân trang cơ sở"
                                className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold"
                            >
                                <button
                                    type="button"
                                    aria-label="Trang trước"
                                    disabled={query.page <= 1}
                                    onClick={() => changeQuery({ page: query.page - 1 })}
                                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    const isActive = query.page === pageNum;
                                    return (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => changeQuery({ page: pageNum })}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                                                isActive
                                                    ? "bg-emerald-600 text-white font-bold shadow-xs shadow-emerald-600/30"
                                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    aria-label="Trang sau"
                                    disabled={query.page >= totalPages}
                                    onClick={() => changeQuery({ page: query.page + 1 })}
                                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        )}
                    </section>

                    {/* Sidebar column */}
                    <Sidebar />
                </div>
            </main>
        </div>
    );
};

export default BusinessList;
