import { BookHeart, Utensils, Pill, Footprints, Scissors, Moon, HeartPulse, Sparkles } from "lucide-react";

export const DIARY_ACTIVITIES = [
  { id: "meal", label: "Ăn uống", icon: Utensils, iconBg: "bg-amber-100 text-amber-600", actionColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "med", label: "Uống thuốc", icon: Pill, iconBg: "bg-rose-100 text-rose-600", actionColor: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "exercise", label: "Vận động", icon: Footprints, iconBg: "bg-blue-100 text-blue-600", actionColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "grooming", label: "Grooming & Vệ sinh", icon: Scissors, iconBg: "bg-purple-100 text-purple-600", actionColor: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "rest", label: "Nghỉ ngơi", icon: Moon, iconBg: "bg-indigo-100 text-indigo-600", actionColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "health", label: "Kiểm tra sức khỏe", icon: HeartPulse, iconBg: "bg-emerald-100 text-emerald-600", actionColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "hygiene", label: "Vệ sinh & Tắm", icon: Sparkles, iconBg: "bg-purple-100 text-purple-600", actionColor: "bg-purple-50 text-purple-700 border-purple-200" },
];

const validDate = (value) => value && !Number.isNaN(new Date(value).getTime());
const formatDate = (value) => validDate(value) ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value)) : "—";
const formatTime = (value) => validDate(value) ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)) : "";

export const diaryLocalDateTime = (value = new Date()) => {
  if (!validDate(value)) return "";
  return new Date(new Date(value).getTime() + 7 * 3600000).toISOString().slice(0, 23);
};

export function diaryPayload({ activityType, description, activityTime, images = "" }) {
  if (!DIARY_ACTIVITIES.some((activity) => activity.id === activityType)) throw new Error("Vui lòng chọn loại hoạt động.");
  if (!description.trim() || description.trim().length > 3000) throw new Error("Nội dung nhật ký phải từ 1 đến 3000 ký tự.");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(activityTime) || !validDate(`${activityTime}+07:00`)) throw new Error("Ngày giờ hoạt động không hợp lệ.");
  const parsed = new Date(`${activityTime}+07:00`);
  if (diaryLocalDateTime(parsed).slice(0, activityTime.length) !== activityTime) throw new Error("Ngày giờ hoạt động không hợp lệ.");
  if (parsed.getTime() > Date.now()) throw new Error("Thời gian hoạt động không được ở tương lai.");
  const urls = images.split(/\r?\n/).map((image) => image.trim()).filter(Boolean);
  if (urls.length > 5 || urls.some((url) => url.length > 2048 || !/^https?:\/\/\S+$/i.test(url))) throw new Error("Chỉ đính kèm tối đa 5 URL ảnh HTTP/HTTPS hợp lệ.");
  return { activityType, description: description.trim(), activityTime: parsed.toISOString(), images: urls };
}

export function diaryTimeline(diaries = []) {
  return diaries.map((diary) => {
    const activity = DIARY_ACTIVITIES.find((item) => item.id === diary.activityType);
    const images = (diary.images || []).filter((url) => typeof url === "string" && /^https?:\/\//i.test(url));
    return { id: diary._id, type: activity?.label || diary.activityType || "Hoạt động", icon: activity?.icon || BookHeart,
      iconBg: activity?.iconBg || "bg-slate-100 text-slate-600", time: `${formatTime(diary.activityTime)} ${formatDate(diary.activityTime)}`,
      desc: diary.description || "", images,
      editData: { diaryId: diary._id, activityType: diary.activityType, activityTime: diary.activityTime, note: diary.description || "", images, photos: images.length },
      author: diary.createdBy?.fullName || diary.createdBy?.name || "" };
  });
}

export function diaryBookingToRow(booking) {
  const pet = booking.petId || {};
  const customer = booking.customerId || {};
  const diary = booking.latestDiary;
  const activity = DIARY_ACTIVITIES.find((item) => item.id === diary?.activityType);
  const details = booking.boardingDetails || {};
  const images = (diary?.images || []).filter((url) => typeof url === "string" && /^https?:\/\//i.test(url));
  const birth = pet.dateOfBirth && new Date(pet.dateOfBirth);
  const age = birth && !Number.isNaN(birth.getTime()) ? Math.max(0, Math.floor((Date.now() - birth.getTime()) / (365.25 * 86400000))) : null;
  return {
    id: booking._id, bookingId: booking._id, bookingCode: booking.bookingCode || booking._id,
    diaryId: diary?._id, activityType: diary?.activityType || "", activityTime: diary?.activityTime || "", images,
    name: pet.name || "Thú cưng", breed: pet.breed || (pet.species === "CAT" ? "Mèo" : pet.species === "DOG" ? "Chó" : "Chưa cập nhật"),
    age: age == null ? "Chưa rõ tuổi" : age > 0 ? `${age} tuổi` : "Dưới 1 tuổi", img: pet.avatar || "",
    weight: pet.weight == null ? "Chưa rõ cân nặng" : `${pet.weight} kg`, gender: pet.gender === "MALE" ? "♂" : pet.gender === "FEMALE" ? "♀" : "",
    owner: customer.fullName || "Khách hàng", phone: customer.phone || "—", room: details.roomName || details.room || "Chưa cập nhật phòng",
    roomCode: details.roomCode || "", branchName: booking.branchServiceId?.branchId?.name || "",
    checkin: formatDate(booking.checkInDate), checkinTime: formatTime(details.actualCheckInAt), checkout: formatDate(booking.checkOutDate), checkoutSub: "",
    careNote: [pet.careNotes, pet.feedingNotes, booking.customerNote, details.careNote || details.careNotes].filter(Boolean).join(" • "),
    status: booking.status === "IN_PROGRESS" ? "Đang lưu trú" : "Đã Check-out", statusCode: booking.status,
    statusBadge: booking.status === "IN_PROGRESS" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
    actionType: activity?.label || diary?.activityType || "Chưa có nhật ký", actionIcon: activity?.icon || BookHeart,
    actionColor: activity?.actionColor || "bg-slate-50 text-slate-600 border-slate-200",
    actionTime: diary ? `${formatTime(diary.activityTime)} - ${formatDate(diary.activityTime)}` : "—", note: diary?.description || "", photos: images.length,
  };
}
