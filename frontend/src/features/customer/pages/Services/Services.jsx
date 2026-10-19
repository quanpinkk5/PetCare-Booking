import { useEffect, useState } from "react";
import { serviceApi } from "../../services/serviceApi.js";
import { Link } from "react-router-dom";

import {
  PawPrint,
  Search,
  Scissors,
  Bath,
  Home,
  Droplets,
  ShieldHalf,
  CalendarClock,
  Zap,
  Award,
  Receipt,
  Headphones,
  MessageCircle,
  HeartPulse,
} from "lucide-react";

import ServiceCategoryBar from "../../components/Service/ServiceCategoryBar";
import ServiceCard from "../../components/Service/ServiceCard";

/* =========================
   HERO
========================= */

const Hero = ({ children }) => {
  return (
    <section className="relative bg-gradient-to-br from-[#ebfaf3] via-[#e2f7ed] to-[#f4fcf8] rounded-3xl p-6 md:p-10 overflow-hidden border border-emerald-50">

      <div className="absolute -left-6 top-10 text-emerald-200/50 pointer-events-none select-none">
        <PawPrint size={140} strokeWidth={1} />
      </div>

      <div className="absolute right-1/3 bottom-2 text-emerald-100/60 pointer-events-none select-none">
        <PawPrint size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">

        <div className="max-w-xl space-y-3">

          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>

            <span>/</span>

            <span className="text-slate-700">
              Dịch vụ
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dịch vụ{" "}
            <span className="text-emerald-600 font-extrabold">
              chăm sóc thú cưng
            </span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Khám phá các dịch vụ chất lượng cao dành cho thú cưng của bạn.
            <br className="hidden sm:inline" />
            Chăm sóc tận tâm - Yêu thương trọn vẹn.
          </p>

        </div>

        <div className="relative flex items-center justify-center lg:justify-end">

          <div className="relative w-72 h-48 md:w-80 md:h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80">
            <img
              alt="Thú cưng được chăm sóc"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDftV6C4EIAs4Hnwum30Z1R7V5d4pa62cxa3vi9GspOtqI0F4XYncWXpvW4iqkGvkJak3wIoN6PShvbJ_nYmgM492zrWd8d1d_f9XooA6QcHE27nj5gexjltW9wIFBTXP2h_ZoCdJuZQ4WZXfqN6PBMuhO5EAjTQ7pXkoCvnuEEkc6DHYhqXgINYPrqJa6wAW83fNbGiB2TAAbukDXvwD63nyLF8Dex2uE8K7w24vfo-pCkhDy-3ppl"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -top-3 -left-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Scissors className="w-4 h-4" />
          </div>

          <div className="absolute top-2 -right-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Bath className="w-4 h-4" />
          </div>

          <div className="absolute -bottom-3 left-4 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Home className="w-4 h-4" />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Droplets className="w-4 h-4" />
          </div>

        </div>
      </div>

      {children}
    </section>
  );
};

/* =========================
   SERVICE LIST
========================= */

/* =========================
   SIDEBAR
========================= */

const Sidebar = () => {
  return (
    <aside className="lg:col-span-4 space-y-4">

      {/* Tips */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">

        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="text-emerald-600">
            💡
          </span>
          Mẹo lựa chọn dịch vụ
        </h3>

        <div className="space-y-3.5">

          {[
            {
              icon: PawPrint,
              title: "Chọn dịch vụ phù hợp",
              desc: "Xem xét nhu cầu và tính cách của thú cưng",
            },
            {
              icon: ShieldHalf,
              title: "Ưu tiên an toàn",
              desc: "Chọn cơ sở uy tín, có đánh giá tốt và quy trình rõ ràng",
            },
            {
              icon: HeartPulse,
              title: "Theo dõi sức khỏe",
              desc: "Thông báo tình trạng sức khỏe cho nhân viên trước khi sử dụng",
            },
            {
              icon: CalendarClock,
              title: "Đặt lịch trước",
              desc: "Giúp bạn chọn được khung giờ phù hợp và tránh chờ đợi",
            },
          ].map((tip, index) => {

            const Icon = tip.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="font-bold text-slate-700">
                    {tip.title}
                  </p>

                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Why */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">

        <h3 className="font-bold text-slate-800 text-sm">
          Vì sao chọn PetCare Booking?
        </h3>

        <div className="space-y-3.5">

          {[
            {
              icon: Zap,
              title: "Đặt lịch nhanh chóng",
              desc: "Chọn dịch vụ và đặt lịch chỉ trong vài bước",
            },
            {
              icon: Award,
              title: "Nhiều cơ sở uy tín",
              desc: "Các cơ sở được kiểm duyệt thông tin",
            },
            {
              icon: Receipt,
              title: "Giá minh bạch",
              desc: "Hiển thị rõ ràng, không phát sinh chi phí ẩn",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ 24/7",
              desc: "Đội ngũ hỗ trợ tận tâm, sẵn sàng giải đáp",
            },
          ].map((feature, index) => {

            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="font-bold text-slate-700">
                    {feature.title}
                  </p>

                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Chat */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between gap-3 relative overflow-hidden">

        <div className="space-y-2 z-10">

          <h4 className="font-bold text-slate-800 text-sm">
            Bạn cần tư vấn?
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            Đội ngũ PetCare luôn sẵn sàng hỗ trợ và tư vấn dịch vụ phù hợp.
          </p>

          <Link to="/messages" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm">
            <MessageCircle className="w-4 h-4" />
            <span>Chat với chúng tôi</span>
          </Link>

        </div>

        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-4xl select-none z-10">
          🐶❤️
        </div>

      </div>

    </aside>
  );
};

/* =========================
   PAGE
========================= */

const EMPTY_FILTERS = { search: '', petType: '', serviceType: '', minPrice: '', maxPrice: '' };
const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal focus:border-emerald-500 focus:outline-none';
const Services = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [query, setQuery] = useState({ ...EMPTY_FILTERS, categoryId: '', sort: 'newest', page: 1, limit: 8 });
  const [result, setResult] = useState({ data: [], pagination: { total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [categoryState, setCategoryState] = useState({ data: [], loading: true, error: '' });
  const [categoryAttempt, setCategoryAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    serviceApi.list(query).then((response) => { if (!cancelled) setResult(response); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Không thể tải dịch vụ.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query, attempt]);
  useEffect(() => {
    let cancelled = false;
    serviceApi.categories().then((response) => {
      if (!cancelled) setCategoryState({ data: response.data, loading: false, error: '' });
    }).catch((err) => {
      if (!cancelled) setCategoryState({ data: [], loading: false, error: err.message || 'Không thể tải danh mục.' });
    });
    return () => { cancelled = true; };
  }, [categoryAttempt]);
  const updateQuery = (values) => {
    setLoading(true); setError('');
    setQuery((current) => ({ ...current, ...values }));
  };
  const change = (e) => setFilters((current) => ({ ...current, [e.target.name]: e.target.value }));
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 space-y-8">
        <Hero>
          <form onSubmit={(e) => { e.preventDefault(); updateQuery({ ...filters, page: 1 }); }} className="relative mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <label className="text-xs font-semibold">Tìm dịch vụ hoặc cơ sở
                <input type="search" name="search" maxLength={200} value={filters.search} onChange={change} placeholder="Tên dịch vụ, cơ sở..." className={inputClass} />
              </label>
              <label className="text-xs font-semibold">Loại thú cưng
                <select name="petType" value={filters.petType} onChange={change} className={inputClass}>
                  <option value="">Tất cả</option><option value="DOG">Chó</option><option value="CAT">Mèo</option>
                </select>
              </label>
              <label className="text-xs font-semibold">Hình thức
                <select name="serviceType" value={filters.serviceType} onChange={change} className={inputClass}>
                  <option value="">Tất cả</option><option value="APPOINTMENT">Theo lịch hẹn</option><option value="BOARDING">Lưu trú</option>
                </select>
              </label>
              <label className="text-xs font-semibold">Giá từ (VNĐ)
                <input type="number" name="minPrice" min="0" step="any" value={filters.minPrice} onChange={change} className={inputClass} placeholder="Không giới hạn" />
              </label>
              <label className="text-xs font-semibold">Giá đến (VNĐ)
                <input type="number" name="maxPrice" min="0" step="any" value={filters.maxPrice} onChange={change} className={inputClass} placeholder="Không giới hạn" />
              </label>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><Search size={15} />Tìm kiếm</button>
                <button type="button" onClick={() => { setFilters(EMPTY_FILTERS); updateQuery({ ...EMPTY_FILTERS, categoryId: '', page: 1, sort: 'newest' }); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Đặt lại</button>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Giá áp dụng theo đơn vị ghi trên từng dịch vụ (mỗi lần hoặc mỗi ngày).</p>
          </form>
        </Hero>
        {categoryState.loading ? <p role="status" className="text-sm text-slate-500">Đang tải danh mục...</p>
          : categoryState.error ? <div role="alert" className="text-sm text-red-700"><p>{categoryState.error}</p><button type="button" onClick={() => { setCategoryState({ data: [], loading: true, error: '' }); setCategoryAttempt((value) => value + 1); }} className="mt-2 underline">Tải lại danh mục</button></div>
          : <ServiceCategoryBar categories={categoryState.data} selectedId={query.categoryId} onChange={(categoryId) => updateQuery({ categoryId, page: 1 })} />}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold">Dịch vụ tại chi nhánh <span className="text-xs font-normal text-slate-500">({loading ? '...' : error ? '—' : result.pagination.total} kết quả)</span></h2>
              <label className="text-xs">Sắp xếp
                <select value={query.sort} onChange={(e) => updateQuery({ sort: e.target.value, page: 1 })} className="ml-2 rounded-lg border border-slate-200 p-2">
                  <option value="newest">Mới nhất</option><option value="priceAsc">Giá thấp đến cao</option><option value="priceDesc">Giá cao đến thấp</option><option value="name">Tên A–Z</option>
                </select>
              </label>
            </div>
            {loading ? <p role="status" className="rounded-2xl bg-white p-8 text-center text-slate-500">Đang tải dịch vụ...</p>
              : error ? <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700"><p>{error}</p><button type="button" onClick={() => { setError(''); setLoading(true); setAttempt((value) => value + 1); }} className="mt-3 underline">Thử lại</button></div>
              : result.data.length ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{result.data.map((item) => <ServiceCard key={item._id} service={item} />)}</div>
              : <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Không tìm thấy dịch vụ phù hợp.</p>}
            {!loading && !error && result.pagination.totalPages > 1 && <nav aria-label="Phân trang dịch vụ" className="flex justify-center items-center gap-4 text-sm">
              <button type="button" disabled={query.page <= 1} onClick={() => updateQuery({ page: query.page - 1 })} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40">Trang trước</button>
              <span>Trang {query.page} / {result.pagination.totalPages}</span>
              <button type="button" disabled={query.page >= result.pagination.totalPages} onClick={() => updateQuery({ page: query.page + 1 })} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40">Trang sau</button>
            </nav>}
          </section>
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Services;
