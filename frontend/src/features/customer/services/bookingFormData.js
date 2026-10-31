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
  isMain: false, canBook: true,
  businessId: business._id, businessName: business.name,
  address: formatAddress(branch.address), phone: branch.phone || business.phone || 'Chưa cập nhật',
  rating: business.averageRating ?? 0, reviewsCount: business.totalReviews ?? 0,
  image: imageUrl(branch.images, imageUrl(business.images, business.logo || '')),
});

export const bookingLocations = (business, branches = []) => [{
  id: `business:${business._id}`, businessId: business._id, businessName: business.name,
  name: business.name, isMain: true, canBook: false,
  address: formatAddress(business.address) || 'Chưa cập nhật địa chỉ cơ sở chính',
  phone: business.phone || 'Chưa cập nhật',
  rating: business.averageRating ?? 0, reviewsCount: business.totalReviews ?? 0,
  image: imageUrl(business.images, business.logo || ''),
}, ...branches.map((branch) => bookingBranch(branch, business))];

export const initialBookingLocation = (locations, branchId) =>
  locations.find((location) => location.id === branchId) || locations[0] || null;

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

export const loadBookingBranches = async (api, { businessId, branchId } = {}) => {
  if (!businessId && branchId) {
    const response = await api.branch(branchId);
    businessId = response.data.businessId?._id || response.data.businessId;
    if (!businessId) throw new Error('Không xác định được cơ sở của chi nhánh đã chọn.');
  }
  if (businessId) {
    const [business, branches] = await Promise.all([api.detail(businessId), api.branches(businessId)]);
    const list = bookingLocations(business.data, branches.data);
    if (branchId && !list.some((branch) => branch.id === branchId)) {
      throw new Error('Chi nhánh đã chọn không thuộc cơ sở này hoặc không còn nhận đặt lịch.');
    }
    return list;
  }
  const businesses = [];
  let page = 1;
  let totalPages;
  do {
    const response = await api.list({ page, limit: 100 });
    businesses.push(...response.data);
    totalPages = response.pagination?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);
  return businesses.flatMap((business) => bookingLocations(business, business.branches));
};

export const bookingPayload = ({ pet, branch, service, date, time, checkOutDate, note, slots }) => {
  if (!pet || !branch || branch.canBook === false || !service || service.branchId !== branch.id
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
