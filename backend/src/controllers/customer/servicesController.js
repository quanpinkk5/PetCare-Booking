const mongoose = require('mongoose');
const BranchService = require('../../models/BranchService');
const ServiceCategory = require('../../models/ServiceCategory');

const getCategories = async (_req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ status: 'ACTIVE' })
      .select('name code description icon').sort({ name: 1, _id: 1 }).lean();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) { next(error); }
};

const getServices = async (req, res, next) => {
  try {
    const { search = '', categoryId = '', petType = '', serviceType = '', sort = 'newest' } = req.query;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 8);
    const minPrice = req.query.minPrice === undefined || req.query.minPrice === '' ? null : Number(req.query.minPrice);
    const maxPrice = req.query.maxPrice === undefined || req.query.maxPrice === '' ? null : Number(req.query.maxPrice);
    const sorts = {
      newest: { _id: -1 }, priceAsc: { price: 1, _id: -1 },
      priceDesc: { price: -1, _id: -1 }, name: { 'service.name': 1, _id: -1 },
    };
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100 ||
        !Number.isSafeInteger((page - 1) * limit) ||
        typeof search !== 'string' || search.length > 200 ||
        typeof categoryId !== 'string' || (categoryId && !mongoose.isValidObjectId(categoryId)) ||
        typeof petType !== 'string' || !['', 'DOG', 'CAT'].includes(petType) ||
        typeof serviceType !== 'string' || !['', 'APPOINTMENT', 'BOARDING'].includes(serviceType) ||
        typeof sort !== 'string' || !Object.hasOwn(sorts, sort) ||
        [minPrice, maxPrice].some((value) => value !== null && (!Number.isFinite(value) || value < 0)) ||
        (minPrice !== null && maxPrice !== null && minPrice > maxPrice)) {
      return res.status(400).json({ success: false, message: 'Bộ lọc hoặc phân trang dịch vụ không hợp lệ' });
    }

    const offeringFilter = { status: 'ACTIVE' };
    if (petType) offeringFilter.petTypes = petType;
    if (minPrice !== null || maxPrice !== null) {
      offeringFilter.price = {};
      if (minPrice !== null) offeringFilter.price.$gte = minPrice;
      if (maxPrice !== null) offeringFilter.price.$lte = maxPrice;
    }
    const serviceFilter = { 'service.status': 'ACTIVE' };
    if (categoryId) serviceFilter['service.categoryId'] = new mongoose.Types.ObjectId(categoryId);
    if (serviceType) serviceFilter['service.serviceType'] = serviceType;

    const pipeline = [
      { $match: offeringFilter },
      { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $match: serviceFilter },
      { $lookup: { from: 'branches', localField: 'branchId', foreignField: '_id', as: 'branch' } },
      { $unwind: '$branch' },
      { $match: { 'branch.status': 'ACTIVE', $expr: { $eq: ['$branch.businessId', '$service.businessId'] } } },
      { $lookup: { from: 'businesses', localField: 'branch.businessId', foreignField: '_id', as: 'business' } },
      { $unwind: '$business' },
      { $match: { 'business.status': 'APPROVED' } },
      { $lookup: { from: 'serviceCategories', localField: 'service.categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $match: { $or: [{ 'service.categoryId': null }, { 'category.status': 'ACTIVE' }] } },
    ];
    if (search.trim()) {
      const regex = { $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      pipeline.push({ $match: { $or: ['service.name', 'service.description', 'business.name', 'branch.name'].map((field) => ({ [field]: regex })) } });
    }
    pipeline.push({ $facet: {
      data: [
        { $sort: sorts[sort] }, { $skip: (page - 1) * limit }, { $limit: limit },
        { $project: {
          _id: 1, price: 1, pricingUnit: 1, durationMinutes: 1, petTypes: 1,
          'service._id': 1, 'service.name': 1, 'service.description': 1, 'service.images': 1, 'service.serviceType': 1,
          'branch._id': 1, 'branch.name': 1, 'branch.address': 1,
          'business._id': 1, 'business.name': 1,
          'category._id': 1, 'category.name': 1,
        } },
      ],
      count: [{ $count: 'total' }],
    } });
    const [result] = await BranchService.aggregate(pipeline);
    const total = result?.count[0]?.total || 0;
    return res.status(200).json({ success: true, data: result?.data || [], pagination: {
      page, limit, total, totalPages: Math.ceil(total / limit),
    } });
  } catch (error) { next(error); }
};

module.exports = { getCategories, getServices };
