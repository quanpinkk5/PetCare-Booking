const idOf = (value) => String(value?._id || value || '');
const dateText = (value, time = false) => value && !Number.isNaN(new Date(value).getTime())
  ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    ...(time ? { hour: '2-digit', minute: '2-digit' } : {}) }) : '—';
const defaultAvatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e2e8f0"/><circle cx="40" cy="28" r="14" fill="#94a3b8"/><path d="M12 80v-8a28 28 0 0156 0v8" fill="#94a3b8"/></svg>')}`;
export function ownerReviewData(review, business) {
  const pet = review.isAnonymous ? {} : review.bookingId?.petId || {};
  return {
    id: idOf(review), customer: review.isAnonymous ? 'Khách hàng ẩn danh' : review.customerId?.fullName || 'Khách hàng không còn khả dụng',
    avatar: (!review.isAnonymous && review.customerId?.avatar) || defaultAvatar,
    verified: !review.isAnonymous && review.bookingId?.status === 'COMPLETED',
    service: review.serviceId?.name || 'Dịch vụ không còn khả dụng', serviceType: review.serviceId?.serviceType === 'BOARDING' ? 'Boarding' : 'Appointment',
    branch: review.branchId?.name || 'Chi nhánh không còn khả dụng', branchId: idOf(review.branchId),
    date: dateText(review.createdAt), createdAt: review.createdAt, rating: review.rating,
    pet: { name: pet.name || '—', breed: pet.breed || '—', emoji: pet.species === 'CAT' ? '🐱' : pet.species === 'DOG' ? '🐶' : '🐾' },
    content: review.comment || '', images: review.images || [], hidden: Boolean(review.ownerHidden), status: review.status,
    reply: review.businessReply?.content ? { author: business?.name || 'Cơ sở', date: dateText(review.businessReply.repliedAt, true), content: review.businessReply.content } : null,
  };
}

export const REVIEW_FILTERS = [
  { label: 'Tất cả', value: 'all' }, { label: 'Chưa phản hồi', value: 'unreplied' },
  { label: '5 sao', value: '5' }, { label: '4 sao', value: '4' }, { label: '3 sao', value: '3' }, { label: 'Đánh giá thấp', value: 'low' },
];
export const matchesReviewRating = (review, filter) => filter === 'all'
  || (filter === 'unreplied' && !review.reply) || (filter === 'low' && review.rating <= 3) || String(review.rating) === filter;
export function filterOwnerReviews(reviews, { search = '', rating = 'all', branch = 'all', sort = 'newest' } = {}) {
  const keyword = search.trim().toLowerCase();
  return reviews.filter((r) => [r.customer, r.service, r.branch, r.content, r.pet.name].some((value) => value.toLowerCase().includes(keyword))
    && matchesReviewRating(r, rating) && (branch === 'all' || r.branchId === branch))
    .sort((a, b) => {
      const order = (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0) || b.id.localeCompare(a.id);
      return sort === 'newest' ? order : -order;
    });
}
const monthKey = (date) => {
  if (!date || Number.isNaN(new Date(date).getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric' }).formatToParts(new Date(date));
  return Number(parts.find((p) => p.type === 'year').value) * 12 + Number(parts.find((p) => p.type === 'month').value);
};
export function summarizeOwnerReviews(reviews, now = new Date()) {
  const visible = reviews.filter((r) => r.status === 'VISIBLE');
  const total = visible.length;
  const average = total ? visible.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const percent = (count) => total ? Math.round(count / total * 1000) / 10 : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars, index) => {
    const count = visible.filter((r) => r.rating === stars).length;
    return { stars, count, percent: percent(count), color: ['bg-emerald-500', 'bg-emerald-400', 'bg-amber-400', 'bg-orange-400', 'bg-rose-400'][index] };
  });
  const positive = visible.filter((r) => r.rating >= 4).length;
  const neutral = visible.filter((r) => r.rating === 3).length;
  const negative = total - positive - neutral;
  const sentiments = [
    { label: 'Tích cực (4-5★)', count: positive, percent: percent(positive), color: 'bg-emerald-500' },
    { label: 'Trung tính (3★)', count: neutral, percent: percent(neutral), color: 'bg-blue-500' },
    { label: 'Tiêu cực (1-2★)', count: negative, percent: percent(negative), color: 'bg-rose-500' },
  ];
  const currentMonth = monthKey(now);
  const fiveStars = (month) => visible.filter((r) => r.rating === 5 && monthKey(r.createdAt) === month).length;
  const current = fiveStars(currentMonth), previous = fiveStars(currentMonth - 1);
  const trend = previous ? `${current >= previous ? 'Tăng' : 'Giảm'} ${Math.abs((current - previous) / previous * 100).toFixed(1)}% đánh giá 5 sao so với tháng trước.`
    : `${current} đánh giá 5 sao tháng này; tháng trước chưa có đánh giá 5 sao.`;
  const metrics = [
    { title: 'Đánh giá trung bình', value: total ? average.toFixed(1) : '—', suffix: '/ 5.0', description: `Từ ${total} đánh giá công khai`, icon: 'star', color: 'amber' },
    { title: 'Tổng số đánh giá', value: total, suffix: 'lượt', description: `${reviews.length - total} đánh giá đã bị ẩn`, icon: 'messages', color: 'emerald' },
    { title: 'Chưa phản hồi', value: visible.filter((r) => !r.reply).length, suffix: 'đánh giá', description: 'Đánh giá công khai chưa có phản hồi', icon: 'message', color: 'blue' },
    { title: 'Độ hài lòng', value: total ? `${percent(positive)}%` : '—', description: `${positive}/${total} đánh giá đạt 4–5 sao`, icon: 'smile', color: 'teal' },
  ];
  return { total, average, distribution, sentiments, trend, metrics };
}
