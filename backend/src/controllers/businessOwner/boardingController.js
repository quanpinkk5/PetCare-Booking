const Booking = require("../../models/Booking");
const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const BranchService = require("../../models/BranchService");
const User = require("../../models/User");
const Pet = require("../../models/Pet");

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const isValidId = (id) =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const errorResponse = (res, code, message) =>
  res.status(code).json({
    success: false,
    message,
  });

const isDateKey = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};

// Ngày theo múi giờ Việt Nam.
// Điều kiện $lt ngày tiếp theo giúp lấy hết ngày cuối.
const makeDateRange = (fromDate, toDate) => {
  const range = {};

  if (fromDate) {
    range.$gte = new Date(`${fromDate}T00:00:00+07:00`);
  }

  if (toDate) {
    const nextDay = new Date(`${toDate}T00:00:00Z`);

    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const nextKey = nextDay.toISOString().slice(0, 10);

    range.$lt = new Date(`${nextKey}T00:00:00+07:00`);
  }

  return range;
};

// ============================================
// 1. KIỂM TRA QUYỀN BUSINESS OWNER
// ============================================

const getOwnedServiceIds = async (ownerId, branchId) => {
  const businesses = await Business.find({
    ownerId,
  })
    .select("_id")
    .lean();

  const businessIds = businesses.map((item) => item._id);

  const branchFilter = {
    businessId: { $in: businessIds },
  };

  if (branchId) {
    branchFilter._id = branchId;
  }

  const branches = await Branch.find(branchFilter).select("_id").lean();

  const branchIds = branches.map((item) => item._id);

  const services = await BranchService.find({
    branchId: { $in: branchIds },
  })
    .select("_id")
    .lean();

  return services.map((item) => item._id);
};

// Trả về Booking gốc nếu đúng là đơn BOARDING
// và thuộc doanh nghiệp đang đăng nhập.
const findOwnedBoarding = async (id, ownerId) => {
  const booking = await Booking.findOne({
    _id: id,
    bookingType: "BOARDING",
  })
    .select(
      "bookingType branchServiceId status " +
        "checkInDate checkOutDate boardingDetails",
    )
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

// ============================================
// 2. POPULATE DỮ LIỆU
// ============================================

const populateBoarding = (query, includeHistory = false) => {
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
          select: "name address",
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

// ============================================
// 3. DANH SÁCH LƯU TRÚ
// GET /api/business-owner/boarding
// ============================================

const getBoardings = async (req, res) => {
  try {
    const {
      search = "",
      status,
      branchId,
      fromDate,
      toDate,
      page = "1",
      limit = "5",
    } = req.query;

    if (branchId && !isValidId(branchId)) {
      return errorResponse(res, 400, "branchId không hợp lệ");
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return errorResponse(res, 400, "Trạng thái lưu trú không hợp lệ");
    }

    if (typeof search !== "string" || search.trim().length > 100) {
      return errorResponse(res, 400, "Từ khóa tìm kiếm không hợp lệ");
    }

    if (fromDate && !isDateKey(fromDate)) {
      return errorResponse(res, 400, "fromDate không hợp lệ");
    }

    if (toDate && !isDateKey(toDate)) {
      return errorResponse(res, 400, "toDate không hợp lệ");
    }

    if (fromDate && toDate && fromDate > toDate) {
      return errorResponse(res, 400, "Từ ngày không được sau đến ngày");
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isSafeInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100 ||
      !Number.isSafeInteger((pageNumber - 1) * limitNumber)
    ) {
      return errorResponse(
        res,
        400,
        "page phải >= 1 và limit phải từ 1 đến 100",
      );
    }

    const serviceIds = await getOwnedServiceIds(req.user._id, branchId);

    // Chỉ lấy Booking BOARDING thuộc Owner.
    const filter = {
      bookingType: "BOARDING",
      branchServiceId: { $in: serviceIds },
    };

    if (status) {
      filter.status = status;
    }

    // Lọc theo ngày nhận thú cưng dự kiến.
    if (fromDate || toDate) {
      filter.checkInDate = makeDateRange(fromDate, toDate);
    }

    // Tìm theo mã, tên/số điện thoại chủ nuôi
    // và tên thú cưng.
    const keyword = search.trim();

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

      filter.$or = [
        { bookingCode: regex },
        {
          customerId: {
            $in: users.map((item) => item._id),
          },
        },
        {
          petId: {
            $in: pets.map((item) => item._id),
          },
        },
      ];
    }

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),

      populateBoarding(
        Booking.find(filter)
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber),
      ).lean(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách lưu trú thành công",
      data: {
        bookings,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    console.error("Get boardings error:", error);

    return errorResponse(res, 500, "Không thể lấy danh sách lưu trú");
  }
};

// ============================================
// 4. CHI TIẾT LƯU TRÚ
// GET /api/business-owner/boarding/:id
// ============================================

const getBoardingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return errorResponse(res, 400, "ID Booking không hợp lệ");
    }

    const owned = await findOwnedBoarding(id, req.user._id);

    if (!owned) {
      return errorResponse(
        res,
        404,
        "Không tìm thấy đơn lưu trú thuộc doanh nghiệp của bạn",
      );
    }

    const booking = await populateBoarding(Booking.findById(id), true).lean();

    if (!booking) {
      return errorResponse(res, 404, "Không tìm thấy đơn lưu trú");
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết lưu trú thành công",
      data: { booking },
    });
  } catch (error) {
    console.error("Get boarding detail error:", error);

    return errorResponse(res, 500, "Không thể lấy chi tiết lưu trú");
  }
};

// ============================================
// 5. CHECK-IN
// PATCH /api/business-owner/boarding/:id/check-in
//
// CONFIRMED -> IN_PROGRESS
// ============================================

const checkInBoarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = "" } = req.body || {};

    if (!isValidId(id)) {
      return errorResponse(res, 400, "ID Booking không hợp lệ");
    }

    if (typeof note !== "string" || note.trim().length > 500) {
      return errorResponse(res, 400, "Ghi chú phải là chuỗi tối đa 500 ký tự");
    }

    const booking = await findOwnedBoarding(id, req.user._id);

    if (!booking) {
      return errorResponse(
        res,
        404,
        "Không tìm thấy đơn lưu trú thuộc doanh nghiệp của bạn",
      );
    }

    if (booking.status !== "CONFIRMED") {
      return errorResponse(
        res,
        409,
        "Chỉ có thể Check-in đơn lưu trú đã xác nhận",
      );
    }

    const now = new Date();

    // Điều kiện status chống Check-in trùng
    // khi có hai yêu cầu đồng thời.
    const updatedBooking = await populateBoarding(
      Booking.findOneAndUpdate(
        {
          _id: id,
          bookingType: "BOARDING",
          branchServiceId: booking.branchServiceId,
          status: "CONFIRMED",
        },
        {
          $set: {
            status: "IN_PROGRESS",
            "boardingDetails.actualCheckInAt": now,
          },
          $push: {
            statusHistory: {
              status: "IN_PROGRESS",
              changedAt: now,
              changedBy: req.user._id,
              note: note.trim() || "Business Owner đã Check-in thú cưng",
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
      return errorResponse(
        res,
        409,
        "Đơn lưu trú vừa được xử lý. Vui lòng tải lại.",
      );
    }

    return res.status(200).json({
      success: true,
      message: "Check-in thú cưng thành công",
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    console.error("Check-in boarding error:", error);

    return errorResponse(res, 500, "Không thể Check-in thú cưng");
  }
};

// ============================================
// 6. CHECK-OUT
// PATCH /api/business-owner/boarding/:id/check-out
//
// IN_PROGRESS -> COMPLETED
// ============================================

const checkOutBoarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = "" } = req.body || {};

    if (!isValidId(id)) {
      return errorResponse(res, 400, "ID Booking không hợp lệ");
    }

    if (typeof note !== "string" || note.trim().length > 500) {
      return errorResponse(res, 400, "Ghi chú phải là chuỗi tối đa 500 ký tự");
    }

    const booking = await findOwnedBoarding(id, req.user._id);

    if (!booking) {
      return errorResponse(
        res,
        404,
        "Không tìm thấy đơn lưu trú thuộc doanh nghiệp của bạn",
      );
    }

    if (booking.status !== "IN_PROGRESS") {
      return errorResponse(
        res,
        409,
        "Chỉ có thể Check-out thú cưng đang lưu trú",
      );
    }

    const now = new Date();

    const updatedBooking = await populateBoarding(
      Booking.findOneAndUpdate(
        {
          _id: id,
          bookingType: "BOARDING",
          branchServiceId: booking.branchServiceId,
          status: "IN_PROGRESS",
        },
        {
          $set: {
            status: "COMPLETED",
            "boardingDetails.actualCheckOutAt": now,
          },
          $push: {
            statusHistory: {
              status: "COMPLETED",
              changedAt: now,
              changedBy: req.user._id,
              note: note.trim() || "Business Owner đã Check-out thú cưng",
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
      return errorResponse(
        res,
        409,
        "Đơn lưu trú vừa được xử lý. Vui lòng tải lại.",
      );
    }

    return res.status(200).json({
      success: true,
      message: "Check-out thú cưng thành công",
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    console.error("Check-out boarding error:", error);

    return errorResponse(res, 500, "Không thể Check-out thú cưng");
  }
};

// ============================================
// 7. EXPORT
// ============================================

module.exports = {
  getBoardings,
  getBoardingById,
  checkInBoarding,
  checkOutBoarding,
};
