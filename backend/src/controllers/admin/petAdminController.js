
const mongoose = require("mongoose");
const User = require("../../models/User");
const Pet = require("../../models/Pet");

// GET /api/admin/users/:id/pets
const getUserPets = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ObjectId
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    // Kiểm tra Customer tồn tại
    const user = await User.findById(id)
      .select("_id role")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.role !== "CUSTOMER") {
      return res.status(400).json({
        success: false,
        message: "Chức năng này chỉ áp dụng cho tài khoản CUSTOMER",
      });
    }

    // Chỉ lấy thú cưng thuộc đúng Customer
    const pets = await Pet.find({
      ownerId: user._id,
    })
      .select(
        "_id name species breed gender dateOfBirth weight avatar status createdAt",
      )
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách thú cưng thành công",
      data: {
        pets,
        total: pets.length,
      },
    });
  } catch (error) {
    console.error("Admin getUserPets error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách thú cưng",
    });
  }
};

module.exports = {
  getUserPets,
};
