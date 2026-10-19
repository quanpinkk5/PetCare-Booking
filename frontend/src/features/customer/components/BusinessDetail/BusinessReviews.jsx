import { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';
import { businessApi } from '../../services/businessApi.js';

const reviewDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN');
};

const BusinessReviews = ({ businessId, onSummary }) => {
  const [query, setQuery] = useState({ page: 1, limit: 5, rating: '', sort: 'newest' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    businessApi.reviews(businessId, query).then((response) => {
      if (!cancelled) { setResult(response); onSummary(response.summary); }
    }).catch((err) => {
      if (!cancelled) setError(err.message || 'Không thể tải đánh giá.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [businessId, query, attempt, onSummary]);
  const changeQuery = (values) => {
    setLoading(true); setError('');
    setQuery((current) => ({ ...current, ...values }));
  };

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <h2 className="mb-5 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">Đánh giá khách hàng</h2>
      {result && <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex sm:items-center sm:gap-8">
        <div className="text-center shrink-0">
          <p className="text-4xl font-extrabold">{result.summary.totalReviews ? result.summary.averageRating.toFixed(1) : '—'}<span className="text-base font-normal text-slate-400"> / 5</span></p>
          <p className="mt-2 text-xs text-slate-500">{result.summary.totalReviews} đánh giá công khai</p>
        </div>
        <div className="mt-4 flex-1 space-y-2 sm:mt-0">
          {result.summary.distribution.map((item) => <div key={item.rating} className="flex items-center gap-3 text-xs text-slate-600">
            <span className="w-10">{item.rating} sao</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-amber-400" style={{ width: `${result.summary.totalReviews ? item.count / result.summary.totalReviews * 100 : 0}%` }} /></div>
            <span className="w-6 text-right">{item.count}</span>
          </div>)}
        </div>
      </div>}
      <div className="mb-5 flex flex-wrap items-center gap-4 text-xs">
        <label>Số sao
          <select value={query.rating} onChange={(e) => changeQuery({ rating: e.target.value, page: 1 })} className="ml-2 rounded-lg border border-slate-200 p-2">
            <option value="">Tất cả</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} sao</option>)}
          </select>
        </label>
        <label>Sắp xếp
          <select value={query.sort} onChange={(e) => changeQuery({ sort: e.target.value, page: 1 })} className="ml-2 rounded-lg border border-slate-200 p-2">
            <option value="newest">Mới nhất</option><option value="highest">Sao cao nhất</option><option value="lowest">Sao thấp nhất</option>
          </select>
        </label>
      </div>
      {loading ? <p role="status" className="p-8 text-center text-sm text-slate-500">Đang tải đánh giá...</p>
        : error ? <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700"><p>{error}</p><button type="button" onClick={() => { setError(''); setLoading(true); setAttempt((value) => value + 1); }} className="mt-2 underline">Thử lại</button></div>
        : result?.data.length ? <div className="space-y-4">{result.data.map((review) => <article key={review._id} className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {review.customer.avatar ? <img src={review.customer.avatar} alt={review.customer.fullName} className="h-10 w-10 rounded-full object-cover" /> : <User size={30} className="text-slate-400" />}
              <div><h3 className="text-xs font-bold text-slate-800">{review.customer.fullName}</h3>
                <div aria-label={`${review.rating} trên 5 sao`} className="mt-1 flex gap-0.5 text-amber-400">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill={star <= review.rating ? 'currentColor' : 'none'} />)}</div>
              </div>
            </div>
            <time dateTime={review.createdAt} className="text-[10px] text-slate-400">{reviewDate(review.createdAt)}</time>
          </div>
          {(review.service.name || review.branch.name) && <p className="mt-3 text-[11px] text-slate-500">{[review.service.name, review.branch.name].filter(Boolean).join(' · ')}</p>}
          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">{review.comment || 'Khách hàng chưa viết nhận xét.'}</p>
          {review.images.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.images.map((url, index) => <img key={index} src={url} alt={`Ảnh đánh giá ${index + 1}`} loading="lazy" className="h-20 w-20 rounded-lg object-cover" />)}</div>}
          {review.businessReply && <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <div className="flex justify-between gap-2 text-[11px] text-emerald-800"><span className="font-bold">Phản hồi từ cơ sở</span><time>{reviewDate(review.businessReply.repliedAt)}</time></div>
            <p className="mt-1 whitespace-pre-line text-xs text-slate-600">{review.businessReply.content}</p>
          </div>}
        </article>)}</div> : <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Chưa có đánh giá phù hợp.</p>}
      {!loading && !error && result?.pagination.totalPages > 1 && <nav aria-label="Phân trang đánh giá" className="mt-5 flex items-center justify-center gap-3 text-xs">
        <button type="button" disabled={query.page <= 1} onClick={() => changeQuery({ page: query.page - 1 })} className="rounded-lg border p-2 disabled:opacity-40">Trang trước</button>
        <span>Trang {query.page} / {result.pagination.totalPages}</span>
        <button type="button" disabled={query.page >= result.pagination.totalPages} onClick={() => changeQuery({ page: query.page + 1 })} className="rounded-lg border p-2 disabled:opacity-40">Trang sau</button>
      </nav>}
    </section>
  );
};

export default BusinessReviews;
