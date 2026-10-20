const mongoose = require("mongoose");
const User = require("../../models/User");
const AuthSession = require("../../models/AuthSession");
// ======================================================
// CẤU HÌNH
// ======================================================

const VALID_ROLES = ["CUSTOMER", "BUSINESS_OWNER", "ADMIN"];
const VALID_STATUSES = ["ACTIVE", "LOCKED"];

const VALID_TIME_RANGES = ["all", "today", "7days", "30days", "custom"];

// Chỉ trả về những trường được phép hiển thị cho Admin
const USER_FIELDS = [
  "_id",
  "fullName",
  "email",
  "phone",
  "avatar",
  "role",
  "status",
  "address",
  "dateOfBirth",
  "gender",
  "createdAt",
  "updatedAt",
].join(" ");

// Escape ký tự đặc biệt để tìm kiếm regex an toàn hơn
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Kiểm tra chuỗi ngày YYYY-MM-DD có hợp lệ hay không
const parseVietnamDate = (dateString) => {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const checkDate = new Date(Date.UTC(year, month - 1, day));

  // Từ chối ngày không tồn tại: 31/02, 32/01...
  if (
    checkDate.getUTCFullYear() !== year ||
    checkDate.getUTCMonth() !== month - 1 ||
    checkDate.getUTCDate() !== day
  ) {
    return null;
  }

  // Chuyển 00:00 giờ Việt Nam sang UTC
  return new Date(Date.UTC(year, month - 1, day) - 7 * 60 * 60 * 1000);
};

// ======================================================
// GET /api/admin/users
// Lấy danh sách người dùng, tìm kiếm, lọc, phân trang
// ======================================================

const getUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "all",
      status = "all",
      timeRange = "all",
      startDate,
      endDate,
      page = "1",
      limit = "10",
    } = req.query;

    // --------------------------------------------------
    // 1. Kiểm tra tham số
    // --------------------------------------------------

    if (typeof search !== "string" || search.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Từ khóa tìm kiếm không hợp lệ",
      });
    }

    if (
      typeof role !== "string" ||
      (role !== "all" && !VALID_ROLES.includes(role))
    ) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }

    if (
      typeof status !== "string" ||
      (status !== "all" && !VALID_STATUSES.includes(status))
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    if (
      typeof timeRange !== "string" ||
      !VALID_TIME_RANGES.includes(timeRange)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bộ lọc thời gian không hợp lệ",
      });
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isSafeInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Trang phải >= 1 và số bản ghi mỗi trang từ 1 đến 100",
      });
    }

    // --------------------------------------------------
    // 2. Xây dựng bộ lọc MongoDB
    // --------------------------------------------------

    const filter = {};

    // Lọc theo vai trò
    if (role !== "all") {
      filter.role = role;
    }

    // Lọc theo trạng thái
    if (status !== "all") {
      filter.status = status;
    }

    // Tìm theo tên, email, số điện thoại
    const keyword = search.trim();

    if (keyword) {
      const safeKeyword = escapeRegex(keyword);

      filter.$or = [
        {
          fullName: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------
    // 3. Lọc theo ngày tạo tài khoản (createdAt)
    // --------------------------------------------------

    const now = new Date();

    if (timeRange === "today") {
      // Lấy ngày hôm nay theo giờ Việt Nam (UTC+7)
      const vietnamNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      vietnamNow.setUTCHours(0, 0, 0, 0);

      const startOfToday = new Date(vietnamNow.getTime() - 7 * 60 * 60 * 1000);

      filter.createdAt = {
        $gte: startOfToday,
        $lte: now,
      };
    }

    if (timeRange === "7days") {
      filter.createdAt = {
        $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lte: now,
      };
    }

    if (timeRange === "30days") {
      filter.createdAt = {
        $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lte: now,
      };
    }

    if (timeRange === "custom") {
      // Bắt buộc có cả ngày bắt đầu và ngày kết thúc
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
        });
      }

      const from = parseVietnamDate(startDate);
      const to = parseVietnamDate(endDate);

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message: "Ngày được chọn không hợp lệ",
        });
      }

      if (from > to) {
        return res.status(400).json({
          success: false,
          message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
        });
      }

      // Bao gồm toàn bộ ngày kết thúc
      const endExclusive = new Date(to.getTime() + 24 * 60 * 60 * 1000);

      filter.createdAt = {
        $gte: from,
        $lt: endExclusive,
      };
    }

    // --------------------------------------------------
    // 4. Truy vấn MongoDB và phân trang
    // --------------------------------------------------

    const skip = (pageNumber - 1) * limitNumber;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(USER_FIELDS)
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    // --------------------------------------------------
    // 5. Trả kết quả
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      data: {
        users,

        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      },
    });
  } catch (error) {
    console.error("Admin getUsers error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách người dùng",
    });
  }
};

// ======================================================
// GET /api/admin/users/:id
// Lấy thông tin chi tiết một người dùng
// ======================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    const user = await User.findById(id).select(USER_FIELDS).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    const now = new Date();

    // Lấy thời điểm bắt đầu phiên đăng nhập mới nhất
    const latestSession = await AuthSession.findOne({
      userId: user._id,
    })
      .select("createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    // Đếm các phiên refresh token còn hiệu lực
    const activeSessionCount = await AuthSession.countDocuments({
      userId: user._id,
      revokedAt: null,
      expiresAt: { $gt: now },
    });

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết người dùng thành công",
      data: {
        user,
        sessionStats: {
          lastLoginAt: latestSession?.createdAt ?? null,
          activeSessionCount,
        },
      },
    });
  } catch (error) {
    console.error("Admin getUserById error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết người dùng",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    // Kiểm tra ID người dùng
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    // Chỉ cho phép hai trạng thái
    if (!["ACTIVE", "LOCKED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái phải là ACTIVE hoặc LOCKED",
      });
    }

    // Không cho Admin tự khóa chính mình
    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không thể thay đổi trạng thái tài khoản của chính mình",
      });
    }

    // Tránh khóa nhầm tài khoản quản trị khác
    // Chính sách hiện tại: không cho khóa ADMIN qua API này
    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: { $ne: "ADMIN" },
      },
      {
        $set: { status },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select(USER_FIELDS);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy tài khoản hoặc không được phép thay đổi tài khoản ADMIN",
      });
    }

    // Nếu khóa tài khoản, thu hồi toàn bộ Refresh Token
    if (status === "LOCKED") {
      await AuthSession.updateMany(
        {
          userId: user._id,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "LOCKED"
          ? "Khóa tài khoản thành công"
          : "Mở khóa tài khoản thành công",
      data: { user },
    });
  } catch (error) {
    console.error("Admin updateUserStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái tài khoản",
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
};
