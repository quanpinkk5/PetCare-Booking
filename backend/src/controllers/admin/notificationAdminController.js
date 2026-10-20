const mongoose = require("mongoose");
const Notification = require("../../models/Notification");

// ==========================================
// HELPERS
// ==========================================

const getAdminId = (req) => {
  const id = req.user?._id || req.user?.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  return id;
};

const getPagination = (query) => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;

  return { page, limit };
};

// ==========================================
// GET /api/admin/notifications
// Danh sách thông báo của Admin hiện tại
// ==========================================

const getNotifications = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được tài khoản Admin.",
      });
    }

    const { page, limit } = getPagination(req.query);

    const sort = req.query.sort === "oldest" ? "oldest" : "newest";

    const filter = {
      userId: adminId,
    };

    const skip = (page - 1) * limit;

    const sortOption =
      sort === "oldest" ? { createdAt: 1, _id: 1 } : { createdAt: -1, _id: -1 };

    const [total, notifications] = await Promise.all([
      Notification.countDocuments(filter),

      Notification.find(filter)
        .select(
          "_id userId type title message referenceType referenceId isRead readAt createdAt",
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        notifications,

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },

        sort,
      },
    });
  } catch (error) {
    console.error("[Admin] getNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách thông báo.",
    });
  }
};

// ==========================================
// PATCH /api/admin/notifications/:id/read
// Đánh dấu một thông báo là đã đọc
// ==========================================

const markNotificationAsRead = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được tài khoản Admin.",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thông báo không hợp lệ.",
      });
    }

    // Chỉ tìm thông báo thuộc Admin đang đăng nhập.
    const notification = await Notification.findOne({
      _id: id,
      userId: adminId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo.",
      });
    }

    // Chỉ cập nhật khi thông báo chưa đọc.
    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();

      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu thông báo là đã đọc.",
      data: {
        notification: {
          _id: notification._id,
          isRead: notification.isRead,
          readAt: notification.readAt,
        },
      },
    });
  } catch (error) {
    console.error("[Admin] markNotificationAsRead:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi cập nhật thông báo.",
    });
  }
};

// ==========================================
// DELETE /api/admin/notifications
// Xóa hàng loạt thông báo được chọn
// ==========================================

const deleteSelectedNotifications = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được tài khoản Admin.",
      });
    }

    const { ids } = req.body || {};

    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Danh sách thông báo phải có từ 1 đến 50 ID.",
      });
    }

    if (
      !ids.every((id) => typeof id === "string" && mongoose.isValidObjectId(id))
    ) {
      return res.status(400).json({
        success: false,
        message: "Danh sách ID thông báo không hợp lệ.",
      });
    }

    const uniqueIds = [...new Set(ids)];

    const result = await Notification.deleteMany({
      _id: { $in: uniqueIds },
      userId: adminId,
    });

    return res.status(200).json({
      success: true,
      message: `Đã xóa ${result.deletedCount} thông báo.`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("[Admin] deleteSelectedNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi xóa thông báo.",
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được tài khoản Admin.",
      });
    }

    // Đếm toàn bộ thông báo chưa đọc
    // của chính Admin đang đăng nhập.
    const unreadCount = await Notification.countDocuments({
      userId: adminId,
      isRead: { $ne: true },
    });

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error("[Admin] getUnreadNotificationCount:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy số thông báo chưa đọc.",
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteSelectedNotifications,
  getUnreadNotificationCount,
};
