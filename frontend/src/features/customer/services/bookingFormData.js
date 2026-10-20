import { formatAddress, imageUrl, servicePrice } from './businessData.js';

export const vietnamToday = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

export const boardingDays = (start, end) => {
  const days = (Date.parse(end) - Date.parse(start)) / 86400000;
  return Number.isInteger(days) && days > 0 && days <= 90 ? days : 0;
};

export const bookingPet = (pet) => ({
  ...pet, id: pet._id, image: pet.avatar || '',
  breed: pet.breed || (pet.species === 'CAT' ? 'Mèo' : 'Chó'),
  gender: pet.gender === 'MALE' ? 'Đực' : pet.gender === 'FEMALE' ? 'Cái' : 'Chưa cập nhật',
  weight: pet.weight == null ? 'Chưa cập nhật cân nặng' : pet.weight + ' kg',
});

export const bookingBranch = (branch, business) => ({
  ...branch, id: branch._id, name: business.name + ' — ' + branch.name,
  address: formatAddress(branch.address), phone: branch.phone || business.phone || 'Chưa cập nhật',
  rating: business.averageRating ?? 0, reviewsCount: business.totalReviews ?? 0,
  image: imageUrl(branch.images, imageUrl(business.images, business.logo || '')),
});

export const bookingService = (offering) => ({
  ...offering, id: offering._id, name: offering.service.name,
  description: offering.service.description || '',
  bookingType: offering.service.serviceType, unitPrice: offering.price,
  price: servicePrice(offering),
});

export const eligibleServices = (offerings, pet) => offerings.filter((item) => {
  const type = item.service?.serviceType;
  return pet && item.petTypes?.includes(pet.species) && Number.isFinite(item.price) && item.price >= 0
    && Number.isInteger(item.capacity) && item.capacity > 0
    && ((type === 'APPOINTMENT' && item.pricingUnit === 'PER_SERVICE'
      && Number.isInteger(item.durationMinutes) && item.durationMinutes > 0)
      || (type === 'BOARDING' && item.pricingUnit === 'PER_DAY'));
}).map(bookingService);

export const loadBookingBranches = async (api) => {
  const businesses = [];
  let page = 1;
  let totalPages;
  do {
    const response = await api.list({ page, limit: 100 });
    businesses.push(...response.data);
    totalPages = response.pagination?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);
  return businesses.flatMap((business) => (business.branches || []).map((branch) => bookingBranch(branch, business)));
};

export const bookingPayload = ({ pet, branch, service, date, time, checkOutDate, note, slots }) => {
  if (!pet || !branch || !service || service.branchId !== branch.id
    || !service.petTypes?.includes(pet.species)) throw new Error('Vui lòng chọn thú cưng, cơ sở và dịch vụ phù hợp.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < vietnamToday()) throw new Error('Vui lòng chọn ngày hợp lệ.');
  const payload = { petId: pet.id, branchServiceId: service.id, customerNote: note.trim() };
  if (service.bookingType === 'BOARDING') {
    if (!boardingDays(date, checkOutDate)) throw new Error('Ngày trả phải sau ngày nhận, tối đa 90 ngày lưu trú.');
    return { ...payload, checkInDate: date, checkOutDate };
  }
  if (!slots.some((slot) => slot.startTime === time && slot.remainingCapacity > 0)) {
    throw new Error('Vui lòng chọn một khung giờ còn trống.');
  }
  return { ...payload, bookingDate: date, startTime: time };
};
