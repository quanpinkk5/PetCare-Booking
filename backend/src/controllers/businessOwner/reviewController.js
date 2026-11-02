const mongoose = require('mongoose');
const Business = require('../../models/Business');
const Review = require('../../models/Review');

const populateReview = (query) => query
  .populate('customerId', 'fullName avatar')
  .populate('branchId', 'name')
  .populate('serviceId', 'name serviceType')
  .populate({ path: 'bookingId', select: 'bookingCode status petId', populate: { path: 'petId', select: 'name species breed' } });
const getBusiness = (req) => Business.findOne({ ownerId: req.user._id || req.user.id }).select('_id name').lean();
const safeReview = (review) => review.isAnonymous ? { ...review, customerId: null, bookingId: null } : review;

const getReviews = async (req, res, next) => {
  try {
    const business = await getBusiness(req);
    if (!business) return res.json({ success: true, business: null, data: [] });
    const reviews = await populateReview(Review.find({ businessId: business._id })
      .select('rating comment images status ownerHidden isAnonymous businessReply createdAt updatedAt customerId branchId serviceId bookingId'))
      .sort({ createdAt: -1, _id: -1 }).lean();
    return res.json({ success: true, business, data: reviews.map(safeReview) });
  } catch (error) { next(error); }
};

const validateBody = (body, field, type) => body && !Array.isArray(body) && typeof body === 'object'
  && Object.keys(body).length === 1 && Object.hasOwn(body, field) && typeof body[field] === type;

const updateReview = async (req, res, next, replying) => {
  try {
    const field = replying ? 'content' : 'hidden';
    if (!mongoose.isValidObjectId(req.params.id) || !validateBody(req.body, field, replying ? 'string' : 'boolean')
      || (replying && (!req.body.content.trim() || req.body.content.length > 3000))) {
      return res.status(400).json({ success: false, message: replying ? 'Phản hồi phải có từ 1 đến 3000 ký tự và mã đánh giá hợp lệ' : 'Dữ liệu ẩn đánh giá không hợp lệ' });
    }
    const business = await getBusiness(req);
    if (!business) return res.status(404).json({ success: false, message: 'Không tìm thấy doanh nghiệp của bạn' });
    const filter = { _id: req.params.id, businessId: business._id };
    if (replying) filter.status = 'VISIBLE';
    const update = replying ? {
      'businessReply.content': req.body.content.trim(), 'businessReply.repliedAt': new Date(),
      'businessReply.repliedBy': req.user._id || req.user.id,
    } : { ownerHidden: req.body.hidden };
    const review = await populateReview(Review.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after', runValidators: true })).lean();
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá được phép cập nhật' });
    return res.json({ success: true, business, data: safeReview(review) });
  } catch (error) { next(error); }
};
const replyReview = (req, res, next) => updateReview(req, res, next, true);
const hideReview = (req, res, next) => updateReview(req, res, next, false);

module.exports = { getReviews, replyReview, hideReview };
