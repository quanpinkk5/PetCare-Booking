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
} from "lucide-react";

import { Link } from "react-router-dom";
import BusinessCard from "../../components/BusinessList/BusinessCard";
import { useEffect, useState } from "react";
import { businessApi } from "../../services/businessApi.js";

/* =========================
FILTER BAR
========================= */

const FilterBar = ({ filters, onChange, onSearch, onReset }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <label className="text-xs font-semibold text-gray-700">Tên cơ sở
                <input value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    placeholder="Nhập tên cơ sở..." className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-semibold text-gray-700">Địa điểm
                <input value={filters.location} onChange={(e) => onChange({ ...filters, location: e.target.value })}
                    placeholder="Tỉnh/thành, quận/huyện..." className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-semibold text-gray-700">Đánh giá
                <select value={filters.minRating} onChange={(e) => onChange({ ...filters, minRating: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option value="">Tất cả đánh giá</option><option value="4">Từ 4 sao</option><option value="4.5">Từ 4.5 sao</option>
                </select>
            </label>
            <div className="flex gap-2">
                <button type="submit" className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"><Search size={14} />Tìm kiếm</button>
                <button type="button" onClick={onReset} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"><RotateCcw size={14} />Đặt lại</button>
            </div>
        </div>
    </form>
);

/* =========================
HERO
========================= */

const HeroBanner = ({ children }) => {
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

const EMPTY_FILTERS = { search: '', location: '', minRating: '' };
const BusinessList = () => {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [query, setQuery] = useState({ ...EMPTY_FILTERS, page: 1, limit: 8, sort: 'newest' });
    const [result, setResult] = useState({ data: [], pagination: { total: 0, totalPages: 0 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const [view, setView] = useState('grid');
    useEffect(() => {
        let cancelled = false;
        businessApi.list(query).then((response) => {
            if (!cancelled) setResult(response);
        }).catch((err) => { if (!cancelled) setError(err.message || 'Không thể tải danh sách cơ sở.'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [query, attempt]);
    const changeQuery = (values) => { setError(''); setLoading(true); setQuery((current) => ({ ...current, ...values })); };
    const totalPages = result.pagination.totalPages;

    return (
        <div className="antialiased">

            <HeroBanner><FilterBar filters={filters} onChange={setFilters}
                onSearch={() => changeQuery({ ...filters, page: 1 })}
                onReset={() => { setFilters(EMPTY_FILTERS); changeQuery({ ...EMPTY_FILTERS, page: 1, sort: 'newest' }); }} /></HeroBanner>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Business list */}
                    <section className="lg:col-span-9">

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-200 mb-5 gap-3">

                            <div className="text-sm font-bold text-gray-900">
                                Hiển thị{" "}
                                <span className="text-gray-900 font-extrabold">
                                    {loading ? '...' : error ? '—' : result.pagination.total} cơ sở
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">

                                <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                                    <span>Sắp xếp theo:</span>

                                    <select aria-label="Sắp xếp cơ sở" value={query.sort} onChange={(e) => changeQuery({ sort: e.target.value, page: 1 })} className="py-1 pl-2.5 pr-7 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0fa958]">
                                        <option value="newest">Mới nhất</option>
                                        <option value="popular">Nhiều đánh giá nhất</option>
                                        <option value="rating">Đánh giá cao nhất</option>

                                    </select>
                                </div>

                                <div className="flex items-center space-x-1 bg-gray-100 p-0.5 rounded-md border border-gray-200">

                                    <button
                                        className={view === 'grid' ? 'p-1 rounded bg-emerald-600 text-white' : 'p-1 rounded text-gray-500'}
                                        title="Dạng lưới" aria-pressed={view === 'grid'} onClick={() => setView('grid')}
                                    >
                                        <Grid size={14} />
                                    </button>

                                    <button
                                        className={view === 'list' ? 'p-1 rounded bg-emerald-600 text-white' : 'p-1 rounded text-gray-500'}
                                        title="Dạng danh sách" aria-pressed={view === 'list'} onClick={() => setView('list')}
                                    >
                                        <List size={14} />
                                    </button>

                                </div>
                            </div>
                        </div>

                        {loading ? <p role="status" className="p-8 text-center">Đang tải danh sách cơ sở...</p>
                            : error ? <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
                                <p>{error}</p><button type="button" onClick={() => { setError(''); setLoading(true); setAttempt((value) => value + 1); }} className="mt-3 underline">Thử lại</button>
                              </div>
                            : result.data.length ? <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'grid grid-cols-1 gap-4'}>
                                {result.data.map((business) => <BusinessCard key={business._id} business={business} />)}
                              </div>
                            : <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">Không tìm thấy cơ sở phù hợp.</p>}
                        {!loading && !error && totalPages > 1 && <nav aria-label="Phân trang cơ sở" className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
                            <button type="button" aria-label="Trang trước" disabled={query.page <= 1} onClick={() => changeQuery({ page: query.page - 1 })} className="rounded border p-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
                            <span className="px-3 py-2">Trang {query.page} / {totalPages}</span>
                            <button type="button" aria-label="Trang sau" disabled={query.page >= totalPages} onClick={() => changeQuery({ page: query.page + 1 })} className="rounded border p-2 disabled:opacity-40"><ChevronRight size={16} /></button>
                        </nav>}
                    </section>

                    <Sidebar />

                </div>
            </main>

        </div>
    );
};

export default BusinessList;
