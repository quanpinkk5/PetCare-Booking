
const mongoose = require("mongoose");

const User = require("../../models/User");
const Booking = require("../../models/Booking");

// Phải đăng ký các model trước khi sử dụng populate()
require("../../models/Business");
require("../../models/Branch");
require("../../models/Service");
require("../../models/BranchService");

// GET /api/admin/users/:id/bookings
const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra ID người dùng
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    // 2. Kiểm tra tài khoản Customer
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
        message: "Chỉ hỗ trợ xem booking của CUSTOMER",
      });
    }

    // 3. Kiểm tra phân trang
    const rawLimit = String(req.query.limit ?? "5");
    const rawPage = String(req.query.page ?? "1");

    if (
      !/^\d+$/.test(rawLimit) ||
      !/^\d+$/.test(rawPage)
    ) {
      return res.status(400).json({
        success: false,
        message: "page và limit phải là số nguyên dương",
      });
    }

    const limit = Number(rawLimit);
    const page = Number(rawPage);

    if (
      !Number.isSafeInteger(limit) ||
      !Number.isSafeInteger(page) ||
      limit < 1 ||
      limit > 50 ||
      page < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "page phải >= 1 và limit từ 1 đến 50",
      });
    }

    // 4. Lọc booking theo Customer
    const filter = {
      customerId: user._id,
    };

    // 5. Lấy booking và thông tin liên kết
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .select(
          "_id bookingCode bookingType branchServiceId " +
          "bookingDate checkInDate status totalPrice createdAt"
        )
        .populate({
          path: "branchServiceId",
          select: "serviceId branchId",
          populate: [
            {
              path: "serviceId",
              select: "name",
            },
            {
              path: "branchId",
              select: "name businessId",
              populate: {
                path: "businessId",
                select: "name",
              },
            },
          ],
        })
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Booking.countDocuments(filter),
    ]);

    // 6. Chuyển dữ liệu sang cấu trúc dễ sử dụng ở frontend
    const formattedBookings = bookings.map((booking) => {
      const branchService = booking.branchServiceId;
      const service = branchService?.serviceId;
      const branch = branchService?.branchId;
      const business = branch?.businessId;

      return {
        _id: booking._id,
        bookingCode: booking.bookingCode,
        bookingType: booking.bookingType,

        serviceName: service?.name || "Không xác định",
        businessName: business?.name || "Không xác định",
        branchName: branch?.name || "Không xác định",

        bookingDate: booking.bookingDate,
        checkInDate: booking.checkInDate,
        createdAt: booking.createdAt,

        status: booking.status,
        totalPrice: booking.totalPrice,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách booking của khách hàng thành công",
      data: {
        bookings: formattedBookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin getUserBookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách booking",
    });
  }
};

module.exports = {
  getUserBookings,
};
