const mongoose = require('mongoose');
const Notification = require('../../models/Notification');
const Settings = require('../../models/BusinessNotificationSettings');
const shared = require('../customer/notificationsController');
const owner = (req) => ({ userId: req.user._id || req.user.id });
const fields = 'type title message referenceType referenceId isRead readAt createdAt priority branch detail metadata';

const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1), limit = Number(req.query.limit || 100);
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
      return res.status(400).json({ success: false, message: 'Phân trang không hợp lệ' });
    }
    const [data, total] = await Promise.all([
      Notification.find(owner(req)).select(fields).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Notification.countDocuments(owner(req)),
    ]);
    return res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};
const setRead = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || typeof req.body?.isRead !== 'boolean') return res.status(400).json({ success: false, message: 'ID hoặc trạng thái thông báo không hợp lệ' });
    const data = await Notification.findOneAndUpdate({ ...owner(req), _id: req.params.id },
      { $set: { isRead: req.body.isRead, readAt: req.body.isRead ? new Date() : null } }, { new: true }).select(fields).lean();
    if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    return res.json({ success: true, data });
  } catch (error) { next(error); }
};
const bulk = async (req, res, next, deleting) => {
  try {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || !ids.length || ids.length > 1000 || !ids.every((id) => typeof id === 'string' && mongoose.isValidObjectId(id))) {
      return res.status(400).json({ success: false, message: 'Cần chọn từ 1 đến 1000 mã thông báo hợp lệ' });
    }
    const filter = { ...owner(req), _id: { $in: [...new Set(ids)] } };
    const readAt = new Date();
    const result = deleting ? await Notification.deleteMany(filter)
      : await Notification.updateMany(filter, { $set: { isRead: true, readAt } });
    return res.json({ success: true, count: deleting ? result.deletedCount : result.modifiedCount, ...(deleting ? {} : { readAt }) });
  } catch (error) { next(error); }
};
const getSettings = async (req, res, next) => {
  try {
    const stored = await Settings.findOne(owner(req)).lean();
    return res.json({ success: true, data: Object.fromEntries(Object.entries(Settings.defaults).map(([key, value]) => [key, stored?.[key] ?? value])) });
  } catch (error) { next(error); }
};
const updateSettings = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== 'object' || !Object.keys(body).length ||
      Object.entries(body).some(([key, value]) => !Object.hasOwn(Settings.defaults, key) || typeof value !== 'boolean')) {
      return res.status(400).json({ success: false, message: 'Cấu hình thông báo không hợp lệ' });
    }
    const stored = await Settings.findOneAndUpdate(owner(req), { $set: body }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }).lean();
    return res.json({ success: true, data: Object.fromEntries(Object.entries(Settings.defaults).map(([key, value]) => [key, stored[key] ?? value])) });
  } catch (error) { next(error); }
};
module.exports = { list, setRead, remove: shared.remove, markAllRead: shared.markAllRead, clearRead: shared.clearRead,
  markMultipleRead: (req, res, next) => bulk(req, res, next, false),
  removeMultiple: (req, res, next) => bulk(req, res, next, true), getSettings, updateSettings };
