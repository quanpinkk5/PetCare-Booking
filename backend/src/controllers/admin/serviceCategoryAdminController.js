const ServiceCategory = require("../../models/ServiceCategory");
const Service = require("../../models/Service");
const mongoose = require("mongoose");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * GET /api/admin/service-categories
 *
 * Query:
 * - search: tên hoặc mã danh mục
 * - status: all | ACTIVE | INACTIVE
 * - page: số trang, mặc định 1
 * - limit: số bản ghi, mặc định 10, tối đa 50
 */
const getServiceCategories = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");

    const rawPage = String(req.query.page ?? "1");
    const rawLimit = String(req.query.limit ?? "10");

    // 1. Kiểm tra phân trang
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
    if (!["all", "ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái danh mục không hợp lệ",
      });
    }

    // 3. Xây dựng bộ lọc
    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      filter.$or = [{ name: regex }, { code: regex }];
    }

    // 4. Lấy danh mục và tổng số bản ghi
    const [categories, total] = await Promise.all([
      ServiceCategory.find(filter)
        .select("_id name code description icon status createdAt updatedAt")
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      ServiceCategory.countDocuments(filter),
    ]);

    // 5. Đếm số Service thuộc các danh mục ở trang hiện tại
    const categoryIds = categories.map((category) => category._id);

    const serviceCounts =
      categoryIds.length > 0
        ? await Service.aggregate([
            {
              $match: {
                category: {
                  $in: categoryIds,
                },
              },
            },
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
          ])
        : [];

    const countMap = new Map(
      serviceCounts.map((item) => [String(item._id), item.count]),
    );

    // 6. Chuẩn hóa dữ liệu trả về
    const formattedCategories = categories.map((category) => ({
      _id: category._id,
      name: category.name || "",
      code: category.code || "",
      description: category.description || "",
      icon: category.icon || "",
      status: category.status || "INACTIVE",
      serviceCount: countMap.get(String(category._id)) ?? 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    // 7. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục dịch vụ thành công",
      data: {
        categories: formattedCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin getServiceCategories error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách danh mục dịch vụ",
    });
  }
};

/**
 * POST /api/admin/service-categories
 *
 * Tạo danh mục dịch vụ mới.
 *
 * Body:
 * {
 *   name: "Grooming",
 *   code: "GROOMING",
 *   description: "Chăm sóc, cắt tỉa lông thú cưng",
 *   icon: "Scissors",
 *   status: "ACTIVE"
 * }
 */

const ALLOWED_CATEGORY_ICONS = [
  "Scissors",
  "Bath",
  "Sparkles",
  "HeartHandshake",
  "Hotel",
  "ShieldAlert",
  "Ear",
  "PawPrint",
];

const createServiceCategory = async (req, res) => {
  try {
    const { name, code, description, icon, status } = req.body || {};

    // 1. Kiểm tra dữ liệu đầu vào
    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục là bắt buộc và tối đa 100 ký tự",
      });
    }

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mã danh mục là bắt buộc",
      });
    }

    const normalizedName = name.trim();
    const normalizedCode = code.trim().toUpperCase();

    // Chỉ cho phép chữ in hoa, số và dấu gạch dưới
    if (!/^[A-Z0-9_]{2,50}$/.test(normalizedCode)) {
      return res.status(400).json({
        success: false,
        message:
          "Mã danh mục phải có 2–50 ký tự, " +
          "chỉ gồm chữ không dấu, số và dấu gạch dưới",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length > 255)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mô tả không được vượt quá 255 ký tự",
      });
    }

    const normalizedDescription =
      typeof description === "string" ? description.trim() : "";

    const normalizedIcon = icon === undefined ? "PawPrint" : icon;

    if (
      typeof normalizedIcon !== "string" ||
      !ALLOWED_CATEGORY_ICONS.includes(normalizedIcon)
    ) {
      return res.status(400).json({
        success: false,
        message: "Icon danh mục không hợp lệ",
      });
    }

    const normalizedStatus = status === undefined ? "ACTIVE" : status;

    if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái danh mục không hợp lệ",
      });
    }

    // 2. Kiểm tra trùng mã (không phân biệt hoa/thường)
    const existingCategory = await ServiceCategory.findOne({
      code: {
        $regex: `^${normalizedCode}$`,
        $options: "i",
      },
    })
      .select("_id")
      .lean();

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Mã danh mục đã tồn tại",
      });
    }

    // 3. Tạo danh mục
    const category = await ServiceCategory.create({
      name: normalizedName,
      code: normalizedCode,
      description: normalizedDescription,
      icon: normalizedIcon,
      status: normalizedStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Thêm danh mục dịch vụ thành công",
      data: {
        category: {
          _id: category._id,
          name: category.name,
          code: category.code,
          description: category.description,
          icon: category.icon,
          status: category.status,
          serviceCount: 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Admin createServiceCategory error:", error);

    // Nếu đã tạo unique index cho code
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Mã danh mục đã tồn tại",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Không thể thêm danh mục dịch vụ",
    });
  }
};

/**
 * PATCH /api/admin/service-categories/:id
 *
 * Cho phép cập nhật:
 * name, code, description, icon, status
 */
const updateServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu cập nhật không hợp lệ",
      });
    }

    const allowedFields = ["name", "code", "description", "icon", "status"];

    const inputFields = Object.keys(body);

    if (inputFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp thông tin cần cập nhật",
      });
    }

    const invalidFields = inputFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Không được cập nhật trường: " + invalidFields.join(", "),
      });
    }

    const updates = {};

    // Tên danh mục
    if (Object.prototype.hasOwnProperty.call(body, "name")) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Tên danh mục là bắt buộc và tối đa 100 ký tự",
        });
      }

      updates.name = body.name.trim();
    }

    // Mã danh mục: CHO PHÉP CHỈNH SỬA
    if (Object.prototype.hasOwnProperty.call(body, "code")) {
      if (typeof body.code !== "string") {
        return res.status(400).json({
          success: false,
          message: "Mã danh mục không hợp lệ",
        });
      }

      const normalizedCode = body.code.trim().toUpperCase();

      if (!/^[A-Z0-9_]{2,50}$/.test(normalizedCode)) {
        return res.status(400).json({
          success: false,
          message:
            "Mã danh mục phải có 2–50 ký tự, " +
            "chỉ gồm chữ cái, số và dấu gạch dưới",
        });
      }

      // Kiểm tra trùng với danh mục KHÁC
      const duplicate = await ServiceCategory.findOne({
        _id: { $ne: id },
        code: {
          $regex: `^${normalizedCode}$`,
          $options: "i",
        },
      })
        .select("_id")
        .lean();

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Mã danh mục đã tồn tại",
        });
      }

      updates.code = normalizedCode;
    }

    // Mô tả
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      if (
        typeof body.description !== "string" ||
        body.description.trim().length > 255
      ) {
        return res.status(400).json({
          success: false,
          message: "Mô tả không được vượt quá 255 ký tự",
        });
      }

      updates.description = body.description.trim();
    }

    // Icon
    if (Object.prototype.hasOwnProperty.call(body, "icon")) {
      if (
        typeof body.icon !== "string" ||
        !ALLOWED_CATEGORY_ICONS.includes(body.icon)
      ) {
        return res.status(400).json({
          success: false,
          message: "Icon danh mục không hợp lệ",
        });
      }

      updates.icon = body.icon;
    }

    // Trạng thái
    if (Object.prototype.hasOwnProperty.call(body, "status")) {
      if (!["ACTIVE", "INACTIVE"].includes(body.status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái danh mục không hợp lệ",
        });
      }

      updates.status = body.status;
    }

    const category = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục dịch vụ",
      });
    }

    const serviceCount = await Service.countDocuments({
      category: category._id,
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật danh mục dịch vụ thành công",
      data: {
        category: {
          _id: category._id,
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
          icon: category.icon || "",
          status: category.status,
          serviceCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Admin updateServiceCategory error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Mã danh mục đã tồn tại",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật danh mục dịch vụ",
    });
  }
};

/**
 * PATCH /api/admin/service-categories/:id/status
 *
 * Body:
 * {
 *   expectedStatus: "ACTIVE",
 *   status: "INACTIVE"
 * }
 */
const updateServiceCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { expectedStatus, status } = req.body || {};

    // 1. Kiểm tra ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    // 2. Kiểm tra trạng thái
    const validStatuses = ["ACTIVE", "INACTIVE"];

    if (
      !validStatuses.includes(expectedStatus) ||
      !validStatuses.includes(status) ||
      expectedStatus === status
    ) {
      return res.status(400).json({
        success: false,
        message: "Chuyển trạng thái danh mục không hợp lệ",
      });
    }

    // 3. Cập nhật có điều kiện
    const category = await ServiceCategory.findOneAndUpdate(
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
    ).lean();

    if (!category) {
      const existingCategory = await ServiceCategory.findById(id)
        .select("_id status")
        .lean();

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục dịch vụ",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "Trạng thái danh mục đã thay đổi. " + "Vui lòng tải lại danh sách.",
        data: {
          currentStatus: existingCategory.status,
          expectedStatus,
        },
      });
    }

    // 4. Đếm dịch vụ liên quan
    const serviceCount = await Service.countDocuments({
      category: category._id,
    });

    return res.status(200).json({
      success: true,
      message:
        status === "ACTIVE"
          ? "Kích hoạt danh mục thành công"
          : "Tạm ẩn danh mục thành công",
      data: {
        category: {
          _id: category._id,
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
          icon: category.icon || "",
          status: category.status,
          serviceCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Admin updateServiceCategoryStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể thay đổi trạng thái danh mục",
    });
  }
};
module.exports = {
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  updateServiceCategoryStatus,
};
