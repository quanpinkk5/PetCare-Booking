const mongoose = require("mongoose");

const Business = require("../../models/Business");
const Branch = require("../../models/Branch");

// ======================================
// GET - Danh sách chi nhánh theo Business
// ======================================
const getBranchesByBusinessId = async (req, res, next) => {
  try {
    // 1. Lấy Business ID
    const { id } = req.params;

    // 2. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID doanh nghiệp không hợp lệ",
      });
    }

    // 3. Kiểm tra doanh nghiệp đã được duyệt
    const business = await Business.findOne({
      _id: id,
      status: "APPROVED",
    }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy doanh nghiệp",
      });
    }

    // 4. Lấy danh sách chi nhánh đang hoạt động
    const branches = await Branch.find({
      businessId: business._id,
      status: "ACTIVE",
    })
      .select("businessId name phone email address openingHours images status")
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    // 5. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách chi nhánh thành công",
      total: branches.length,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// GET - Xem chi tiết một chi nhánh
// ======================================
const getBranchById = async (req, res, next) => {
  try {
    // 1. Lấy ID chi nhánh từ URL
    const { id } = req.params;

    // 2. Kiểm tra ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID chi nhánh không hợp lệ",
      });
    }

    // 3. Tìm chi nhánh đang hoạt động
    const branch = await Branch.findOne({
      _id: id,
      status: "ACTIVE",
    })
      .select(
        "businessId name phone email address openingHours images status"
      )
      .lean();

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 4. Kiểm tra doanh nghiệp sở hữu chi nhánh
    const business = await Business.findOne({
      _id: branch.businessId,
      status: "APPROVED",
    })
      .select("name slug logo")
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 5. Trả về thông tin chi nhánh
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết chi nhánh thành công",
      data: {
        ...branch,
        business,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getBranchesByBusinessId,
    getBranchById,
};
