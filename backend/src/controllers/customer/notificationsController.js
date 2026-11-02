const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

const owner = (req) => ({ userId: req.user._id || req.user.id });
const fields = 'type title message referenceType referenceId isRead readAt createdAt';

const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 100);
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
      return res.status(400).json({ success: false, message: 'Phân trang không hợp lệ.' });
    }
    const filter = owner(req);
    const [data, total] = await Promise.all([
      Notification.find(filter).select(fields).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

const setRead = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || typeof req.body?.isRead !== 'boolean') {
      return res.status(400).json({ success: false, message: 'ID hoặc trạng thái thông báo không hợp lệ.' });
    }
    const data = await Notification.findOneAndUpdate(
      { ...owner(req), _id: req.params.id },
      { $set: { isRead: req.body.isRead, readAt: req.body.isRead ? new Date() : null } },
      { new: true },
    ).select(fields).lean();
    if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo.' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ ...owner(req), isRead: { $ne: true } }, { $set: { isRead: true, readAt: new Date() } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID thông báo không hợp lệ.' });
    }
    const data = await Notification.findOneAndDelete({ ...owner(req), _id: req.params.id });
    if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo.' });
    res.json({ success: true });
  } catch (error) { next(error); }
};

const clearRead = async (req, res, next) => {
  try {
    await Notification.deleteMany({ ...owner(req), isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

module.exports = { list, setRead, markAllRead, remove, clearRead };
