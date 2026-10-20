export const formatAddress = (address) => {
  if (typeof address === 'string') return address.trim();
  if (!address || typeof address !== 'object') return '';
  return ['detail', 'ward', 'district', 'province'].map((field) => address[field])
    .filter((value) => typeof value === 'string' && value.trim()).join(', ');
};

export const imageUrl = (images, fallback = '') => {
  if (!Array.isArray(images)) return fallback;
  for (const image of images) {
    const url = typeof image === 'string' ? image : image?.url;
    if (typeof url === 'string' && url) return url;
  }
  return fallback;
};

export const servicePrice = (service) => {
  if (typeof service.price !== 'number' || !Number.isFinite(service.price)) return 'Liên hệ cơ sở';
  return `${service.price.toLocaleString('vi-VN')} ₫${service.pricingUnit === 'PER_DAY' ? ' / ngày' : ' / dịch vụ'}`;
};

export const openingHoursText = (hours) => {
  if (!Array.isArray(hours) || !hours.length) return ['Chưa cập nhật giờ mở cửa'];
  const lines = hours.map((item) => {
    if (typeof item === 'string') return item;
    if (!item || typeof item !== 'object') return '';
    const day = item.day || item.dayOfWeek || '';
    const open = item.openTime || item.open || '';
    const close = item.closeTime || item.close || '';
    if (item.isClosed || item.closed) return `${day}: Đóng cửa`;
    return typeof open === 'string' && typeof close === 'string' && open && close
      ? `${day ? day + ': ' : ''}${open} - ${close}` : '';
  }).filter(Boolean);
  return lines.length ? lines : ['Chưa cập nhật giờ mở cửa'];
};
