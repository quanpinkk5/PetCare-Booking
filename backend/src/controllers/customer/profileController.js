const User = require("../../models/User");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const body = req.body || {};

    if (typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: "Dữ liệu hồ sơ không hợp lệ" });
    }

    const allowedFields = [
      "fullName",
      "phone",
      "avatar",
      "address",
      "gender",
      "birthday",
      "bio",
    ];

    // Không cho phép gửi các field ngoài danh sách
    const invalidFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Không được cập nhật: ${invalidFields.join(", ")}`,
      });
    }

    const updates = {};

    // Kiểm tra họ tên
    if (body.fullName !== undefined) {
      if (
        typeof body.fullName !== "string" ||
        !body.fullName.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Họ tên không được để trống",
        });
      }

      updates.fullName = body.fullName.trim();
    }

    // Kiểm tra số điện thoại
    if (body.phone !== undefined) {
      if (typeof body.phone !== "string") {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại phải là chuỗi",
        });
      }

      updates.phone = body.phone.trim();
    }

    // Kiểm tra ảnh đại diện
    if (body.avatar !== undefined) {
      if (typeof body.avatar !== "string") {
        return res.status(400).json({
          success: false,
          message: "Avatar phải là chuỗi URL",
        });
      }

      updates.avatar = body.avatar.trim();
      const avatar = updates.avatar;
      const image = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(avatar);
      if (avatar && !(image && Buffer.byteLength(image[2], "base64") <= 256 * 1024) &&
          !(/^https?:\/\/\S+$/.test(avatar) && avatar.length <= 2048)) {
        return res.status(400).json({ success: false, message: "Ảnh phải là URL HTTP(S) hoặc ảnh PNG, JPEG, WebP tối đa 256 KB" });
      }
    }

    if (body.gender !== undefined) {
      if (!["", "Nam", "Nữ", "Khác"].includes(body.gender)) {
        return res.status(400).json({ success: false, message: "Giới tính không hợp lệ" });
      }
      updates.gender = body.gender;
    }

    if (body.birthday !== undefined) {
      const value = body.birthday;
      const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T00:00:00.000Z`) : null;
      if (value !== "" && (!date || Number.isNaN(date.getTime()) ||
          date.toISOString().slice(0, 10) !== value || date > new Date())) {
        return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });
      }
      updates.birthday = value;
    }

    if (body.bio !== undefined) {
      if (typeof body.bio !== "string" || body.bio.trim().length > 1000) {
        return res.status(400).json({ success: false, message: "Ghi chú phải là chuỗi tối đa 1000 ký tự" });
      }
      updates.bio = body.bio.trim();
    }

    // Kiểm tra địa chỉ
    if (body.address !== undefined) {
      if (
        body.address === null ||
        typeof body.address !== "object" ||
        Array.isArray(body.address)
      ) {
        return res.status(400).json({
          success: false,
          message: "Địa chỉ phải là object",
        });
      }

      const addressFields = [
        "province",
        "district",
        "ward",
        "detail",
      ];

      const invalidAddressFields = Object.keys(
        body.address
      ).filter(
        (field) => !addressFields.includes(field)
      );

      if (invalidAddressFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Địa chỉ chứa trường không hợp lệ",
        });
      }

      const address = {};

      for (const field of addressFields) {
        if (body.address[field] !== undefined) {
          if (typeof body.address[field] !== "string") {
            return res.status(400).json({
              success: false,
              message: `${field} phải là chuỗi`,
            });
          }

          address[`address.${field}`] = body.address[field].trim();
        }
      }

      Object.assign(updates, address);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const customer = await User.findOneAndUpdate(
      {
        _id: userId,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "_id fullName email phone avatar address role status gender birthday bio"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Customer đang hoạt động",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        user: {
          id: customer._id.toString(),
          fullName: customer.fullName,
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar,
          address: customer.address,
          gender: customer.gender || "",
          birthday: customer.birthday || "",
          bio: customer.bio || "",
          role: customer.role,
          status: customer.status,
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Thông tin hồ sơ không hợp lệ" });
    }
    next(error);
  }
};

module.exports = { updateProfile };
