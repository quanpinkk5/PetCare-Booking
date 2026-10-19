const mongoose = require('mongoose');
const Review = require('../../models/Review');
const Booking = require('../../models/Booking');
const BranchService = require('../../models/BranchService');
const Branch = require('../../models/Branch');
const Service = require('../../models/Service');
const Business = require('../../models/Business');
require('../../models/Pet');

const invalid = (message) => Object.assign(new Error(message), { status: 400 });
const validate = (body, creating = false) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('Dữ liệu đánh giá không hợp lệ');
  const allowed = ['rating', 'comment', 'images', 'subRatings', 'tags', 'isAnonymous', ...(creating ? ['bookingId'] : [])];
  if (!Object.keys(body).length || Object.keys(body).some((field) => !allowed.includes(field))) throw invalid('Có trường thông tin không được phép gửi');
  const data = {};
  if (creating || body.rating !== undefined) {
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) throw invalid('Số sao phải là số nguyên từ 1 đến 5');
    data.rating = body.rating;
  }
  if (body.comment !== undefined) {
    if (typeof body.comment !== 'string' || body.comment.length > 3000) throw invalid('Nội dung đánh giá tối đa 3000 ký tự');
    data.comment = body.comment.trim();
  }
  if (body.images !== undefined) {
    if (!Array.isArray(body.images) || body.images.length > 4 || !body.images.every((image) => typeof image === 'string' && /^https?:\/\/\S+$/.test(image) && image.length <= 2048)) throw invalid('Tối đa 4 ảnh với đường dẫn HTTP(S) hợp lệ');
    data.images = body.images;
  }
  if (body.subRatings !== undefined) {
    const sub = body.subRatings;
    if (!sub || typeof sub !== 'object' || Array.isArray(sub) || Object.keys(sub).some((key) => !['cleanliness', 'staff', 'care', 'price'].includes(key) || !Number.isInteger(sub[key]) || sub[key] < 1 || sub[key] > 5)) throw invalid('Điểm chi tiết phải từ 1 đến 5');
    data.subRatings = sub;
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.length > 5 || !body.tags.every((tag) => typeof tag === 'string' && tag.trim() && tag.length <= 100)) throw invalid('Tối đa 5 nhãn, mỗi nhãn tối đa 100 ký tự');
    data.tags = [...new Set(body.tags.map((tag) => tag.trim()))];
  }
  if (body.isAnonymous !== undefined) {
    if (typeof body.isAnonymous !== 'boolean') throw invalid('Trạng thái ẩn danh không hợp lệ');
    data.isAnonymous = body.isAnonymous;
  }
  return data;
};
const handleError = (error, res, next) => {
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'Lịch đặt này đã được đánh giá' });
  if (error.status === 400 || ['ValidationError', 'CastError'].includes(error.name)) return res.status(400).json({ success: false, message: error.status ? error.message : 'Thông tin đánh giá không hợp lệ' });
  next(error);
};

const createReview = async (req, res, next) => {
  try {
    const data = validate(req.body, true);
    const customerId = req.user._id || req.user.id;
    const { bookingId } = req.body;
    if (typeof bookingId !== 'string' || !mongoose.isValidObjectId(bookingId)) throw invalid('Mã lịch đặt không hợp lệ');
    const booking = await Booking.findOne({ _id: bookingId, customerId }).lean();
    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch đặt của bạn' });
    if (booking.status !== 'COMPLETED') throw invalid('Chỉ được đánh giá lịch đặt đã hoàn thành');
    if (await Review.findOne({ bookingId }).lean()) return res.status(409).json({ success: false, message: 'Lịch đặt này đã được đánh giá' });
    const offering = await BranchService.findById(booking.branchServiceId).lean();
    const branch = offering && await Branch.findById(offering.branchId).lean();
    const business = branch && await Business.findById(branch.businessId).lean();
    const service = business && await Service.findOne({ _id: offering.serviceId, businessId: business._id }).lean();
    if (!service) return res.status(404).json({ success: false, message: 'Không còn thông tin cơ sở hoặc dịch vụ của lịch đặt' });
    const review = await Review.create({ ...data, bookingId: booking._id, customerId, businessId: business._id, branchId: branch._id, serviceId: service._id, status: 'VISIBLE' });
    return res.status(201).json({ success: true, message: 'Đánh giá dịch vụ thành công', data: review });
  } catch (error) { handleError(error, res, next); }
};
const updateReview = async (req, res, next) => {
  try {
    const data = validate(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) throw invalid('Mã đánh giá không hợp lệ');
    const review = await Review.findOneAndUpdate({ _id: req.params.id, customerId: req.user._id || req.user.id, status: 'VISIBLE' }, { $set: data }, { returnDocument: 'after', runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá được phép cập nhật' });
    return res.status(200).json({ success: true, message: 'Cập nhật đánh giá thành công', data: review });
  } catch (error) { handleError(error, res, next); }
};
const deleteReview = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw invalid('Mã đánh giá không hợp lệ');
    const review = await Review.findOneAndUpdate({ _id: req.params.id, customerId: req.user._id || req.user.id, status: 'VISIBLE' }, { $set: { status: 'HIDDEN' } }, { returnDocument: 'after', runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá có thể xóa của bạn' });
    return res.status(200).json({ success: true, message: 'Xóa đánh giá thành công', data: { _id: review._id, status: review.status } });
  } catch (error) { handleError(error, res, next); }
};
const getMyReviews = async (req, res, next) => {
  try {
    const customerId = req.user._id || req.user.id;
    const reviews = await Review.find({ customerId, status: 'VISIBLE' }).select('+likedBy')
      .populate({ path: 'bookingId', select: 'bookingCode bookingType bookingDate checkInDate checkOutDate totalPrice petId updatedAt', populate: { path: 'petId', select: 'name breed gender avatar' } })
      .populate('businessId', 'name logo').populate('branchId', 'name address').populate('serviceId', 'name description serviceType')
      .sort({ createdAt: -1, _id: -1 }).lean();
    return res.status(200).json({ success: true, data: reviews.map(({ likedBy = [], ...review }) => ({ ...review, likesCount: likedBy.length, isLiked: likedBy.some((id) => String(id) === String(customerId)) })), total: reviews.length });
  } catch (error) { next(error); }
};
const getPendingReviews = async (req, res, next) => {
  try {
    const customerId = req.user._id || req.user.id;
    // Include hidden reviews in this exclusion: one booking cannot receive a second review.
    const reviewed = await Review.find({ customerId }).select('bookingId').lean();
    const bookings = await Booking.find({ customerId, status: 'COMPLETED', _id: { $nin: reviewed.map((review) => review.bookingId) } })
      .populate('petId', 'name breed gender avatar')
      .populate({ path: 'branchServiceId', select: 'branchId serviceId', populate: [
        { path: 'branchId', select: 'name address businessId', populate: { path: 'businessId', select: 'name logo' } },
        { path: 'serviceId', select: 'name description' },
      ] }).sort({ updatedAt: -1, _id: -1 }).lean();
    return res.status(200).json({ success: true, data: bookings, total: bookings.length });
  } catch (error) { next(error); }
};
const setHelpful = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || typeof req.body?.liked !== 'boolean') throw invalid('Yêu cầu đánh dấu hữu ích không hợp lệ');
    const customerId = req.user._id || req.user.id;
    const update = req.body.liked ? { $addToSet: { likedBy: customerId } } : { $pull: { likedBy: customerId } };
    const review = await Review.findOneAndUpdate({ _id: req.params.id, customerId, status: 'VISIBLE' }, update, { returnDocument: 'after' }).select('+likedBy').lean();
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá của bạn' });
    const likes = review.likedBy || [];
    return res.status(200).json({ success: true, data: { _id: review._id, likesCount: likes.length, isLiked: likes.some((id) => String(id) === String(customerId)) } });
  } catch (error) { handleError(error, res, next); }
};
module.exports = { createReview, updateReview, deleteReview, getMyReviews, getPendingReviews, setHelpful };
