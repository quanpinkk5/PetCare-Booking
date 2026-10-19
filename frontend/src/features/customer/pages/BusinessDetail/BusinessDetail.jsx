import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { MapPin, PawPrint } from 'lucide-react';
import FacilityHero from '../../components/BusinessDetail/FacilityHero';
import InPageTabs from '../../components/BusinessDetail/InPageTabs';
import BookingSidebar from '../../components/BusinessDetail/BookingSidebar';
import { businessApi } from '../../services/businessApi.js';
import { formatAddress, imageUrl, servicePrice } from '../../services/businessData.js';

const BranchServices = ({ branch }) => {
  const [result, setResult] = useState({ loading: true, services: [], error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    businessApi.services(branch._id).then((response) => {
      if (!cancelled) setResult({ loading: false, services: response.data, error: '' });
    }).catch((error) => {
      if (!cancelled) setResult({ loading: false, services: [], error: error.message || 'Không thể tải dịch vụ.' });
    });
    return () => { cancelled = true; };
  }, [branch._id, attempt]);
  return (
    <section id="dich-vu" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-bold">Dịch vụ tại {branch.name}</h2>
      {result.loading ? <p role="status" className="text-sm text-slate-500">Đang tải dịch vụ...</p>
        : result.error ? <div role="alert" className="text-sm text-red-700"><p>{result.error}</p><button type="button" onClick={() => { setResult({ loading: true, services: [], error: '' }); setAttempt((value) => value + 1); }} className="mt-2 underline">Thử lại</button></div>
        : result.services.length ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.services.map((item) => {
            const image = imageUrl(item.service.images);
            return <article key={item._id} className="rounded-xl border border-slate-200 p-4">
              {image && <img src={image} alt={item.service.name} className="mb-3 h-32 w-full rounded-lg object-cover" />}
              <h3 className="text-sm font-semibold">{item.service.name}</h3>
              <p className="mt-2 text-sm font-bold text-emerald-700">{servicePrice(item)}</p>
              {item.durationMinutes > 0 && <p className="mt-1 text-xs text-slate-500">{item.durationMinutes} phút</p>}
              <p className="mt-2 text-xs text-slate-500">{item.petTypes?.map((type) => type === 'DOG' ? 'Chó' : 'Mèo').join(', ')}</p>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">{item.service.description || 'Chưa có mô tả dịch vụ.'}</p>
            </article>;
          })}
        </div> : <p className="text-sm text-slate-500">Chi nhánh chưa có dịch vụ được công bố.</p>}
    </section>
  );
};

const BusinessDetailContent = ({ id, initialBranchId }) => {
  const [result, setResult] = useState({ loading: true, business: null, branches: [], error: '' });
  const [selectedBranch, setSelectedBranch] = useState(initialBranchId);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all([businessApi.detail(id), businessApi.branches(id)]).then(([business, branches]) => {
      if (!cancelled) setResult({ loading: false, business: business.data, branches: branches.data, error: '' });
    }).catch((error) => {
      if (!cancelled) setResult({ loading: false, business: null, branches: [], error: error.message || 'Không thể tải thông tin cơ sở.' });
    });
    return () => { cancelled = true; };
  }, [id, attempt]);
  const { business, branches, loading, error } = result;
  const branch = branches.find((item) => item._id === selectedBranch) || branches[0];
  if (loading) return <p role="status" className="p-12 text-center text-slate-500">Đang tải thông tin cơ sở...</p>;
  if (error) return <div role="alert" className="mx-auto max-w-3xl p-12 text-center"><p className="text-red-700">{error}</p><button type="button" onClick={() => { setResult({ loading: true, business: null, branches: [], error: '' }); setAttempt((value) => value + 1); }} className="mt-4 text-emerald-700 underline">Thử lại</button><Link to="/businesses" className="ml-5 text-emerald-700 underline">Danh sách cơ sở</Link></div>;
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 text-slate-800">
      <nav className="mb-4 flex gap-2 text-xs text-slate-500"><Link to="/">Trang chủ</Link><span>/</span><Link to="/businesses">Cơ sở</Link><span>/</span><span>{business.name}</span></nav>
      <FacilityHero business={business} />
      <InPageTabs />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          <section id="tong-quan" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold">Hình ảnh cơ sở</h2>
            {business.images?.length ? <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{business.images.map((item, index) => {
              const url = imageUrl([item]);
              return url ? <img key={index} src={url} alt={business.name + ' - ' + (index + 1)} className="h-28 w-full rounded-xl object-cover" /> : null;
            })}</div> : <p className="text-sm text-slate-500">Cơ sở chưa cập nhật hình ảnh.</p>}
          </section>
          <section id="chi-nhanh" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Chi nhánh đang hoạt động ({branches.length})</h2>
            {branches.length ? <div className="space-y-3">{branches.map((item) => (
              <button type="button" key={item._id} onClick={() => setSelectedBranch(item._id)} aria-pressed={branch?._id === item._id}
                className={'w-full rounded-xl border p-4 text-left ' + (branch?._id === item._id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50')}>
                <span className="block text-sm font-semibold">{item.name}</span>
                <span className="mt-2 flex items-center gap-2 text-xs text-slate-600"><MapPin size={14} />{formatAddress(item.address) || 'Chưa cập nhật địa chỉ'}</span>
              </button>
            ))}</div> : <p className="text-sm text-slate-500">Cơ sở chưa có chi nhánh đang hoạt động.</p>}
          </section>
          {branch ? <BranchServices key={branch._id} branch={branch} /> : <section id="dich-vu" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500"><PawPrint size={20} className="mb-2" />Chưa có dịch vụ để hiển thị.</section>}
          <section id="danh-gia" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold">Đánh giá khách hàng</h2>
            <p className="text-sm text-slate-600">{business.totalReviews > 0 ? Number(business.averageRating || 0).toFixed(1) + ' / 5 từ ' + business.totalReviews + ' đánh giá.' : 'Chưa có đánh giá.'}</p>
            {business.totalReviews > 0 && <p className="mt-2 text-xs text-slate-500">Chi tiết đánh giá chưa được cung cấp.</p>}
          </section>
        </div>
        <BookingSidebar business={business} branch={branch} />
      </div>
    </main>
  );
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branch') || '';
  return <BusinessDetailContent key={`${id}:${branchId}`} id={id} initialBranchId={branchId} />;
};

export default BusinessDetail;
