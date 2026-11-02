const Booking = require("../../models/Booking");
const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const BranchService = require("../../models/BranchService");
const User = require("../../models/User");
const Pet = require("../../models/Pet");

// ========================================
// 1. CONSTANTS
// ========================================

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const VALID_TYPES = ["APPOINTMENT", "BOARDING"];

// ========================================
// 2. HELPER FUNCTIONS
// ========================================

const isValidId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const badRequest = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

const notOwned = (res) =>
  res.status(404).json({
    success: false,
    message: "Không tìm thấy Booking thuộc doanh nghiệp của bạn",
  });

const serverError = (res, error, action) => {
  console.error(`${action} Booking error:`, error);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return badRequest(res, error.message);
  }

  return res.status(500).json({
    success: false,
    message: `Không thể ${action} Booking`,
  });
};

// Kiểm tra ngày YYYY-MM-DD có hợp lệ không
const parseDateKey = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
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

// Tạo khoảng ngày theo múi giờ Việt Nam
// Bao gồm cả ngày bắt đầu và ngày kết thúc
const buildDateRange = (fromDate, toDate) => {
  const range = {};

  if (fromDate) {
    range.$gte = new Date(`${fromDate}T00:00:00.000+07:00`);
  }

  if (toDate) {
    const nextDay = parseDateKey(toDate);

    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const nextDayKey = nextDay.toISOString().slice(0, 10);

    range.$lt = new Date(`${nextDayKey}T00:00:00.000+07:00`);
  }

  return range;
};

// ========================================
// 3. KIỂM TRA QUYỀN BUSINESS OWNER
// ========================================

// Lấy toàn bộ BranchService thuộc Owner
const getOwnedBranchServiceIds = async ({
  ownerId,
  branchId,
  branchServiceId,
}) => {
  // Lấy doanh nghiệp thuộc Owner
  const businesses = await Business.find({
    ownerId,
  })
    .select("_id")
    .lean();

  const businessIds = businesses.map((item) => item._id);

  // Lấy chi nhánh thuộc doanh nghiệp
  const branchQuery = {
    businessId: {
      $in: businessIds,
    },
  };

  if (branchId) {
    branchQuery._id = branchId;
  }

  const branches = await Branch.find(branchQuery).select("_id").lean();

  const branchIds = branches.map((item) => item._id);

  // Lấy dịch vụ thuộc chi nhánh
  const serviceQuery = {
    branchId: {
      $in: branchIds,
    },
  };

  if (branchServiceId) {
    serviceQuery._id = branchServiceId;
  }

  const services = await BranchService.find(serviceQuery).select("_id").lean();

  return services.map((item) => item._id);
};

// Kiểm tra một Booking có thuộc Owner không
const getOwnedBooking = async (bookingId, ownerId) => {
  const booking = await Booking.findById(bookingId)
    .select("branchServiceId status paymentStatus")
    .lean();

  if (!booking) return null;

  const service = await BranchService.findById(booking.branchServiceId)
    .select("branchId")
    .lean();

  if (!service) return null;

  const branch = await Branch.findById(service.branchId)
    .select("businessId")
    .lean();

  if (!branch) return null;

  const business = await Business.exists({
    _id: branch.businessId,
    ownerId,
  });

  return business ? booking : null;
};

// ========================================
// 4. POPULATE BOOKING
// ========================================

// Dùng chung để lấy thông tin:
// - Khách hàng
// - Thú cưng
// - Dịch vụ
// - Chi nhánh
// - Lịch sử trạng thái
const populateBooking = (query, includeHistory = false) => {
  let result = query
    .populate({
      path: "customerId",
      select: "fullName name email phone",
    })
    .populate({
      path: "petId",
      select: "name species breed gender dateOfBirth",
    })
    .populate({
      path: "branchServiceId",
      select: "branchId serviceId price status",
      populate: [
        {
          path: "branchId",
          select: "name address businessId",
        },
        {
          path: "serviceId",
          select: "name description",
        },
      ],
    });

  if (includeHistory) {
    result = result.populate({
      path: "statusHistory.changedBy",
      select: "fullName name email",
    });
  }

  return result;
};

// ========================================
// 5. GET DANH SÁCH BOOKING
// GET /api/business-owner/bookings
// ========================================

const getBookings = async (req, res) => {
  try {
    const {
      branchId,
      branchServiceId,
      status,
      bookingType,
      search,
      fromDate,
      toDate,
    } = req.query;

    // 5.1. Kiểm tra các bộ lọc
    if (branchId && !isValidId(branchId)) {
      return badRequest(res, "branchId không hợp lệ");
    }

    if (branchServiceId && !isValidId(branchServiceId)) {
      return badRequest(res, "branchServiceId không hợp lệ");
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return badRequest(res, "Trạng thái Booking không hợp lệ");
    }

    if (bookingType && !VALID_TYPES.includes(bookingType)) {
      return badRequest(res, "Loại Booking không hợp lệ");
    }

    // 5.2. Kiểm tra khoảng ngày
    if (fromDate && !parseDateKey(fromDate)) {
      return badRequest(res, "fromDate không hợp lệ (YYYY-MM-DD)");
    }

    if (toDate && !parseDateKey(toDate)) {
      return badRequest(res, "toDate không hợp lệ (YYYY-MM-DD)");
    }

    if (fromDate && toDate && fromDate > toDate) {
      return badRequest(res, "Từ ngày không được sau đến ngày");
    }

    // 5.3. Kiểm tra từ khóa
    if (search !== undefined && typeof search !== "string") {
      return badRequest(res, "Từ khóa tìm kiếm không hợp lệ");
    }

    const keyword = (search || "").trim();

    if (keyword.length > 100) {
      return badRequest(res, "Từ khóa tìm kiếm không được quá 100 ký tự");
    }

    // 5.4. Kiểm tra phân trang
    const page = Number(req.query.page ?? 1);

    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit)
    ) {
      return badRequest(res, "page phải >= 1 và limit phải từ 1 đến 100");
    }

    // 5.5. Chỉ lấy dịch vụ thuộc Owner
    const ownedServiceIds = await getOwnedBranchServiceIds({
      ownerId: req.user._id,
      branchId,
      branchServiceId,
    });

    // 5.6. Tạo filter MongoDB
    const filter = {
      branchServiceId: {
        $in: ownedServiceIds,
      },
    };

    if (status) {
      filter.status = status;
    }

    if (bookingType) {
      filter.bookingType = bookingType;
    }

    // 5.7. Lọc khoảng ngày
    //
    // APPOINTMENT -> bookingDate
    // BOARDING -> checkInDate
    if (fromDate || toDate) {
      const dateRange = buildDateRange(fromDate, toDate);

      if (bookingType === "APPOINTMENT") {
        filter.bookingDate = dateRange;
      } else if (bookingType === "BOARDING") {
        filter.checkInDate = dateRange;
      } else {
        // Nếu không chọn loại Booking
        // thì lọc cả hai loại
        filter.$or = [
          {
            bookingType: "APPOINTMENT",
            bookingDate: dateRange,
          },
          {
            bookingType: "BOARDING",
            checkInDate: dateRange,
          },
        ];
      }
    }

    // 5.8. Tìm kiếm theo:
    // - Mã Booking
    // - Tên khách hàng
    // - Số điện thoại
    // - Email
    // - Tên thú cưng
    if (keyword) {
      const regex = new RegExp(escapeRegex(keyword), "i");

      const [users, pets] = await Promise.all([
        User.find({
          $or: [
            { fullName: regex },
            { name: regex },
            { phone: regex },
            { email: regex },
          ],
        })
          .select("_id")
          .lean(),

        Pet.find({
          name: regex,
        })
          .select("_id")
          .lean(),
      ]);

      const customerIds = users.map((item) => item._id);

      const petIds = pets.map((item) => item._id);

      // Dùng $and để không ghi đè
      // $or đang lọc ngày phía trên
      filter.$and = [
        {
          $or: [
            {
              bookingCode: regex,
            },
            {
              customerId: {
                $in: customerIds,
              },
            },
            {
              petId: {
                $in: petIds,
              },
            },
          ],
        },
      ];
    }

    // 5.9. Đếm và lấy dữ liệu theo trang
    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),

      populateBooking(
        Booking.find(filter)
          .select(
            "bookingCode customerId petId " +
              "branchServiceId bookingType " +
              "bookingDate startTime endTime " +
              "checkInDate checkOutDate " +
              "numberOfDays unitPrice totalPrice " +
              "paymentStatus customerNote " +
              "status createdAt updatedAt",
          )
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .skip((page - 1) * limit)
          .limit(limit),
      ).lean(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Booking thành công",
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return serverError(res, error, "lấy danh sách");
  }
};

// ========================================
// 6. GET CHI TIẾT BOOKING
// GET /api/business-owner/bookings/:id
// ========================================

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return badRequest(res, "ID Booking không hợp lệ");
    }

    // Kiểm tra quyền Owner trước
    const owned = await getOwnedBooking(id, req.user._id);

    if (!owned) {
      return notOwned(res);
    }

    // Lấy chi tiết và populate
    const booking = await populateBooking(Booking.findById(id), true).lean();

    if (!booking) {
      return notOwned(res);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết Booking thành công",
      data: {
        booking,
      },
    });
  } catch (error) {
    return serverError(res, error, "lấy chi tiết");
  }
};

// ========================================
// 7. KIỂM TRA GHI CHÚ
// ========================================

const validateNote = (note) =>
  typeof note === "string" && note.trim().length <= 500;

// ========================================
// 8. DUYỆT / TỪ CHỐI BOOKING
// PATCH /api/business-owner/bookings/:id/status
// ========================================
//
// PENDING -> CONFIRMED
// PENDING -> CANCELLED
//
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, note = "" } = req.body || {};

    if (!isValidId(id)) {
      return badRequest(res, "ID Booking không hợp lệ");
    }

    if (!["CONFIRMED", "CANCELLED"].includes(status)) {
      return badRequest(res, "Chỉ được Duyệt hoặc Từ chối Booking");
    }

    if (!validateNote(note)) {
      return badRequest(res, "Ghi chú phải là chuỗi tối đa 500 ký tự");
    }

    if (status === "CANCELLED" && !note.trim()) {
      return badRequest(res, "Vui lòng nhập lý do từ chối Booking");
    }

    // 8.1. Kiểm tra quyền
    const owned = await getOwnedBooking(id, req.user._id);

    if (!owned) {
      return notOwned(res);
    }

    // 8.2. Chỉ xử lý Booking PENDING
    if (owned.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message:
          `Booking đang ở trạng thái ${owned.status}. ` +
          "Chỉ Booking PENDING mới được duyệt hoặc từ chối.",
      });
    }

    // 8.3. Cập nhật nguyên tử
    // Tránh hai yêu cầu xử lý cùng Booking
    const updatedBooking = await populateBooking(
      Booking.findOneAndUpdate(
        {
          _id: id,
          branchServiceId: owned.branchServiceId,
          status: "PENDING",
        },
        {
          $set: {
            status,
          },
          $push: {
            statusHistory: {
              status,
              changedAt: new Date(),
              changedBy: req.user._id,
              note: note.trim() || "Business Owner đã duyệt Booking",
            },
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ),
      true,
    );

    if (!updatedBooking) {
      return res.status(409).json({
        success: false,
        message: "Booking vừa được xử lý bởi yêu cầu khác. Vui lòng tải lại.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "CONFIRMED"
          ? "Duyệt Booking thành công"
          : "Từ chối Booking thành công",
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    return serverError(res, error, "cập nhật trạng thái");
  }
};

// ========================================
// 9. BẮT ĐẦU / HOÀN THÀNH DỊCH VỤ
// PATCH /api/business-owner/bookings/:id/progress
// ========================================
//
// CONFIRMED -> IN_PROGRESS
// IN_PROGRESS -> COMPLETED
//

const updateBookingProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note = "" } = req.body || {};

    // 1. Kiểm tra ID Booking
    if (!isValidId(id)) {
      return badRequest(res, "ID Booking không hợp lệ");
    }

    // 2. Kiểm tra trạng thái yêu cầu
    if (!["IN_PROGRESS", "COMPLETED"].includes(status)) {
      return badRequest(res, "Trạng thái tiến độ không hợp lệ");
    }

    // 3. Kiểm tra ghi chú
    if (!validateNote(note)) {
      return badRequest(
        res,
        "Ghi chú phải là chuỗi tối đa 500 ký tự"
      );
    }

    // 4. Kiểm tra quyền Business Owner
    const owned = await getOwnedBooking(id, req.user._id);

    if (!owned) {
      return notOwned(res);
    }

    // ==========================================
    // 5. CHẶN BOOKING LOẠI BOARDING
    // ==========================================
    // BOARDING chỉ được Check-in / Check-out
    // tại module Quản lý lưu trú.
    const bookingInfo = await Booking.findById(id)
      .select("bookingType")
      .lean();

    if (bookingInfo?.bookingType === "BOARDING") {
      return res.status(400).json({
        success: false,
        message:
          "Đơn lưu trú phải được Check-in hoặc Check-out tại Quản lý lưu trú.",
      });
    }

    // 6. Kiểm tra luồng chuyển trạng thái
    const expectedStatus =
      status === "IN_PROGRESS"
        ? "CONFIRMED"
        : "IN_PROGRESS";

    if (owned.status !== expectedStatus) {
      return res.status(409).json({
        success: false,
        message:
          `Không thể chuyển từ ${owned.status} sang ${status}. ` +
          `Booking phải đang ở trạng thái ${expectedStatus}.`,
      });
    }

    // 7. Cập nhật nguyên tử
    const updatedBooking = await populateBooking(
      Booking.findOneAndUpdate(
        {
          _id: id,
          branchServiceId: owned.branchServiceId,

          // Chỉ cho phép APPOINTMENT
          bookingType: "APPOINTMENT",

          status: expectedStatus,
        },
        {
          $set: {
            status,
          },
          $push: {
            statusHistory: {
              status,
              changedAt: new Date(),
              changedBy: req.user._id,
              note:
                note.trim() ||
                (status === "IN_PROGRESS"
                  ? "Business Owner bắt đầu thực hiện dịch vụ"
                  : "Business Owner hoàn thành dịch vụ"),
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ),
      true
    );

    if (!updatedBooking) {
      return res.status(409).json({
        success: false,
        message:
          "Booking vừa được thay đổi bởi yêu cầu khác. Vui lòng tải lại.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "IN_PROGRESS"
          ? "Bắt đầu dịch vụ thành công"
          : "Hoàn thành dịch vụ thành công",
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    return serverError(res, error, "cập nhật tiến độ");
  }
};


/**
 * GET /api/business-owner/bookings/filter-options
 * Lấy chi nhánh và dịch vụ thuộc Business Owner.
 */
const getBookingFilterOptions = async (req, res) => {
  try {
    const businesses = await Business.find({
      ownerId: req.user._id,
    })
      .select("_id")
      .lean();

    const businessIds = businesses.map((item) => item._id);

    const branches = await Branch.find({
      businessId: { $in: businessIds },
    })
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    const branchIds = branches.map((item) => item._id);

    const branchServices = await BranchService.find({
      branchId: { $in: branchIds },
    })
      .select("_id branchId serviceId")
      .populate({
        path: "serviceId",
        select: "name",
      })
      .lean();

    const services = branchServices.map((item) => ({
      id: String(item._id),
      name: item.serviceId?.name || "Dịch vụ",
      branchId: String(item.branchId),
    }));

    return res.status(200).json({
      success: true,
      data: {
        branches: branches.map((item) => ({
          id: String(item._id),
          name: item.name || "Chi nhánh",
        })),
        services,
      },
    });
  } catch (error) {
    console.error("Get booking filter options error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy dữ liệu bộ lọc Booking",
    });
  }
};

// ========================================
// 10. EXPORT CONTROLLER
// ========================================

module.exports = {
  getBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingProgress,
  getBookingFilterOptions,
};
