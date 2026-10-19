const mongoose = require("mongoose");
const crypto = require("crypto");

const Booking = require("../../models/Booking");
const Pet = require("../../models/Pet");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Business = require("../../models/Business");
const Service = require("../../models/Service");
const Schedule = require("../../models/Schedule");
const ScheduleException = require("../../models/ScheduleException");

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const badRequest = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date
    : null;
};

const timeToMinutes = (value) => {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return null;
  }

  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (value) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:` +
  `${String(value % 60).padStart(2, "0")}`;

const overlap = (a, b, c, d) => a < d && c < b;

const getVietnamNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

const nextDay = (date) => new Date(date.getTime() + DAY);

const getRanges = (items = []) =>
  items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);

    return start !== null && end !== null && start < end
      ? [{ start, end, capacity: item.capacity }]
      : [];
  });

const hasCapacity = (value) => Number.isInteger(value) && value >= 0;

// ============================================
// Kiểm tra APPOINTMENT
// ============================================

const validateAppointment = async ({
  session,
  branchService,
  bookingDate,
  startTime,
}) => {
  const date = parseDate(bookingDate);
  const start = timeToMinutes(startTime);
  const duration = branchService.durationMinutes;

  if (!date || start === null) {
    throw badRequest("Ngày hoặc giờ đặt lịch không hợp lệ");
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    throw badRequest("Dịch vụ chưa cấu hình thời lượng");
  }

  const end = start + duration;

  if (end > 1440) {
    throw badRequest("Khung giờ vượt quá một ngày");
  }

  const now = getVietnamNow();

  if (
    bookingDate < now.date ||
    (bookingDate === now.date && start <= now.minutes)
  ) {
    throw badRequest("Không thể đặt lịch trong quá khứ");
  }

  const dayOfWeek = DAYS[date.getUTCDay()];

  // MongoDB does not support parallel operations on the same transaction session.
  const schedule = await Schedule.findOne({
    branchServiceId: branchService._id,
    dayOfWeek,
    isActive: true,
  })
    .session(session)
    .lean();

  const exceptions = await ScheduleException.find({
    branchServiceId: branchService._id,
    date: { $gte: date, $lt: nextDay(date) },
  })
    .session(session)
    .lean();

  const bookings = await Booking.find({
    branchServiceId: branchService._id,
    bookingType: "APPOINTMENT",
    bookingDate: {
      $gte: date,
      $lt: nextDay(date),
    },
    status: { $in: ACTIVE_STATUSES },
  })
    .session(session)
    .lean();

  if (exceptions.some((e) => e.type === "CLOSED")) {
    throw badRequest("Dịch vụ nghỉ vào ngày này", 409);
  }

  const customHours = getRanges(
    exceptions.filter((e) => e.type === "CUSTOM_HOURS"),
  );

  const blocked = getRanges(exceptions.filter((e) => e.type === "BLOCK_SLOT"));

  const ranges = customHours.length
    ? customHours
    : getRanges(schedule?.slots || []);

  // Chỉ cho phép đặt đúng slot mà availableSlots sinh ra
  const validSlot = ranges.some((range) => {
    if (start < range.start || end > range.end) {
      return false;
    }

    return (start - range.start) % duration === 0;
  });

  if (!validSlot) {
    throw badRequest("Khung giờ không thuộc lịch hoạt động", 409);
  }

  let capacity = branchService.capacity;

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw badRequest("Sức chứa dịch vụ không hợp lệ");
  }

  for (const range of customHours) {
    if (
      overlap(start, end, range.start, range.end) &&
      hasCapacity(range.capacity)
    ) {
      capacity = Math.min(capacity, range.capacity);
    }
  }

  for (const range of blocked) {
    if (!overlap(start, end, range.start, range.end)) {
      continue;
    }

    // Phương án A
    if (!hasCapacity(range.capacity)) {
      capacity = 0;
    } else {
      capacity = Math.min(capacity, range.capacity);
    }
  }

  if (capacity <= 0) {
    throw badRequest("Khung giờ đã bị chặn", 409);
  }

  const bookedCount = bookings.filter((booking) => {
    const bookedStart = timeToMinutes(booking.startTime);
    const bookedEnd = timeToMinutes(booking.endTime);

    return (
      bookedStart !== null &&
      bookedEnd !== null &&
      overlap(start, end, bookedStart, bookedEnd)
    );
  }).length;

  if (bookedCount >= capacity) {
    throw badRequest("Khung giờ đã hết chỗ", 409);
  }

  return {
    bookingDate: date,
    startTime,
    endTime: minutesToTime(end),
  };
};

// ============================================
// Kiểm tra BOARDING
// ============================================

const validateBoarding = async ({
  session,
  branchService,
  checkInDate,
  checkOutDate,
}) => {
  const checkIn = parseDate(checkInDate);
  const checkOut = parseDate(checkOutDate);

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    throw badRequest("Ngày nhận và trả thú cưng không hợp lệ");
  }

  const now = getVietnamNow();

  if (checkInDate < now.date) {
    throw badRequest("Không thể đặt lưu trú trong quá khứ");
  }

  const numberOfDays = (checkOut.getTime() - checkIn.getTime()) / DAY;

  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    throw badRequest("Số ngày lưu trú không hợp lệ");
  }

  if (
    !Number.isInteger(branchService.capacity) ||
    branchService.capacity <= 0
  ) {
    throw badRequest("Sức chứa dịch vụ không hợp lệ");
  }

  // Giới hạn để tránh request kiểm tra quá nhiều ngày
  if (numberOfDays > 90) {
    throw badRequest("Thời gian lưu trú tối đa là 90 ngày");
  }

  const bookings = await Booking.find({
    branchServiceId: branchService._id,
    bookingType: "BOARDING",
    status: { $in: ACTIVE_STATUSES },
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
  })
    .session(session)
    .lean();

  // Kiểm tra từng ngày lưu trú
  for (let day = checkIn.getTime(); day < checkOut.getTime(); day += DAY) {
    const currentDay = new Date(day);
    const followingDay = nextDay(currentDay);

    const occupied = bookings.filter(
      (booking) =>
        booking.checkInDate < followingDay && booking.checkOutDate > currentDay,
    ).length;

    if (occupied >= branchService.capacity) {
      throw badRequest(
        `Dịch vụ lưu trú đã hết chỗ ngày ` +
          currentDay.toISOString().slice(0, 10),
        409,
      );
    }
  }

  return {
    checkInDate: checkIn,
    checkOutDate: checkOut,
    numberOfDays,
  };
};

// ============================================
// POST /api/customer/bookings
// ============================================

const createBooking = async (req, res, next) => {
  let session;
  try {
    if (!req.user) throw badRequest("Bạn chưa đăng nhập", 401);
    if (req.user.role !== "CUSTOMER")
      throw badRequest("Bạn không có quyền tạo Booking", 403);
    const customerId = req.user._id || req.user.id;
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw badRequest("Dữ liệu đặt lịch phải là object");
    }
    const allowed = [
      "petId",
      "branchServiceId",
      "bookingDate",
      "startTime",
      "checkInDate",
      "checkOutDate",
      "boardingDetails",
      "customerNote",
    ];
    const invalid = Object.keys(body).filter(
      (field) => !allowed.includes(field),
    );
    if (invalid.length)
      throw badRequest("Không được gửi: " + invalid.join(", "));
    const {
      petId,
      branchServiceId,
      bookingDate,
      startTime,
      checkInDate,
      checkOutDate,
      boardingDetails,
      customerNote,
    } = body;
    if (
      typeof petId !== "string" ||
      typeof branchServiceId !== "string" ||
      !mongoose.isValidObjectId(petId) ||
      !mongoose.isValidObjectId(branchServiceId)
    ) {
      throw badRequest("petId hoặc branchServiceId không hợp lệ");
    }
    if (customerNote !== undefined && typeof customerNote !== "string") {
      throw badRequest("customerNote phải là chuỗi");
    }
    if (
      boardingDetails !== undefined &&
      (!boardingDetails ||
        typeof boardingDetails !== "object" ||
        Array.isArray(boardingDetails))
    ) {
      throw badRequest("boardingDetails phải là object");
    }

    session = await mongoose.startSession();
    let createdBooking;
    await session.withTransaction(
      async () => {
        // Increment a dedicated field: updatedAt can be unchanged within a millisecond.
        // Every retry locks the current offering before reading capacity or configuration.
        const locked = await BranchService.findOneAndUpdate(
          { _id: branchServiceId, status: "ACTIVE" },
          { $inc: { bookingRevision: 1 } },
          { session, returnDocument: "after" },
        );
        if (!locked)
          throw badRequest("Không tìm thấy dịch vụ đang hoạt động", 404);

        const pet = await Pet.findOne({
          _id: petId,
          ownerId: customerId,
          status: "ACTIVE",
        })
          .session(session)
          .lean();
        if (!pet)
          throw badRequest(
            "Không tìm thấy thú cưng đang hoạt động thuộc tài khoản của bạn",
            404,
          );
        if (
          !Array.isArray(locked.petTypes) ||
          !locked.petTypes.includes(pet.species)
        ) {
          throw badRequest("Dịch vụ không hỗ trợ loài thú cưng này");
        }
        const branch = await Branch.findOne({
          _id: locked.branchId,
          status: "ACTIVE",
        })
          .session(session)
          .lean();
        if (!branch) throw badRequest("Chi nhánh không hoạt động", 404);
        const business = await Business.findOne({
          _id: branch.businessId,
          status: "APPROVED",
        })
          .session(session)
          .lean();
        if (!business)
          throw badRequest("Doanh nghiệp chưa được phê duyệt", 404);
        const service = await Service.findOne({
          _id: locked.serviceId,
          businessId: business._id,
          status: "ACTIVE",
        })
          .session(session)
          .lean();
        if (!service) throw badRequest("Dịch vụ không hoạt động", 404);
        const bookingType = service.serviceType;
        if (!["APPOINTMENT", "BOARDING"].includes(bookingType))
          throw badRequest("Loại dịch vụ không hợp lệ");
        const expectedPricingUnit =
          bookingType === "APPOINTMENT" ? "PER_SERVICE" : "PER_DAY";
        if (
          !Number.isFinite(locked.price) ||
          locked.price < 0 ||
          locked.pricingUnit !== expectedPricingUnit
        ) {
          throw badRequest("Giá hoặc đơn vị tính dịch vụ không hợp lệ");
        }
        let bookingFields;
        if (bookingType === "APPOINTMENT") {
          if (bookingDate === undefined || startTime === undefined)
            throw badRequest("APPOINTMENT cần bookingDate và startTime");
          if (
            checkInDate !== undefined ||
            checkOutDate !== undefined ||
            boardingDetails !== undefined
          ) {
            throw badRequest("APPOINTMENT không nhận dữ liệu lưu trú");
          }
          bookingFields = await validateAppointment({
            session,
            branchService: locked,
            bookingDate,
            startTime,
          });
        } else {
          if (checkInDate === undefined || checkOutDate === undefined)
            throw badRequest("BOARDING cần checkInDate và checkOutDate");
          if (bookingDate !== undefined || startTime !== undefined)
            throw badRequest("BOARDING không nhận bookingDate hoặc startTime");
          bookingFields = await validateBoarding({
            session,
            branchService: locked,
            checkInDate,
            checkOutDate,
          });
        }
        const unitPrice = locked.price;
        const totalPrice =
          unitPrice *
          (bookingType === "BOARDING" ? bookingFields.numberOfDays : 1);
        if (!Number.isFinite(totalPrice))
          throw badRequest("Tổng tiền không hợp lệ");
        const bookingCode =
          "BK-" +
          Date.now().toString(36).toUpperCase() +
          "-" +
          crypto.randomBytes(8).toString("hex").toUpperCase();
        const [booking] = await Booking.create(
          [
            {
              bookingCode,
              customerId,
              petId,
              branchServiceId: locked._id,
              bookingType,
              ...bookingFields,
              boardingDetails:
                bookingType === "BOARDING" ? boardingDetails || {} : {},
              unitPrice,
              totalPrice,
              paymentStatus: "UNPAID",
              customerNote: customerNote?.trim() || "",
              status: "PENDING",
              statusHistory: [
                {
                  status: "PENDING",
                  changedBy: customerId,
                  note: "Khách hàng tạo Booking",
                },
              ],
            },
          ],
          { session },
        );
        createdBooking = booking;
      },
      { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } },
    );
    return res.status(201).json({
      success: true,
      message: "Tạo Booking thành công",
      data: createdBooking,
    });
  } catch (error) {
    if (
      Number.isInteger(error.status) &&
      error.status >= 400 &&
      error.status <= 599
    ) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    if (["ValidationError", "CastError"].includes(error.name)) {
      return res
        .status(400)
        .json({ success: false, message: "Thông tin đặt lịch không hợp lệ" });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Mã booking bị trùng. Vui lòng thử lại.",
      });
    }
    // The MongoDB driver wraps IllegalOperation from findOneAndUpdate with a
    // retryable-writes message and moves the real code into originalError.
    // This can happen inside a transaction even with retryWrites=false.
    const serverError =
      error.originalError || error.errorResponse?.originalError || error;
    if (
      serverError.code === 20 ||
      serverError.codeName === "IllegalOperation"
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Đặt lịch cần MongoDB hỗ trợ transaction (replica set hoặc sharded cluster).",
      });
    }
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};
// Lấy tất cả lịch đặt của khách hàng
// ============================================
// LẤY DANH SÁCH VÀ LỌC LỊCH ĐẶT THEO TRẠNG THÁI
// GET /api/customer/bookings
// ============================================

// ============================================
// LẤY DANH SÁCH LỊCH ĐẶT
// HỖ TRỢ LỌC TRẠNG THÁI VÀ PHÂN TRANG
// ============================================

const getAllBookings = async (req, res, next) => {
  try {
    const customerId = req.user._id || req.user.id;
    const { status, search = '', time = 'all' } = req.query;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100 ||
        !Number.isSafeInteger((page - 1) * limit) ||
        (status !== undefined && !validStatuses.includes(status)) || typeof search !== 'string' || search.length > 200 ||
        !['all', 'today', 'week', 'month'].includes(time)) {
      return res.status(400).json({ success: false, message: 'Bộ lọc hoặc phân trang lịch đặt không hợp lệ' });
    }
    const filter = { customerId };
    if (status) filter.status = status;
    const now = getVietnamNow();
    const today = parseDate(now.date);
    if (time !== 'all') {
      let from = today;
      let until = nextDay(today);
      if (time === 'week') {
        from = new Date(today.getTime() - ((today.getUTCDay() + 6) % 7) * DAY);
        until = new Date(from.getTime() + 7 * DAY);
      } else if (time === 'month') {
        from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        until = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));
      }
      filter.$or = [
        { bookingType: 'APPOINTMENT', bookingDate: { $gte: from, $lt: until } },
        { bookingType: 'BOARDING', checkInDate: { $lt: until }, checkOutDate: { $gt: from } },
      ];
    }
    if (search.trim()) {
      const regex = { $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      const [pets, branches, services] = await Promise.all([
        Pet.find({ ownerId: customerId, $or: [{ name: regex }, { breed: regex }] }).select('_id').lean(),
        Branch.find({ name: regex }).select('_id').lean(),
        Service.find({ name: regex }).select('_id').lean(),
      ]);
      const offerings = await BranchService.find({ $or: [
        { branchId: { $in: branches.map((item) => item._id) } },
        { serviceId: { $in: services.map((item) => item._id) } },
      ] }).select('_id').lean();
      filter.$and = [{ $or: [
        { bookingCode: regex }, { petId: { $in: pets.map((item) => item._id) } },
        { branchServiceId: { $in: offerings.map((item) => item._id) } },
      ] }];
    }
    const nowTime = minutesToTime(now.minutes);
    const [total, bookings, counts, upcoming] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter).populate('petId', 'name species breed gender dateOfBirth avatar')
        .populate({ path: 'branchServiceId', select: 'branchId serviceId price pricingUnit durationMinutes', populate: [
          { path: 'branchId', select: 'name address phone' },
          { path: 'serviceId', select: 'name description serviceType images' },
        ] }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Booking.aggregate([
        { $match: { customerId: new mongoose.Types.ObjectId(String(customerId)) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Booking.countDocuments({ customerId, status: 'CONFIRMED', $or: [
        { bookingType: 'APPOINTMENT', bookingDate: { $gt: today } },
        { bookingType: 'APPOINTMENT', bookingDate: today, startTime: { $gt: nowTime } },
        { bookingType: 'BOARDING', checkInDate: { $gte: today } },
      ] }),
    ]);
    const statusCounts = Object.fromEntries(validStatuses.map((value) => [value, counts.find((item) => item._id === value)?.count || 0]));
    return res.status(200).json({ success: true, message: 'Lấy danh sách lịch đặt thành công',
      total, currentPage: page, totalPages: Math.ceil(total / limit), limit, data: bookings,
      summary: { total: Object.values(statusCounts).reduce((sum, count) => sum + count, 0), statusCounts, upcoming },
    });
  } catch (error) { next(error); }
};
// ============================================
// XEM CHI TIẾT LỊCH ĐẶT CỦA KHÁCH HÀNG
// GET /api/customer/bookings/:id
// ============================================

const getBookingById = async (req, res, next) => {
  try {
    // Lấy mã khách hàng đang đăng nhập
    const customerId = req.user._id || req.user.id;

    // Lấy mã lịch đặt từ đường dẫn
    const { id } = req.params;

    // Kiểm tra mã lịch đặt có hợp lệ không
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Mã lịch đặt không hợp lệ",
      });
    }

    // Tìm lịch đặt thuộc khách hàng đang đăng nhập
    const booking = await Booking.findOne({
      _id: id,
      customerId: customerId,
    })
      // Lấy thông tin thú cưng
      .populate("petId", "name species breed gender dateOfBirth weight personality avatar")

      // Lấy thông tin dịch vụ tại chi nhánh
      .populate({
        path: "branchServiceId",
        select:
          "branchId serviceId price pricingUnit durationMinutes capacity petTypes",
        populate: [
          // Thông tin chi nhánh
          {
            path: "branchId",
            select: "name address phone email",
          },

          // Thông tin dịch vụ
          {
            path: "serviceId",
            select: "name description serviceType images",
          },
        ],
      })
      .lean();

    // Không tìm thấy lịch đặt của khách hàng
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch đặt của bạn",
      });
    }

    // Trả về thông tin chi tiết lịch đặt
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết lịch đặt thành công",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// HỦY LỊCH ĐẶT CỦA KHÁCH HÀNG
// PATCH /api/customer/bookings/:id/cancel
// ============================================

const cancelBooking = async (req, res, next) => {
  try {
    // Lấy mã khách hàng đang đăng nhập
    const customerId = req.user._id || req.user.id;

    // Lấy mã lịch đặt từ đường dẫn
    const { id } = req.params;
    const reasons = {
      busy: 'Có việc bận đột xuất / Thay đổi kế hoạch',
      reschedule: 'Muốn dời sang ngày hoặc khung giờ khác',
      pet_sick: 'Thú cưng gặp vấn đề sức khỏe chưa thể đi',
      other_branch: 'Đặt nhầm cơ sở hoặc tìm được chỗ gần hơn',
      other: 'Lý do khác',
    };
    const reason = req.body?.reason;
    if (reason !== undefined && (typeof reason !== 'string' || !Object.hasOwn(reasons, reason))) {
      return res.status(400).json({ success: false, message: 'Lý do hủy lịch không hợp lệ' });
    }

    // Kiểm tra mã lịch đặt
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Mã lịch đặt không hợp lệ",
      });
    }

    // Kiểm tra lịch đặt có thuộc khách hàng không
    const booking = await Booking.findOne({
      _id: id,
      customerId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch đặt của bạn",
      });
    }

    // Chỉ cho phép hủy lịch đặt đang chờ hoặc đã xác nhận
    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Lịch đặt ở trạng thái hiện tại không thể hủy",
      });
    }

    // Không cho phép khách hàng tự hủy lịch đã thanh toán.
    // Trường hợp này cần quy trình hoàn tiền riêng.
    if (booking.paymentStatus !== "UNPAID") {
      return res.status(409).json({
        success: false,
        message:
          "Lịch đặt đã thanh toán cần được xử lý hoàn tiền trước khi hủy",
      });
    }

    // Cập nhật trạng thái bằng điều kiện để tránh
    // ghi đè nếu trạng thái vừa thay đổi
    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: id,
        customerId,
        status: { $in: ["PENDING", "CONFIRMED"] },
        paymentStatus: "UNPAID",
      },
      {
        $set: {
          status: "CANCELLED",
        },
        $push: {
          statusHistory: {
            status: "CANCELLED",
            changedBy: customerId,
            note: reason ? `Khách hàng hủy lịch đặt: ${reasons[reason]}` : "Khách hàng hủy lịch đặt",
          },
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      return res.status(409).json({
        success: false,
        message: "Trạng thái lịch đặt đã thay đổi, vui lòng kiểm tra lại",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hủy lịch đặt thành công",
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
};
