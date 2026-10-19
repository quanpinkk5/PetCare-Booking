const mongoose = require("mongoose");

const Schedule = require("../../models/Schedule");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Business = require("../../models/Business");

// ==============================
// POST - Tạo lịch dịch vụ
// ==============================
const createSchedule = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tạo lịch dịch vụ",
      });
    }

    const { branchServiceId, dayOfWeek, slots, isActive } = req.body;

    // 2. Kiểm tra BranchService ID
    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    // 3. Kiểm tra ngày trong tuần
    const validDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    if (!validDays.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: "dayOfWeek không hợp lệ",
      });
    }

    // 4. Kiểm tra slots
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      !Array.isArray(slots) ||
      slots.length === 0 ||
      !slots.every(
        (slot) =>
          slot &&
          typeof slot === "object" &&
          !Array.isArray(slot) &&
          typeof slot.startTime === "string" &&
          typeof slot.endTime === "string" &&
          timeRegex.test(slot.startTime) &&
          timeRegex.test(slot.endTime) &&
          slot.startTime < slot.endTime,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "slots phải là mảng khung giờ hợp lệ",
      });
    }

    // 5. Không cho các khung giờ chồng nhau
    const sortedSlots = [...slots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    for (let i = 1; i < sortedSlots.length; i++) {
      if (sortedSlots[i].startTime < sortedSlots[i - 1].endTime) {
        return res.status(400).json({
          success: false,
          message: "Các khung giờ không được chồng nhau",
        });
      }
    }

    // 6. Kiểm tra isActive
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive phải là true hoặc false",
      });
    }

    // 7. Tìm BranchService
    const branchService = await BranchService.findById(branchServiceId);

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 8. Tìm Branch
    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 9. Kiểm tra Business thuộc Owner
    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của bạn",
      });
    }

    // 10. Kiểm tra Service thuộc cùng Business
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 11. Kiểm tra lịch đã tồn tại trong ngày chưa
    const existingSchedule = await Schedule.findOne({
      branchServiceId,
      dayOfWeek,
    });

    if (existingSchedule) {
      return res.status(409).json({
        success: false,
        message: "Dịch vụ đã có lịch cho ngày này",
      });
    }

    // 12. Tạo lịch
    const schedule = await Schedule.create({
      branchServiceId,
      dayOfWeek,
      slots: sortedSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo lịch dịch vụ thành công",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// PATCH - Cập nhật lịch dịch vụ
// ==============================
const updateSchedule = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật lịch dịch vụ",
      });
    }

    // 2. Kiểm tra Schedule ID
    const scheduleId = req.params.id;

    if (!mongoose.isValidObjectId(scheduleId)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch dịch vụ không hợp lệ",
      });
    }

    // 3. Tìm Schedule
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch dịch vụ",
      });
    }

    // 4. Kiểm tra quyền sở hữu qua BranchService -> Branch -> Business
    const branchService = await BranchService.findById(
      schedule.branchServiceId
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Lịch dịch vụ không thuộc doanh nghiệp của bạn",
      });
    }

    // 5. Kiểm tra Service thuộc cùng Business
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 6. Lấy dữ liệu cập nhật
    const { dayOfWeek, slots, isActive } = req.body;

    // Không cho đổi branchServiceId
    if (req.body.branchServiceId !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Không được thay đổi branchServiceId",
      });
    }

    if (
      dayOfWeek === undefined &&
      slots === undefined &&
      isActive === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    // 7. Kiểm tra ngày trong tuần
    if (dayOfWeek !== undefined) {
      const validDays = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];

      if (!validDays.includes(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "dayOfWeek không hợp lệ",
        });
      }

      // Kiểm tra trùng lịch khi đổi ngày
      if (dayOfWeek !== schedule.dayOfWeek) {
        const existingSchedule = await Schedule.findOne({
          _id: { $ne: scheduleId },
          branchServiceId: schedule.branchServiceId,
          dayOfWeek,
        });

        if (existingSchedule) {
          return res.status(409).json({
            success: false,
            message: "Dịch vụ đã có lịch cho ngày này",
          });
        }
      }
    }

    // 8. Kiểm tra các khung giờ
    let sortedSlots;

    if (slots !== undefined) {
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

      if (
        !Array.isArray(slots) ||
        slots.length === 0 ||
        !slots.every(
          (slot) =>
            slot &&
            typeof slot === "object" &&
            !Array.isArray(slot) &&
            typeof slot.startTime === "string" &&
            typeof slot.endTime === "string" &&
            timeRegex.test(slot.startTime) &&
            timeRegex.test(slot.endTime) &&
            slot.startTime < slot.endTime
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "slots phải là mảng khung giờ hợp lệ",
        });
      }

      // Sắp xếp khung giờ
      sortedSlots = [...slots].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      // Kiểm tra khung giờ chồng nhau
      for (let i = 1; i < sortedSlots.length; i++) {
        if (
          sortedSlots[i].startTime <
          sortedSlots[i - 1].endTime
        ) {
          return res.status(400).json({
            success: false,
            message: "Các khung giờ không được chồng nhau",
          });
        }
      }
    }

    // 9. Kiểm tra isActive
    if (
      isActive !== undefined &&
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive phải là true hoặc false",
      });
    }

    // 10. Cập nhật các field được gửi lên
    if (dayOfWeek !== undefined) {
      schedule.dayOfWeek = dayOfWeek;
    }

    if (sortedSlots !== undefined) {
      schedule.slots = sortedSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
    }

    if (isActive !== undefined) {
      schedule.isActive = isActive;
    }

    // 11. Lưu thay đổi
    await schedule.save();

    // 12. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật lịch dịch vụ thành công",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// GET - Danh sách lịch của BranchService
// ==============================
const getAllSchedules = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem lịch dịch vụ",
      });
    }

    // 2. Lấy branchServiceId từ query
    const { branchServiceId } = req.query;

    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    // 3. Tìm BranchService
    const branchService = await BranchService.findById(
      branchServiceId
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 4. Tìm Branch
    const branch = await Branch.findById(
      branchService.branchId
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 5. Kiểm tra quyền sở hữu Business
    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch thuộc doanh nghiệp của bạn",
      });
    }

    // 6. Kiểm tra Service thuộc cùng Business
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 7. Lấy danh sách Schedule
    const schedules = await Schedule.find({
      branchServiceId,
    }).lean();

    // 8. Sắp xếp từ thứ Hai đến Chủ nhật
    const dayOrder = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7,
    };

    schedules.sort(
      (a, b) =>
        (dayOrder[a.dayOfWeek] ?? 99) -
        (dayOrder[b.dayOfWeek] ?? 99)
    );

    // 9. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách lịch dịch vụ thành công",
      total: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// GET - Xem chi tiết Schedule
// ==============================
const getScheduleById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem lịch dịch vụ",
      });
    }

    // 2. Lấy ID Schedule từ URL
    const scheduleId = req.params.id;

    if (!mongoose.isValidObjectId(scheduleId)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch dịch vụ không hợp lệ",
      });
    }

    // 3. Tìm Schedule
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch dịch vụ",
      });
    }

    // 4. Tìm BranchService
    const branchService = await BranchService.findById(
      schedule.branchServiceId
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 5. Tìm Branch
    const branch = await Branch.findById(
      branchService.branchId
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 6. Kiểm tra Business thuộc Owner
    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch thuộc doanh nghiệp của bạn",
      });
    }

    // 7. Kiểm tra Service thuộc cùng Business
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 8. Populate thông tin BranchService và Service
    await schedule.populate({
      path: "branchServiceId",
      select:
        "branchId serviceId price pricingUnit durationMinutes capacity petTypes status",
      populate: [
        {
          path: "branchId",
          select: "name address status",
        },
        {
          path: "serviceId",
          select: "name description serviceType status categoryId",
          populate: {
            path: "categoryId",
            select: "name code",
          },
        },
      ],
    });

    // 9. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết lịch dịch vụ thành công",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createSchedule,
    updateSchedule,
    getAllSchedules,
    getScheduleById,
};
