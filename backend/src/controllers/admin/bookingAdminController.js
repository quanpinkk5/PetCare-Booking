const mongoose = require("mongoose");
const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Pet = require("../../models/Pet");
const Payment = require("../../models/Payment");
const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const BOOKING_TYPES = ["APPOINTMENT", "BOARDING"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
};

// GET /api/admin/bookings
exports.getBookings = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      bookingType = "all",
      fromDate = "",
      toDate = "",
    } = req.query;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    const normalizedSearch = String(search).trim();
    const normalizedStatus = String(status).toUpperCase();
    const normalizedType = String(bookingType).toUpperCase();

    if (
      normalizedStatus !== "ALL" &&
      !BOOKING_STATUSES.includes(normalizedStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái booking không hợp lệ.",
      });
    }

    if (normalizedType !== "ALL" && !BOOKING_TYPES.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: "Loại booking không hợp lệ.",
      });
    }

    const filter = {};

    // 1. Lọc trạng thái booking
    if (normalizedStatus !== "ALL") {
      filter.status = normalizedStatus;
    }

    // 2. Lọc loại booking
    if (normalizedType !== "ALL") {
      filter.bookingType = normalizedType;
    }

    // 3. Lọc theo ngày tạo booking
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        const start = parseDate(String(fromDate));

        if (!start) {
          return res.status(400).json({
            success: false,
            message: "fromDate không hợp lệ. Định dạng: YYYY-MM-DD.",
          });
        }

        filter.createdAt.$gte = start;
      }

      if (toDate) {
        const end = parseDate(String(toDate));

        if (!end) {
          return res.status(400).json({
            success: false,
            message: "toDate không hợp lệ. Định dạng: YYYY-MM-DD.",
          });
        }

        // Bao gồm toàn bộ ngày cuối
        end.setUTCDate(end.getUTCDate() + 1);
        filter.createdAt.$lt = end;
      }

      if (
        filter.createdAt.$gte &&
        filter.createdAt.$lt &&
        filter.createdAt.$gte >= filter.createdAt.$lt
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
        });
      }
    }

    // 4. Tìm theo mã booking, khách hàng, thú cưng
    if (normalizedSearch) {
      const regex = new RegExp(escapeRegex(normalizedSearch), "i");

      const [matchingUsers, matchingPets] = await Promise.all([
        User.find({
          $or: [{ fullName: regex }, { phone: regex }],
        })
          .select("_id")
          .lean(),

        Pet.find({
          name: regex,
        })
          .select("_id")
          .lean(),
      ]);

      filter.$or = [
        { bookingCode: regex },
        {
          customerId: {
            $in: matchingUsers.map((user) => user._id),
          },
        },
        {
          petId: {
            $in: matchingPets.map((pet) => pet._id),
          },
        },
      ];
    }

    // 5. Truy vấn danh sách và tổng số bản ghi
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .select(
          "bookingCode customerId petId branchServiceId " +
            "bookingType bookingDate startTime endTime " +
            "checkInDate checkOutDate numberOfDays " +
            "unitPrice totalPrice paymentStatus status " +
            "createdAt updatedAt",
        )
        .populate({
          path: "customerId",
          select: "_id fullName phone avatar email",
        })
        .populate({
          path: "petId",
          select: "_id name species breed avatar",
        })
        .populate({
          path: "branchServiceId",
          select: "_id branchId serviceId price pricingUnit",
          populate: [
            {
              path: "branchId",
              select: "_id name address businessId",
            },
            {
              path: "serviceId",
              select: "_id name",
            },
          ],
        })
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Booking.countDocuments(filter),
    ]);

    // 6. Chuẩn hóa response cho Frontend
    const formattedBookings = bookings.map((booking) => {
      const customer = booking.customerId;
      const pet = booking.petId;
      const branchService = booking.branchServiceId;
      const branch = branchService?.branchId;
      const service = branchService?.serviceId;

      return {
        _id: booking._id,
        bookingCode: booking.bookingCode,
        bookingType: booking.bookingType,

        status: booking.status,
        paymentStatus: booking.paymentStatus,

        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,

        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        numberOfDays: booking.numberOfDays,

        unitPrice: booking.unitPrice,
        totalPrice: booking.totalPrice,

        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,

        customer: customer
          ? {
              _id: customer._id,
              fullName: customer.fullName || "",
              phone: customer.phone || "",
              avatar: customer.avatar || "",
              email: customer.email || "",
            }
          : null,

        pet: pet
          ? {
              _id: pet._id,
              name: pet.name || "",
              species: pet.species || "",
              breed: pet.breed || "",
              avatar: pet.avatar || "",
            }
          : null,

        branch: branch
          ? {
              _id: branch._id,
              name: branch.name || "",
              address: [
                branch.address?.detail,
                branch.address?.district,
                branch.address?.province,
              ]
                .filter(Boolean)
                .join(", "),
              businessId: branch.businessId || null,
            }
          : null,

        service: service
          ? {
              _id: service._id,
              name: service.name || "",
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách booking thành công.",
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
    console.error("getBookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách booking.",
    });
  }
};

/**
 * GET /api/admin/bookings/metrics
 * Thống kê Booking toàn hệ thống cho Admin.
 */
exports.getBookingMetrics = async (req, res) => {
  try {
    const Booking = require("../../models/Booking");

    const results = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      PENDING: 0,
      CONFIRMED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    let total = 0;

    for (const item of results) {
      total += item.count;

      if (item._id && Object.prototype.hasOwnProperty.call(counts, item._id)) {
        counts[item._id] = item.count;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thống kê booking thành công.",
      data: {
        totalBookings: total,
        pendingBookings: counts.PENDING,
        confirmedBookings: counts.CONFIRMED,
        inProgressBookings: counts.IN_PROGRESS,
        completedBookings: counts.COMPLETED,
        cancelledBookings: counts.CANCELLED,
      },
    });
  } catch (error) {
    console.error("getBookingMetrics error:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê booking.",
    });
  }
};
/**
 * GET /api/admin/bookings/:id
 * Admin xem chi tiết Booking.
 */
exports.getBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "ID booking không hợp lệ.",
      });
    }

    // 2. Lấy Booking và các thông tin liên quan
    const booking = await Booking.findById(id)
      .populate({
        path: "customerId",
        select: "_id fullName email phone avatar",
      })
      .populate({
        path: "petId",
        select:
          "_id ownerId name species breed gender " +
          "dateOfBirth weight avatar personality " +
          "feedingNotes careNotes status",
      })
      .populate({
        path: "branchServiceId",
        select:
          "_id branchId serviceId price pricingUnit " +
          "durationMinutes capacity petTypes status",
        populate: [
          {
            path: "branchId",
            select:
              "_id businessId name phone email " +
              "address openingHours images status",
            populate: {
              path: "businessId",
              select: "_id name",
            },
          },
          {
            path: "serviceId",
            select: "_id name",
          },
        ],
      })
      .populate({
        path: "statusHistory.changedBy",
        select: "_id fullName email",
      })
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking.",
      });
    }

    // Lấy giao dịch thanh toán mới nhất của Booking.
    // Nếu một Booking có nhiều lần thử thanh toán,
    // không mặc định lần mới nhất đã thành công.
    const latestPayment = await Payment.findOne({
      bookingId: booking._id,
    })
      .select(
        "_id paymentCode amount currency method " +
          "provider transactionId status paidAt " +
          "failedAt failureReason createdAt",
      )
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    // Ưu tiên giao dịch PAID gần nhất để hiển thị
    // khi Booking đã được xác nhận là đã thanh toán.
    const paidPayment =
      booking.paymentStatus === "PAID"
        ? await Payment.findOne({
            bookingId: booking._id,
            status: "PAID",
          })
            .select(
              "_id paymentCode amount currency method " +
                "provider transactionId status paidAt " +
                "createdAt",
            )
            .sort({ paidAt: -1, createdAt: -1 })
            .lean()
        : null;

    const selectedPayment = paidPayment || latestPayment;

    // 3. Tách dữ liệu đã populate
    const customer = booking.customerId;
    const pet = booking.petId;

    const branchService = booking.branchServiceId;
    const branch = branchService?.branchId;
    const service = branchService?.serviceId;
    const business = branch?.businessId;

    // 4. Định dạng địa chỉ giống các trang Admin trước
    const address = branch?.address || {};

    const formattedAddress =
      typeof address === "string"
        ? address
        : [address.detail, address.district, address.province]
            .filter(Boolean)
            .join(", ");

    // 5. Chuẩn hóa lịch sử thay đổi trạng thái
    const statusHistory = (booking.statusHistory || [])
      .map((item) => ({
        status: item.status,
        changedAt: item.changedAt,
        changedBy: item.changedBy
          ? {
              _id: item.changedBy._id,
              fullName: item.changedBy.fullName || "",
              email: item.changedBy.email || "",
            }
          : null,
        note: item.note || "",
      }))
      .sort(
        (a, b) =>
          new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime(),
      );

    // 6. Response chi tiết
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết booking thành công.",
      data: {
        booking: {
          _id: booking._id,
          bookingCode: booking.bookingCode,

          bookingType: booking.bookingType,
          status: booking.status,
          paymentStatus: booking.paymentStatus,

          // Thông tin lịch hẹn
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,

          // Thông tin lưu trú
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          numberOfDays: booking.numberOfDays,
          boardingDetails: booking.boardingDetails || {},

          // Giá tại thời điểm đặt
          unitPrice: booking.unitPrice,
          totalPrice: booking.totalPrice,

          customerNote: booking.customerNote || "",

          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,

          // Khách hàng
          customer: customer
            ? {
                _id: customer._id,
                fullName: customer.fullName || "",
                email: customer.email || "",
                phone: customer.phone || "",
                avatar: customer.avatar || "",
              }
            : null,

          // Thú cưng
          pet: pet
            ? {
                _id: pet._id,
                name: pet.name || "",
                species: pet.species || "",
                breed: pet.breed || "",
                gender: pet.gender || null,
                dateOfBirth: pet.dateOfBirth,
                weight: pet.weight,
                avatar: pet.avatar || "",
                personality: pet.personality || "",
                feedingNotes: pet.feedingNotes || "",
                careNotes: pet.careNotes || "",
                status: pet.status,
              }
            : null,

          // Dịch vụ đã đặt
          service: service
            ? {
                _id: service._id,
                name: service.name || "",
              }
            : null,

          // Thông tin dịch vụ tại chi nhánh
          branchService: branchService
            ? {
                _id: branchService._id,
                pricingUnit: branchService.pricingUnit,
                durationMinutes: branchService.durationMinutes,
                petTypes: branchService.petTypes || [],
                status: branchService.status,
              }
            : null,

          // Chi nhánh
          branch: branch
            ? {
                _id: branch._id,
                name: branch.name || "",
                phone: branch.phone || "",
                email: branch.email || "",
                address: formattedAddress,
                addressDetails: branch.address || {},
                openingHours: branch.openingHours || [],
                images: branch.images || [],
                status: branch.status,
              }
            : null,

          // Thương hiệu
          business: business
            ? {
                _id: business._id,
                name: business.name || "",
              }
            : null,

          // Lịch sử trạng thái
          statusHistory,
          payment: selectedPayment
            ? {
                _id: selectedPayment._id,
                paymentCode: selectedPayment.paymentCode,
                amount: selectedPayment.amount,
                currency: selectedPayment.currency,
                method: selectedPayment.method,
                provider: selectedPayment.provider || "",
                transactionId: selectedPayment.transactionId || "",
                status: selectedPayment.status,
                paidAt: selectedPayment.paidAt || null,
                createdAt: selectedPayment.createdAt,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error("getBookingDetail error:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết booking.",
    });
  }
};
