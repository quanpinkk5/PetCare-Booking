const Review = require("../../models/Review");
const Business = require('../../models/Business');
const mongoose = require('mongoose');

// GET /api/businesses/:id/reviews
const getBusinessReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);
    const rating = Number(req.query.rating ?? 0);
    const sort = req.query.sort ?? 'newest';
    const sorts = {
      newest: { createdAt: -1, _id: -1 },
      highest: { rating: -1, createdAt: -1, _id: -1 },
      lowest: { rating: 1, createdAt: -1, _id: -1 },
    };
    if (!mongoose.isValidObjectId(id) || !Number.isSafeInteger(page) || page < 1 ||
        !Number.isInteger(limit) || limit < 1 || limit > 50 ||
        !Number.isSafeInteger((page - 1) * limit) || !Number.isInteger(rating) || rating < 0 || rating > 5 ||
        typeof sort !== 'string' || !Object.hasOwn(sorts, sort)) {
      return res.status(400).json({ success: false, message: 'Cơ sở, bộ lọc hoặc phân trang đánh giá không hợp lệ' });
    }
    const business = await Business.findOne({ _id: id, status: 'APPROVED' }).select('_id').lean();
    if (!business) return res.status(404).json({ success: false, message: 'Không tìm thấy cơ sở' });
    const filter = { businessId: business._id, status: 'VISIBLE' };
    if (rating) filter.rating = rating;
    const [reviews, total, counts] = await Promise.all([
      Review.find(filter).select('rating comment images createdAt customerId branchId serviceId isAnonymous businessReply.content businessReply.repliedAt')
        .populate('customerId', 'fullName avatar').populate('branchId', 'name').populate('serviceId', 'name')
        .sort(sorts[sort]).skip((page - 1) * limit).limit(limit).lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(id), status: 'VISIBLE' } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
      ]),
    ]);
    const distribution = [5, 4, 3, 2, 1].map((value) => ({ rating: value, count: counts.find((item) => item._id === value)?.count || 0 }));
    const totalReviews = distribution.reduce((sum, item) => sum + item.count, 0);
    const averageRating = totalReviews
      ? Math.round(distribution.reduce((sum, item) => sum + item.rating * item.count, 0) / totalReviews * 10) / 10 : 0;
    return res.status(200).json({ success: true,
      data: reviews.map((review) => ({
        _id: review._id, rating: review.rating, comment: review.comment,
        images: review.images || [], createdAt: review.createdAt,
        customer: review.isAnonymous ? { fullName: 'Khách hàng ẩn danh', avatar: '' } : { fullName: review.customerId?.fullName || 'Khách hàng', avatar: review.customerId?.avatar || '' },
        branch: { name: review.branchId?.name || '' }, service: { name: review.serviceId?.name || '' },
        businessReply: review.businessReply?.content ? { content: review.businessReply.content, repliedAt: review.businessReply.repliedAt } : null,
      })),
      summary: { averageRating, totalReviews, distribution },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
};

// ============================================
// LẤY TẤT CẢ ĐÁNH GIÁ CÔNG KHAI
// GET /api/reviews
// ============================================

const getAllReviews = async (req, res, next) => {
  try {
    // Chỉ lấy các đánh giá đang hiển thị
    const reviews = await Review.find({
      status: "VISIBLE",
    })
      .populate("customerId", "fullName avatar")
      .populate("businessId", "name logo")
      .populate("branchId", "name address")
      .populate("serviceId", "name serviceType")
      .populate("businessReply.repliedBy", "fullName avatar")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đánh giá thành công",
      total: reviews.length,
      data: reviews.map((review) => review.isAnonymous ? { ...review, customerId: null } : review),
    });
  } catch (error) {
    next(error);
  }
};

// Three latest public reviews from completed bookings at approved businesses.
const getFeaturedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.aggregate([
      { $match: { status: 'VISIBLE' } },
      { $sort: { createdAt: -1, _id: -1 } },
      { $lookup: {
        from: 'businesses', localField: 'businessId', foreignField: '_id',
        pipeline: [{ $match: { status: 'APPROVED' } }, { $project: { name: 1 } }], as: 'business',
      } },
      { $unwind: '$business' },
      { $lookup: {
        from: 'bookings', let: { bookingId: '$bookingId', customerId: '$customerId' },
        pipeline: [{ $match: { status: 'COMPLETED', $expr: { $and: [
          { $eq: ['$_id', '$$bookingId'] }, { $eq: ['$customerId', '$$customerId'] },
        ] } } }, { $project: { _id: 1 } }], as: 'booking',
      } },
      { $unwind: '$booking' },
      { $limit: 3 },
      { $lookup: {
        from: 'users', localField: 'customerId', foreignField: '_id',
        pipeline: [{ $project: { _id: 0, fullName: 1, avatar: 1 } }], as: 'customer',
      } },
      { $lookup: {
        from: 'services', localField: 'serviceId', foreignField: '_id',
        pipeline: [{ $project: { _id: 0, name: 1 } }], as: 'service',
      } },
      { $project: {
        _id: 1, rating: 1, comment: 1, createdAt: 1,
        business: 1, service: { $arrayElemAt: ['$service', 0] },
        customer: { $cond: ['$isAnonymous', { fullName: 'Khách hàng ẩn danh', avatar: '' },
          { $arrayElemAt: ['$customer', 0] }] },
      } },
    ]);
    return res.status(200).json({ success: true, data: reviews.map((review) => ({
      _id: review._id, rating: review.rating, comment: review.comment || '', createdAt: review.createdAt,
      customer: { fullName: review.customer?.fullName || 'Khách hàng', avatar: review.customer?.avatar || '' },
      service: { name: review.service?.name || '' },
      business: { _id: review.business._id, name: review.business.name }, verified: true,
    })) });
  } catch (error) { next(error); }
};

module.exports = {
  getFeaturedReviews,
  getAllReviews,
  getBusinessReviews,
};
