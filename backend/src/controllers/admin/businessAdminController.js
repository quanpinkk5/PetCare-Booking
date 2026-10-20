const mongoose = require("mongoose");

const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const User = require("../../models/User");
const Service = require("../../models/Service");
const BranchService = require("../../models/BranchService");
const Notification = require("../../models/Notification");
// ===========================================
// HÀM HỖ TRỢ
// ===========================================

// Chống ký tự đặc biệt trong từ khóa tìm kiếm
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Các trạng thái hợp lệ của thương hiệu
const BUSINESS_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

// Quy tắc chuyển trạng thái
// Key: trạng thái muốn chuyển đến
// Value: các trạng thái hiện tại được phép chuyển
const ALLOWED_TRANSITIONS = {
  APPROVED: ["PENDING", "SUSPENDED"],
  REJECTED: ["PENDING"],
  SUSPENDED: ["APPROVED"],
};

// ===========================================
// 1. GET /api/admin/businesses
// LẤY DANH SÁCH THƯƠNG HIỆU
// ===========================================

const getBusinesses = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");
    const location = String(req.query.location || "all").trim();

    const rawPage = String(req.query.page ?? "1");
    const rawLimit = String(req.query.limit ?? "10");

    // 1. Kiểm tra tham số phân trang
    if (!/^\d+$/.test(rawPage) || !/^\d+$/.test(rawLimit)) {
      return res.status(400).json({
        success: false,
        message: "page và limit phải là số nguyên dương",
      });
    }

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "page phải >= 1 và limit từ 1 đến 50",
      });
    }

    // 2. Kiểm tra trạng thái
    const validStatuses = ["all", ...BUSINESS_STATUSES];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thương hiệu không hợp lệ",
      });
    }

    // 3. Xây dựng bộ lọc MongoDB
    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    // 4. Lọc theo khu vực của chi nhánh
    if (location !== "all") {
      const matchingBranches = await Branch.find({
        "address.province": location,
      })
        .select("businessId")
        .lean();

      const matchedBusinessIds = [
        ...new Set(matchingBranches.map((branch) => String(branch.businessId))),
      ].map((id) => new mongoose.Types.ObjectId(id));

      filter._id = {
        $in: matchedBusinessIds,
      };
    }

    // 5. Tìm kiếm theo thương hiệu hoặc chủ sở hữu
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      const matchingOwners = await User.find({
        role: "BUSINESS_OWNER",
        $or: [{ fullName: regex }, { email: regex }, { phone: regex }],
      })
        .select("_id")
        .lean();

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        {
          ownerId: {
            $in: matchingOwners.map((owner) => owner._id),
          },
        },
      ];
    }

    // 6. Lấy danh sách và tổng số bản ghi
    const [businesses, total] = await Promise.all([
      Business.find(filter)
        .select(
          "_id ownerId name slug logo email phone status " +
            "averageRating totalReviews createdAt",
        )
        .populate({
          path: "ownerId",
          select: "_id fullName email phone avatar",
        })
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Business.countDocuments(filter),
    ]);

    // 7. Lấy ID các thương hiệu thuộc trang hiện tại
    const businessIds = businesses.map((business) => business._id);

    // 8. Lấy chi nhánh của các thương hiệu
    const branches =
      businessIds.length > 0
        ? await Branch.find({
            businessId: {
              $in: businessIds,
            },
          })
            .select("businessId address.province")
            .lean()
        : [];

    // 9. Gom số chi nhánh và khu vực theo thương hiệu
    const branchInfoMap = new Map();

    branches.forEach((branch) => {
      const businessId = String(branch.businessId);

      if (!branchInfoMap.has(businessId)) {
        branchInfoMap.set(businessId, {
          count: 0,
          locations: new Set(),
        });
      }

      const info = branchInfoMap.get(businessId);

      info.count += 1;

      const province = branch.address?.province;

      if (typeof province === "string" && province.trim()) {
        info.locations.add(province.trim());
      }
    });

    // 10. Chuẩn hóa dữ liệu trả về frontend
    const formattedBusinesses = businesses.map((business) => {
      const info = branchInfoMap.get(String(business._id));

      const locations = info
        ? [...info.locations].sort((a, b) => a.localeCompare(b, "vi"))
        : [];

      return {
        _id: business._id,
        name: business.name,
        slug: business.slug,

        logo: business.logo || "",
        email: business.email || "",
        phone: business.phone || "",

        owner: {
          _id: business.ownerId?._id || null,

          fullName: business.ownerId?.fullName || "Không xác định",

          email: business.ownerId?.email || "",

          phone: business.ownerId?.phone || "",

          avatar: business.ownerId?.avatar || "",
        },

        branchCount: info?.count ?? 0,

        locations,

        location: locations.length > 0 ? locations.join(", ") : "Chưa cập nhật",

        status: business.status,

        averageRating: business.averageRating ?? 0,

        totalReviews: business.totalReviews ?? 0,

        createdAt: business.createdAt,
      };
    });

    // 11. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách thương hiệu thành công",
      data: {
        businesses: formattedBusinesses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin getBusinesses error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách thương hiệu",
    });
  }
};

// ===========================================
// 2. GET /api/admin/businesses/locations
// LẤY DANH SÁCH KHU VỰC ĐỘNG
// ===========================================

const getBusinessLocations = async (req, res) => {
  try {
    const provinces = await Branch.distinct("address.province");

    const locations = [
      ...new Set(
        provinces
          .filter(
            (province) =>
              typeof province === "string" && province.trim().length > 0,
          )
          .map((province) => province.trim()),
      ),
    ].sort((a, b) => a.localeCompare(b, "vi"));

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách khu vực thành công",
      data: {
        locations,
      },
    });
  } catch (error) {
    console.error("Admin getBusinessLocations error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách khu vực",
    });
  }
};

/**
 * PATCH /api/admin/businesses/:id/status
 *
 * Duyệt / Từ chối / Tạm khóa / Mở khóa
 * Đồng thời gửi notification cho Business Owner.
 *
 * Body:
 * {
 *   expectedStatus: "PENDING",
 *   status: "REJECTED",
 *   note: "Hồ sơ chưa đầy đủ"
 * }
 */
const updateBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { expectedStatus, status, note } = req.body || {};

    // 1. Kiểm tra ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thương hiệu không hợp lệ",
      });
    }

    // 2. Quy tắc chuyển trạng thái
    const allowedTransitions = {
      PENDING: ["APPROVED", "REJECTED"],
      APPROVED: ["SUSPENDED"],
      SUSPENDED: ["APPROVED"],
    };

    if (
      !Object.prototype.hasOwnProperty.call(
        allowedTransitions,
        expectedStatus,
      ) ||
      !allowedTransitions[expectedStatus].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Thao tác chuyển trạng thái không hợp lệ",
      });
    }

    // 3. Kiểm tra ghi chú
    if (note !== undefined && note !== null && typeof note !== "string") {
      return res.status(400).json({
        success: false,
        message: "Ghi chú phải là chuỗi ký tự",
      });
    }

    const normalizedNote = typeof note === "string" ? note.trim() : "";

    if (normalizedNote.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Ghi chú không được vượt quá 500 ký tự",
      });
    }

    // Từ chối và tạm khóa bắt buộc nhập lý do
    if (["REJECTED", "SUSPENDED"].includes(status) && !normalizedNote) {
      return res.status(400).json({
        success: false,
        message:
          status === "REJECTED"
            ? "Vui lòng nhập lý do từ chối thương hiệu"
            : "Vui lòng nhập lý do tạm khóa thương hiệu",
      });
    }

    // 4. Kiểm tra thương hiệu và chủ sở hữu
    const existingBusiness = await Business.findById(id)
      .select("_id name ownerId status")
      .lean();

    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }

    if (existingBusiness.status !== expectedStatus) {
      return res.status(409).json({
        success: false,
        message:
          "Trạng thái thương hiệu đã thay đổi. " +
          "Vui lòng tải lại trước khi thao tác.",
        data: {
          currentStatus: existingBusiness.status,
          expectedStatus,
        },
      });
    }

    if (!existingBusiness.ownerId) {
      return res.status(409).json({
        success: false,
        message: "Thương hiệu chưa có chủ sở hữu hợp lệ",
      });
    }

    // 5. Cấu hình thông báo
    const notificationConfigs = {
      "PENDING:APPROVED": {
        title: "Thương hiệu đã được phê duyệt",
        message:
          `Thương hiệu "${existingBusiness.name}" ` +
          "đã được Admin phê duyệt.",
      },

      "PENDING:REJECTED": {
        title: "Thương hiệu bị từ chối",
        message:
          `Thương hiệu "${existingBusiness.name}" ` + "đã bị Admin từ chối.",
      },

      "APPROVED:SUSPENDED": {
        title: "Thương hiệu bị tạm khóa",
        message:
          `Thương hiệu "${existingBusiness.name}" ` + "đã bị Admin tạm khóa.",
      },

      "SUSPENDED:APPROVED": {
        title: "Thương hiệu đã được mở khóa",
        message:
          `Thương hiệu "${existingBusiness.name}" ` + "đã được Admin mở khóa.",
      },
    };

    const transitionKey = `${expectedStatus}:${status}`;

    const notificationConfig = notificationConfigs[transitionKey];

    let notificationMessage = notificationConfig.message;

    if (normalizedNote) {
      notificationMessage += ` Lý do/Ghi chú của Admin: ${normalizedNote}`;
    }

    // 6. Cập nhật trạng thái có điều kiện
    // Tránh ghi đè khi nhiều Admin xử lý đồng thời
    const updatedBusiness = await Business.findOneAndUpdate(
      {
        _id: id,
        status: expectedStatus,
      },
      {
        $set: { status },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .select("_id ownerId name slug status createdAt updatedAt")
      .populate({
        path: "ownerId",
        select: "_id fullName email",
      });

    if (!updatedBusiness) {
      return res.status(409).json({
        success: false,
        message:
          "Trạng thái thương hiệu vừa thay đổi. " +
          "Vui lòng tải lại danh sách.",
      });
    }

    // 7. Tạo notification cho Business Owner
    try {
      await Notification.create({
        userId: existingBusiness.ownerId,
        type: "BUSINESS_STATUS",
        title: notificationConfig.title,
        message: notificationMessage,
        referenceType: "BUSINESS",
        referenceId: existingBusiness._id,
        isRead: false,
        readAt: null,
      });
    } catch (notificationError) {
      console.error(
        "Admin create business notification error:",
        notificationError,
      );

      // Quan trọng:
      // Business đã được cập nhật, nhưng notification thất bại.
      // Không báo thành công hoàn toàn.
      // Không tự động retry PATCH vì sẽ gặp xung đột trạng thái.
      return res.status(500).json({
        success: false,
        message:
          "Đã cập nhật trạng thái thương hiệu nhưng " +
          "không thể tạo thông báo cho Business Owner.",
        data: {
          business: updatedBusiness,
          notificationCreated: false,
        },
      });
    }

    // 8. Thành công
    const successMessages = {
      "PENDING:APPROVED": "Duyệt thương hiệu thành công",

      "PENDING:REJECTED": "Từ chối thương hiệu thành công",

      "APPROVED:SUSPENDED": "Tạm khóa thương hiệu thành công",

      "SUSPENDED:APPROVED": "Mở khóa thương hiệu thành công",
    };

    return res.status(200).json({
      success: true,
      message: successMessages[transitionKey],
      data: {
        business: updatedBusiness,
        notificationCreated: true,
      },
    });
  } catch (error) {
    console.error("Admin updateBusinessStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái thương hiệu",
    });
  }
};

/**
 * GET /api/admin/businesses/:id
 *
 * Lấy chi tiết một thương hiệu:
 * - Thông tin Business
 * - Thông tin chủ sở hữu
 * - Danh sách chi nhánh thuộc Business
 */
const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thương hiệu không hợp lệ",
      });
    }

    // 2. Lấy thông tin thương hiệu và chủ sở hữu
    const business = await Business.findById(id)
      .populate({
        path: "ownerId",
        select: "_id fullName email phone avatar role status createdAt",
      })
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }

    // 3. Lấy danh sách chi nhánh của thương hiệu
    const branches = await Branch.find({
      businessId: business._id,
    })
      .select(
        "_id businessId name email phone address " +
          "openingHours images status createdAt updatedAt",
      )
      .sort({
        createdAt: 1,
        _id: 1,
      })
      .lean();

    // 4. Chuẩn hóa thông tin chủ sở hữu
    const owner = business.ownerId
      ? {
          _id: business.ownerId._id,
          fullName: business.ownerId.fullName || "",
          email: business.ownerId.email || "",
          phone: business.ownerId.phone || "",
          avatar: business.ownerId.avatar || "",
          role: business.ownerId.role,
          status: business.ownerId.status,
          createdAt: business.ownerId.createdAt,
        }
      : null;

    // 5. Chuẩn hóa danh sách chi nhánh
    const formattedBranches = branches.map((branch) => ({
      _id: branch._id,
      businessId: branch.businessId,
      name: branch.name || "",
      email: branch.email || "",
      phone: branch.phone || "",
      address: branch.address || {},
      openingHours: branch.openingHours || [],
      images: branch.images || [],
      status: branch.status,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
    }));

    // 6. Dữ liệu trả về
    const formattedBusiness = {
      _id: business._id,
      ownerId: owner?._id || null,

      name: business.name,
      slug: business.slug,
      description: business.description || "",

      logo: business.logo || "",
      images: business.images || [],

      phone: business.phone || "",
      email: business.email || "",

      status: business.status,

      averageRating: business.averageRating ?? 0,
      totalReviews: business.totalReviews ?? 0,

      createdAt: business.createdAt,
      updatedAt: business.updatedAt,

      owner,

      branchCount: formattedBranches.length,
    };

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết thương hiệu thành công",
      data: {
        business: formattedBusiness,
        branches: formattedBranches,
      },
    });
  } catch (error) {
    console.error("Admin getBusinessById error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết thương hiệu",
    });
  }
};

/**
 * GET /api/admin/businesses/:id/services
 *
 * Admin xem các dịch vụ thuộc một thương hiệu
 * và các chi nhánh đang được gán dịch vụ đó.
 */
const getBusinessServices = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra ID thương hiệu
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thương hiệu không hợp lệ",
      });
    }

    // 2. Kiểm tra thương hiệu có tồn tại
    const business = await Business.findById(id)
      .select("_id name status")
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }

    // 3. Lấy TẤT CẢ dịch vụ thuộc thương hiệu
    // Admin cần thấy cả ACTIVE và INACTIVE
    const services = await Service.find({
      businessId: business._id,
    })
      .select(
        "_id businessId categoryId name description " +
          "serviceType images status createdAt updatedAt",
      )
      .populate({
        path: "categoryId",
        select: "_id name",
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .lean();

    // 4. Nếu thương hiệu chưa có dịch vụ
    if (services.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Thương hiệu chưa có dịch vụ",
        data: {
          services: [],
          totalServices: 0,
        },
      });
    }

    // 5. Lấy các BranchService ứng với dịch vụ
    const serviceIds = services.map((service) => service._id);

    const branchServices = await BranchService.find({
      serviceId: {
        $in: serviceIds,
      },
    })
      .select(
        "_id branchId serviceId price pricingUnit " +
          "durationMinutes capacity petTypes status",
      )
      .populate({
        path: "branchId",
        select: "_id businessId name address status",
      })
      .lean();

    // 6. Chỉ giữ các chi nhánh thực sự thuộc Business
    // Tránh hiển thị dữ liệu gán nhầm từ thương hiệu khác
    const validBranchServices = branchServices.filter(
      (item) =>
        item.branchId &&
        String(item.branchId.businessId) === String(business._id),
    );

    // 7. Gom BranchService theo Service
    const branchServiceMap = new Map();

    for (const item of validBranchServices) {
      const serviceId = String(item.serviceId);

      if (!branchServiceMap.has(serviceId)) {
        branchServiceMap.set(serviceId, []);
      }

      branchServiceMap.get(serviceId).push({
        _id: item._id,

        branch: {
          _id: item.branchId._id,
          name: item.branchId.name,
          address: item.branchId.address || {},
          status: item.branchId.status,
        },

        price: item.price,
        pricingUnit: item.pricingUnit,

        durationMinutes: item.durationMinutes,
        capacity: item.capacity,

        petTypes: item.petTypes || [],

        status: item.status,
      });
    }

    // 8. Chuẩn hóa dữ liệu trả về
    const formattedServices = services.map((service) => {
      const assignedBranches = branchServiceMap.get(String(service._id)) || [];

      return {
        _id: service._id,
        businessId: service.businessId,

        name: service.name,
        description: service.description || "",

        category: service.categoryId
          ? {
              _id: service.categoryId._id,
              name: service.categoryId.name || "",
            }
          : null,

        serviceType: service.serviceType,

        images: service.images || [],
        status: service.status,

        branchCount: assignedBranches.length,

        activeBranchCount: assignedBranches.filter(
          (item) => item.status === "ACTIVE" && item.branch.status === "ACTIVE",
        ).length,

        branches: assignedBranches,

        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    });

    // 9. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách dịch vụ thương hiệu thành công",
      data: {
        services: formattedServices,
        totalServices: formattedServices.length,
      },
    });
  } catch (error) {
    console.error("Admin getBusinessServices error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách dịch vụ thương hiệu",
    });
  }
};

/**
 * POST /api/admin/businesses/:id/request-info
 *
 * Admin yêu cầu Business Owner bổ sung thông tin.
 * Không thay đổi trạng thái Business (vẫn PENDING).
 */
const requestBusinessInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};

    // 1. Kiểm tra ID thương hiệu
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thương hiệu không hợp lệ",
      });
    }

    // 2. Kiểm tra nội dung yêu cầu bổ sung
    if (typeof note !== "string") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập nội dung cần bổ sung",
      });
    }

    const normalizedNote = note.trim();

    if (!normalizedNote) {
      return res.status(400).json({
        success: false,
        message: "Nội dung yêu cầu bổ sung không được để trống",
      });
    }

    if (normalizedNote.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Nội dung không được vượt quá 500 ký tự",
      });
    }

    // 3. Tìm thương hiệu
    const business = await Business.findById(id)
      .select("_id ownerId name status")
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }

    // 4. Chỉ yêu cầu bổ sung khi đang chờ duyệt
    if (business.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message:
          "Chỉ có thể yêu cầu bổ sung thông tin " +
          "đối với thương hiệu đang chờ duyệt",
      });
    }

    if (!business.ownerId) {
      return res.status(409).json({
        success: false,
        message: "Thương hiệu chưa có chủ sở hữu hợp lệ",
      });
    }

    // 5. Xác minh chủ sở hữu vẫn tồn tại
    const ownerExists = await User.exists({
      _id: business.ownerId,
      role: "BUSINESS_OWNER",
    });

    if (!ownerExists) {
      return res.status(409).json({
        success: false,
        message: "Không tìm thấy tài khoản chủ thương hiệu",
      });
    }

    // 6. Kiểm tra lại trạng thái ngay trước khi gửi
    // Phương án A không có trạng thái NEEDS_INFO.
    const stillPending = await Business.exists({
      _id: business._id,
      status: "PENDING",
    });

    if (!stillPending) {
      return res.status(409).json({
        success: false,
        message:
          "Trạng thái thương hiệu đã thay đổi. " +
          "Vui lòng tải lại trước khi gửi yêu cầu.",
      });
    }

    // 7. Tạo notification cho Business Owner
    const notification = await Notification.create({
      userId: business.ownerId,
      type: "BUSINESS_INFO_REQUEST",

      title: "Yêu cầu bổ sung thông tin thương hiệu",

      message:
        `Thương hiệu "${business.name}" cần bổ sung ` +
        `thông tin. Nội dung từ Admin: ${normalizedNote}`,

      referenceType: "BUSINESS",
      referenceId: business._id,

      isRead: false,
      readAt: null,
    });

    // 8. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Đã gửi yêu cầu bổ sung thông tin thành công",
      data: {
        notification: {
          _id: notification._id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          referenceType: notification.referenceType,
          referenceId: notification.referenceId,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        },
        businessStatus: business.status,
      },
    });
  } catch (error) {
    console.error("Admin requestBusinessInfo error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể gửi yêu cầu bổ sung thông tin",
    });
  }
};

// ===========================================
// EXPORT CONTROLLERS
// ===========================================

module.exports = {
  getBusinesses,
  getBusinessLocations,
  updateBusinessStatus,
  getBusinessById,
  getBusinessServices,
  requestBusinessInfo,
};
