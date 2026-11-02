import { formatAddress, openingHoursText } from './businessData.js';
import { petAge } from './petData.js';

const STATUS = { PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', IN_PROGRESS: 'Đang thực hiện', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy' };
const ACTIVITY = {
  EATING: ['Ăn uống', 'emerald'], WALKING: ['Đi dạo', 'blue'], SLEEPING: ['Nghỉ ngơi', 'purple'],
  PLAYING: ['Vui chơi', 'orange'], GROOMING: ['Chăm sóc, vệ sinh', 'purple'],
  MEDICATION: ['Dùng thuốc', 'slate'], HEALTH_CHECK: ['Kiểm tra sức khỏe', 'slate'], OTHER: ['Cập nhật chăm sóc', 'slate'],
};
const validDate = (value) => value && !Number.isNaN(new Date(value).getTime());
export function diaryDateKey(value) {
  if (!validDate(value)) return '';
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
const dateLabel = (value) => validDate(value) ? new Date(value).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Chưa cập nhật';
const timeLabel = (value) => validDate(value) ? new Date(value).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : '—';
const entryTime = (entry) => validDate(entry.activityTime) ? entry.activityTime : entry.createdAt;
const dayNumber = (key) => key ? Date.parse(`${key}T00:00:00Z`) / 86400000 : NaN;
const imageUrls = (images) => (Array.isArray(images) ? images : []).map((image) => typeof image === 'string' ? image : image?.url)
  .filter((url) => typeof url === 'string' && /^https?:\/\//i.test(url));

export function petDiaryData(booking, entries = [], selectedDate = '', now = new Date()) {
  const pet = booking.petId || {};
  const offering = booking.branchServiceId || {};
  const branch = offering.branchId || {};
  const availableDates = [...new Set([selectedDate, diaryDateKey(now), ...entries.map((entry) => diaryDateKey(entryTime(entry)))].filter(Boolean))].sort().reverse();
  const recordedDates = entries.map((entry) => diaryDateKey(entryTime(entry))).filter(Boolean).sort();
  const date = selectedDate || recordedDates.at(-1) || diaryDateKey(now);
  const daily = entries.filter((entry) => diaryDateKey(entryTime(entry)) === date)
    .sort((a, b) => new Date(entryTime(a)) - new Date(entryTime(b)) || String(a._id).localeCompare(String(b._id)));
  const activities = daily.map((entry) => {
    const type = String(entry.activityType || 'OTHER').toUpperCase();
    const [title, color] = ACTIVITY[type] || ACTIVITY.OTHER;
    return { id: entry._id, time: timeLabel(entryTime(entry)), type, tagLabel: title, title,
      desc: entry.description || '', color, images: imageUrls(entry.images) };
  });
  const photos = activities.flatMap((entry) => entry.images.map((url, index) => ({ id: `${entry.id}:${index}`, url, title: entry.title, time: entry.time })));
  const todayPhotos = [...new Map(photos.map((photo) => [photo.url, photo])).values()];
  const isBoarding = booking.bookingType === 'BOARDING';
  const totalDays = booking.numberOfDays || 0;
  const elapsed = dayNumber(date) - dayNumber(diaryDateKey(booking.checkInDate)) + 1;
  const latest = daily.at(-1);
  const businessId = String(branch.businessId?._id || branch.businessId || '');
  return {
    bookingId: booking.bookingCode || booking._id, bookingRecordId: booking._id, isBoarding,
    availableDates, selectedDate: date, dateLabel: dateLabel(`${date}T00:00:00+07:00`),
    messageUrl: businessId ? `/messages?businessId=${encodeURIComponent(businessId)}` : '',
    facility: { name: branch.name || 'Chi nhánh không còn tồn tại', address: formatAddress(branch.address) || 'Chưa cập nhật',
      phone: branch.phone || '', workingHours: openingHoursText(branch.openingHours).join('; '),
      status: STATUS[booking.status] || 'Chưa xác định',
      checkInTime: latest ? `${dateLabel(entryTime(latest))} - ${timeLabel(entryTime(latest))}` : 'Chưa có cập nhật', updateCount: daily.length },
    pet: { name: pet.name || 'Thú cưng không còn tồn tại', breed: pet.breed || 'Chưa cập nhật giống',
      genderSymbol: { MALE: '♂', FEMALE: '♀' }[pet.gender] || '', genderColor: pet.gender === 'FEMALE' ? 'text-pink-500' : 'text-blue-500',
      age: petAge(pet.dateOfBirth, now), weight: pet.weight != null ? `${pet.weight}kg` : 'Chưa cập nhật',
      service: offering.serviceId?.name || 'Dịch vụ không còn tồn tại',
      checkInDate: dateLabel(booking.checkInDate), checkOutDate: dateLabel(booking.checkOutDate), totalDays,
      currentDay: Number.isFinite(elapsed) && totalDays > 0 ? Math.max(0, Math.min(totalDays, elapsed)) : 0,
      appointmentDate: dateLabel(booking.bookingDate), appointmentTime: [booking.startTime, booking.endTime].filter(Boolean).join(' - ') || 'Chưa cập nhật',
      avatar: pet.avatar || '', careNotes: [booking.customerNote, pet.careNotes, pet.feedingNotes].filter(Boolean).join(' · ') || 'Không có ghi chú.',
      ownerRequests: booking.customerNote ? [booking.customerNote] : [] },
    activities, todayPhotos,
    summary: { meals: `${daily.filter((entry) => String(entry.activityType).toUpperCase() === 'EATING').length} bữa`,
      walks: `${daily.filter((entry) => String(entry.activityType).toUpperCase() === 'WALKING').length} lần`, photosCount: todayPhotos.length,
      latestUpdate: latest ? timeLabel(entryTime(latest)) : 'Chưa cập nhật' },
  };
}
