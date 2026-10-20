export const homeReviewData = (review) => {
  const date = review.createdAt ? new Date(review.createdAt) : null;
  return {
    id: review._id,
    name: review.customer?.fullName || 'Khách hàng',
    img: review.customer?.avatar || '',
    review: review.comment || 'Khách hàng chưa viết nhận xét.',
    rating: Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 ? review.rating : 0,
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '',
    service: review.service?.name || 'Dịch vụ không còn tồn tại',
    businessName: review.business?.name || '',
    businessId: review.business?._id || '',
    verified: review.verified === true,
  };
};
