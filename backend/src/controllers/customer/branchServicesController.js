const mongoose = require("mongoose");

const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const BranchService = require("../../models/BranchService");
const Service = require("../../models/Service");

// ==========================================
// GET - Danh sách dịch vụ của một chi nhánh
// ==========================================
const getServicesByBranchId = async (req, res, next) => {
  try {
    // 1. Lấy Branch ID
    const { id } = req.params;

    // 2. Kiểm tra ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID chi nhánh không hợp lệ",
      });
    }

    // 3. Kiểm tra chi nhánh đang hoạt động
    const branch = await Branch.findOne({
      _id: id,
      status: "ACTIVE",
    })
      .select("_id businessId name")
      .lean();

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 4. Kiểm tra Business đã được duyệt
    const business = await Business.findOne({
      _id: branch.businessId,
      status: "APPROVED",
    })
      .select("_id")
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 5. Lấy các BranchService đang hoạt động
    const branchServices = await BranchService.find({
      branchId: branch._id,
      status: "ACTIVE",
    })
      .select(
        "branchId serviceId price pricingUnit durationMinutes capacity petTypes status",
      )
      .sort({ _id: -1 })
      .lean();

    // 6. Lấy các Service tương ứng
    const serviceIds = branchServices.map((item) => item.serviceId);

    const services = await Service.find({
      _id: { $in: serviceIds },
      businessId: business._id,
      status: "ACTIVE",
    })
      .select(
        "businessId categoryId name description serviceType images status",
      )
      .lean();

    // 7. Tạo Map để tra cứu Service
    const serviceMap = new Map(
      services.map((service) => [service._id.toString(), service]),
    );

    // 8. Ghép BranchService với Service
    const data = branchServices
      .map((item) => {
        const service = serviceMap.get(item.serviceId.toString());

        // Không hiển thị dịch vụ đã bị vô hiệu hóa
        // hoặc không thuộc Business của chi nhánh
        if (!service) {
          return null;
        }

        return {
          _id: item._id,
          branchId: item.branchId,
          serviceId: item.serviceId,

          price: item.price,
          pricingUnit: item.pricingUnit,
          durationMinutes: item.durationMinutes,
          capacity: item.capacity,
          petTypes: item.petTypes,
          status: item.status,

          service: {
            _id: service._id,
            categoryId: service.categoryId,
            name: service.name,
            description: service.description,
            serviceType: service.serviceType,
            images: service.images,
          },
        };
      })
      .filter(Boolean);

    // 9. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách dịch vụ của chi nhánh thành công",
      total: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicesByBranchId,
};
