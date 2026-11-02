const User = require('../../models/User');

const updateAvatar = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).length !== 1 || typeof body.avatar !== 'string') {
      return res.status(400).json({ success: false, message: 'Chỉ được cập nhật ảnh đại diện.' });
    }
    const avatar = body.avatar.trim();
    const image = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(avatar);
    if (avatar && !(image && Buffer.byteLength(image[2], 'base64') <= 256 * 1024) &&
        !(/^https?:\/\/\S+$/.test(avatar) && avatar.length <= 2048)) {
      return res.status(400).json({ success: false, message: 'Chọn ảnh PNG, JPEG hoặc WebP tối đa 256 KB.' });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.user._id || req.user.id, role: 'BUSINESS_OWNER', status: 'ACTIVE' },
      { $set: { avatar } }, { returnDocument: 'after', runValidators: true },
    ).select('fullName email phone avatar role status').lean();
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy chủ cơ sở đang hoạt động.' });
    return res.json({ success: true, data: { user: { ...user, id: String(user._id), name: user.fullName } } });
  } catch (error) { next(error); }
};

module.exports = { updateAvatar };
