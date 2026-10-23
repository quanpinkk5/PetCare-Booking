import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  MapPin,
  PawPrint,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  ChevronRight,
  Building2,
  Images,
  Scissors,
} from 'lucide-react';
import FacilityHero from '../../components/BusinessDetail/FacilityHero';
import InPageTabs from '../../components/BusinessDetail/InPageTabs';
import BookingSidebar from '../../components/BusinessDetail/BookingSidebar';
import { businessApi } from '../../services/businessApi.js';
import { formatAddress, imageUrl, servicePrice, openingHoursText } from '../../services/businessData.js';
import BusinessReviews from '../../components/BusinessDetail/BusinessReviews';


const VALID_TABS = ['tong-quan', 'chi-nhanh', 'dich-vu', 'danh-gia'];

const BranchServices = ({ branch }) => {
  const [result, setResult] = useState({ loading: true, services: [], error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    businessApi
      .services(branch._id)
      .then((response) => {
        if (!cancelled) {
          const list = response.data;
          setResult({ loading: false, services: list, error: '' });
        }
      })
      .catch((error) => {
        if (!cancelled) setResult({ loading: false, services: [], error: error.message || 'Không thể tải dịch vụ.' });
      });
    return () => {
      cancelled = true;
    };
  }, [branch._id, attempt]);

  return (
    <div className="space-y-4">
      {result.loading ? (
        <div role="status" className="p-8 text-center text-sm text-slate-500">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-2" />
          <p>Đang tải danh sách dịch vụ...</p>
        </div>
      ) : result.error ? (
        <div role="alert" className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
          <p>{result.error}</p>
          <button type="button" onClick={() => { setResult({ loading: true, services: [], error: '' }); setAttempt((value) => value + 1); }} className="mt-2 underline">Thử lại</button>
        </div>
      ) : result.services.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.services.map((item) => {
            const svc = item.service || item;
            const image = imageUrl(svc.images);
            const name = svc.name || 'Dịch vụ chăm sóc';
            const desc = svc.description || 'Chưa có mô tả chi tiết cho dịch vụ này.';

            return (
              <article
                key={item._id}
                className="group rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {image ? (
                    <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.durationMinutes > 0 && (
                        <span className="absolute bottom-2 right-2 rounded-lg bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[11px] font-medium text-white">
                          {item.durationMinutes} phút
                        </span>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {name}
                    </h3>
                  </div>

                  <p className="mt-1 text-base font-extrabold text-emerald-700">
                    {servicePrice(item)}
                  </p>

                  {item.petTypes?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.petTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                        >
                          {type === 'DOG' ? 'Dành cho Chó' : type === 'CAT' ? 'Dành cho Mèo' : type}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Giá theo chi nhánh</span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('quick-book')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Liên hệ tư vấn <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <PawPrint size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700">Chi nhánh chưa có dịch vụ nào được công bố</p>
          <p className="text-xs text-slate-400 mt-1">Vui lòng chọn chi nhánh khác hoặc liên hệ hotline để được hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

const BusinessDetailContent = ({ id, initialBranchId }) => {
  const [result, setResult] = useState({ loading: true, business: null, branches: [], error: '' });
  const [reviewSummary, setReviewSummary] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [attempt, setAttempt] = useState(0);

  const selectedBranch = searchParams.get('branch') || initialBranchId;
  const tabParam = searchParams.get('tab') || location.hash.replace('#', '');
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : 'tong-quan';
  const handleTabChange = (newTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', newTab);
    setSearchParams(next);
  };
  const handleBranchChange = (branchId, tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('branch', branchId);
    next.set('tab', tab || activeTab);
    setSearchParams(next);
  };

  useEffect(() => {
    let cancelled = false;

    Promise.all([businessApi.detail(id), businessApi.branches(id)])
      .then(([businessRes, branchesRes]) => {
        if (!cancelled) {
          const biz = businessRes?.data;
          const branchList = branchesRes?.data || [];
          setResult({ loading: false, business: biz, branches: branchList, error: '' });
        }
      })
      .catch((error) => {
        if (!cancelled) setResult({ loading: false, business: null, branches: [], error: error.message || 'Không thể tải thông tin cơ sở.' });
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const { business, branches, loading, error } = result;
  const branch = branches.find((item) => item._id === selectedBranch) || branches[0];

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent mb-3" />
        <p className="text-sm font-medium">Đang tải thông tin cơ sở...</p>
      </main>
    );
  }

  if (error || !business) {
    return (
      <main className="mx-auto max-w-3xl p-12 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-700">{error || 'Không tìm thấy cơ sở.'}</p>
          <div className="mt-4 flex justify-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setResult({ loading: true, business: null, branches: [], error: '' });
                setAttempt((v) => v + 1);
              }}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              Thử lại
            </button>
            <Link to="/businesses" className="text-emerald-700 hover:underline">
              Về danh sách cơ sở
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalReviewsCount = reviewSummary?.totalReviews ?? business.totalReviews ?? 0;
  const displayBusiness = reviewSummary ? { ...business, ...reviewSummary } : business;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 text-slate-800">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-emerald-600 transition-colors">
          Trang chủ
        </Link>
        <span className="text-slate-300">/</span>
        <Link to="/businesses" className="hover:text-emerald-600 transition-colors">
          Cơ sở
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">{business.name}</span>
      </nav>

      {/* Facility Hero */}
      <FacilityHero business={displayBusiness} />

      {/* In-Page Tabs */}
      <InPageTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        branchesCount={branches.length}
        reviewsCount={totalReviewsCount}
      />

      {/* Main Grid: Left tab content, Right booking sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="lg:col-span-8 space-y-5">

          {/* ==================== TAB 1: TỔNG QUAN ==================== */}
          {activeTab === 'tong-quan' && (
            <div className="space-y-5">
              {/* Giới thiệu */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Giới thiệu về {business.name}</h2>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Đã kiểm duyệt
                  </span>
                </div>

                <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
                  {business.description ||
                    'Cơ sở chưa cập nhật phần giới thiệu.'}
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3"><p className="text-xs text-slate-500">Chi nhánh hoạt động</p><p className="mt-1 text-lg font-bold text-emerald-700">{branches.length}</p></div>
                  <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-500">Đánh giá khách hàng</p><p className="mt-1 text-lg font-bold text-slate-800">{totalReviewsCount}</p></div>
                </div>
              </section>

              {/* Hình ảnh */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900">Hình ảnh cơ sở</h2>
                  </div>
                  <span className="text-xs text-slate-500">
                    {business.images?.length || 0} hình ảnh
                  </span>
                </div>

                {business.images?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {business.images.map((item, index) => {
                      const url = imageUrl([item]);
                      return url ? (
                        <div key={index} className="group relative h-32 sm:h-36 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          <img
                            src={url}
                            alt={`${business.name} - ${index + 1}`}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">Cơ sở chưa cập nhật thêm hình ảnh giới thiệu.</p>
                )}
              </section>

              {/* Liên kết điều hướng nhanh đến Chi nhánh & Dịch vụ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTabChange('chi-nhanh')}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        Xem chi nhánh ({branches.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">Khám phá địa chỉ gần bạn nhất</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('dich-vu')}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        Bảng giá dịch vụ
                      </h4>
                      <p className="text-[11px] text-slate-500">Tắm, Spa, Grooming & Lưu trú</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: CHI NHÁNH ==================== */}
          {activeTab === 'chi-nhanh' && (
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Chi nhánh đang hoạt động ({branches.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn chi nhánh để xem danh sách dịch vụ và thông tin đặt lịch
                  </p>
                </div>
              </div>

              {branches.length ? (
                <div className="space-y-3.5">
                  {branches.map((item) => {
                    const isSelected = branch?._id === item._id;
                    return (
                      <div
                        key={item._id}
                        className={`rounded-2xl border p-4.5 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                  <CheckCircle2 size={11} /> Đang chọn
                                </span>
                              )}
                            </div>

                            <p className="flex items-start gap-1.5 text-xs text-slate-600">
                              <MapPin size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                              <span>{formatAddress(item.address) || 'Chưa cập nhật địa chỉ'}</span>
                            </p>

                            {item.phone && (
                              <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Phone size={14} className="text-emerald-600 shrink-0" />
                                <span>{item.phone}</span>
                              </p>
                            )}

                            {item.openingHours && (
                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={14} className="text-slate-400 shrink-0" />
                                <span>{openingHoursText(item.openingHours).join(' • ')}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {!isSelected ? (
                              <button
                                type="button"
                                onClick={() => handleBranchChange(item._id)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                              >
                                Chọn chi nhánh
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => {
                                handleBranchChange(item._id, 'dich-vu');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>Xem dịch vụ</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Building2 size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">Cơ sở chưa có chi nhánh đang hoạt động</p>
                </div>
              )}
            </section>
          )}

          {/* ==================== TAB 3: DỊCH VỤ ==================== */}
          {activeTab === 'dich-vu' && (
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              {/* Branch Selector Switcher */}
              <div className="mb-5 pb-4 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Bảng giá dịch vụ
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dịch vụ cung cấp tại chi nhánh: <span className="font-semibold text-slate-800">{branch?.name || 'Chi nhánh mặc định'}</span>
                    </p>
                  </div>

                  {branches.length > 1 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-medium">Đổi chi nhánh:</span>
                      <select
                        value={branch?._id || ''}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                      >
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {branch ? (
                <BranchServices key={branch._id} branch={branch} />
              ) : (
                <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <PawPrint size={32} className="mx-auto text-slate-300 mb-2" />
                  <p>Vui lòng chọn một chi nhánh để xem danh sách dịch vụ.</p>
                </div>
              )}
            </section>
          )}

          {/* ==================== TAB 4: ĐÁNH GIÁ ==================== */}
          {activeTab === 'danh-gia' && (
            <BusinessReviews businessId={id} onSummary={setReviewSummary} />
          )}

        </div>

        {/* Right column: Sticky BookingSidebar */}
        <BookingSidebar business={business} branch={branch} bookingBranchId={selectedBranch} />
      </div>
    </main>
  );
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branch') || '';
  return <BusinessDetailContent key={id} id={id} initialBranchId={branchId} />;
};

export default BusinessDetail;
