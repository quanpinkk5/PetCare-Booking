const User = require("../../models/User");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const body = req.body || {};

    const allowedFields = [
      "fullName",
      "phone",
      "avatar",
      "address",
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

          address[field] = body.address[field].trim();
        }
      }

      updates.address = address;
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
      "_id fullName email phone avatar address role status"
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
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar,
          address: customer.address,
          role: customer.role,
          status: customer.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile };