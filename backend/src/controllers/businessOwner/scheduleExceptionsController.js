const mongoose = require("mongoose");

const ScheduleException = require("../../models/ScheduleException");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Business = require("../../models/Business");

// ==============================
// POST - Tạo lịch ngoại lệ
// ==============================
const createScheduleException = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tạo lịch ngoại lệ",
      });
    }

    // 2. Lấy dữ liệu
    const {
      branchServiceId,
      date,
      type,
      startTime,
      endTime,
      capacity,
      reason,
    } = req.body;

    // 3. Kiểm tra BranchService ID
    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    // 4. Kiểm tra ngày (YYYY-MM-DD)
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "date phải có định dạng YYYY-MM-DD",
      });
    }

    const exceptionDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(exceptionDate.getTime()) ||
      exceptionDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        success: false,
        message: "Ngày không hợp lệ",
      });
    }

    // 5. Kiểm tra loại ngoại lệ
    const validTypes = ["CLOSED", "CUSTOM_HOURS", "BLOCK_SLOT"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type không hợp lệ",
      });
    }

    // 6. Kiểm tra giờ
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (type !== "CLOSED") {
      if (
        typeof startTime !== "string" ||
        typeof endTime !== "string" ||
        !timeRegex.test(startTime) ||
        !timeRegex.test(endTime) ||
        startTime >= endTime
      ) {
        return res.status(400).json({
          success: false,
          message: "startTime và endTime phải hợp lệ (HH:mm)",
        });
      }
    } else if (startTime !== undefined || endTime !== undefined) {
      return res.status(400).json({
        success: false,
        message: "CLOSED không cần startTime và endTime",
      });
    }

    // 7. Kiểm tra capacity
    if (
      capacity !== undefined &&
      (!Number.isInteger(capacity) || capacity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "capacity phải là số nguyên không âm",
      });
    }

    // 8. Kiểm tra reason
    if (reason !== undefined && typeof reason !== "string") {
      return res.status(400).json({
        success: false,
        message: "reason phải là chuỗi",
      });
    }

    // 9. Tìm BranchService
    const branchService = await BranchService.findById(branchServiceId);

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 10. Tìm Branch
    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 11. Kiểm tra quyền sở hữu Business
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

    // 12. Kiểm tra Service thuộc cùng Business
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

    // 13. Kiểm tra ngoại lệ trùng hoàn toàn
    const existingException = await ScheduleException.findOne({
      branchServiceId,
      date: exceptionDate,
      type,
      ...(type === "CLOSED" ? {} : { startTime, endTime }),
    });

    if (existingException) {
      return res.status(409).json({
        success: false,
        message: "Lịch ngoại lệ này đã tồn tại",
      });
    }

    // 14. Không cho tạo CLOSED nếu ngày đã có ngoại lệ khác
    if (type === "CLOSED") {
      const otherException = await ScheduleException.findOne({
        branchServiceId,
        date: exceptionDate,
      });

      if (otherException) {
        return res.status(409).json({
          success: false,
          message: "Ngày này đã có lịch ngoại lệ khác",
        });
      }
    } else {
      // Không cho tạo ngoại lệ giờ nếu ngày đã CLOSED
      const closedException = await ScheduleException.findOne({
        branchServiceId,
        date: exceptionDate,
        type: "CLOSED",
      });

      if (closedException) {
        return res.status(409).json({
          success: false,
          message: "Ngày này đã được đánh dấu nghỉ",
        });
      }
    }

    // 15. Tạo ScheduleException
    const scheduleException = await ScheduleException.create({
      branchServiceId,
      date: exceptionDate,
      type,
      ...(type === "CLOSED" ? {} : { startTime, endTime }),
      ...(capacity !== undefined ? { capacity } : {}),
      reason: reason?.trim() || "",
    });

    // 16. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Tạo lịch ngoại lệ thành công",
      data: scheduleException,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// PATCH - Cập nhật lịch ngoại lệ
// ==============================
const updateScheduleException = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật lịch ngoại lệ",
      });
    }

    // 2. Kiểm tra ScheduleException ID
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch ngoại lệ không hợp lệ",
      });
    }

    // 3. Tìm ScheduleException
    const scheduleException = await ScheduleException.findById(id);

    if (!scheduleException) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch ngoại lệ",
      });
    }

    // 4. Kiểm tra quyền sở hữu
    const branchService = await BranchService.findById(
      scheduleException.branchServiceId,
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
        message: "Lịch ngoại lệ không thuộc doanh nghiệp của bạn",
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
    const { date, type, startTime, endTime, capacity, reason } = req.body;

    // Không cho thay đổi branchServiceId
    if (req.body.branchServiceId !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Không được thay đổi branchServiceId",
      });
    }

    if (
      date === undefined &&
      type === undefined &&
      startTime === undefined &&
      endTime === undefined &&
      capacity === undefined &&
      reason === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    // 7. Kiểm tra và chuẩn hóa ngày
    let newDate = scheduleException.date;

    if (date !== undefined) {
      if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: "date phải có định dạng YYYY-MM-DD",
        });
      }

      newDate = new Date(`${date}T00:00:00.000Z`);

      if (
        Number.isNaN(newDate.getTime()) ||
        newDate.toISOString().slice(0, 10) !== date
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày không hợp lệ",
        });
      }
    }

    // 8. Kiểm tra type
    const validTypes = ["CLOSED", "CUSTOM_HOURS", "BLOCK_SLOT"];

    const newType = type ?? scheduleException.type;

    if (!validTypes.includes(newType)) {
      return res.status(400).json({
        success: false,
        message: "type không hợp lệ",
      });
    }

    // 9. Xác định khung giờ mới
    let newStartTime = startTime ?? scheduleException.startTime;
    let newEndTime = endTime ?? scheduleException.endTime;

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (newType === "CLOSED") {
      // CLOSED không có khung giờ
      if (startTime !== undefined || endTime !== undefined) {
        return res.status(400).json({
          success: false,
          message: "CLOSED không cần startTime và endTime",
        });
      }

      newStartTime = undefined;
      newEndTime = undefined;
    } else {
      if (
        typeof newStartTime !== "string" ||
        typeof newEndTime !== "string" ||
        !timeRegex.test(newStartTime) ||
        !timeRegex.test(newEndTime) ||
        newStartTime >= newEndTime
      ) {
        return res.status(400).json({
          success: false,
          message: "startTime và endTime phải hợp lệ (HH:mm)",
        });
      }
    }

    // 10. Kiểm tra capacity
    if (
      capacity !== undefined &&
      capacity !== null &&
      (!Number.isInteger(capacity) || capacity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "capacity phải là số nguyên không âm",
      });
    }

    // 11. Kiểm tra reason
    if (reason !== undefined && reason !== null && typeof reason !== "string") {
      return res.status(400).json({
        success: false,
        message: "reason phải là chuỗi hoặc null",
      });
    }

    // 12. Kiểm tra trùng lịch, bỏ qua bản ghi hiện tại
    const sameDayExceptions = await ScheduleException.find({
      _id: { $ne: scheduleException._id },
      branchServiceId: scheduleException.branchServiceId,
      date: newDate,
    });

    // CLOSED không được tồn tại cùng ngoại lệ khác
    if (newType === "CLOSED") {
      if (sameDayExceptions.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Ngày này đã có lịch ngoại lệ khác",
        });
      }
    } else {
      // Không cho tạo ngoại lệ giờ vào ngày đã CLOSED
      const hasClosed = sameDayExceptions.some(
        (item) => item.type === "CLOSED",
      );

      if (hasClosed) {
        return res.status(409).json({
          success: false,
          message: "Ngày này đã được đánh dấu nghỉ",
        });
      }

      // Không cho trùng hoàn toàn loại và khung giờ
      const hasDuplicate = sameDayExceptions.some(
        (item) =>
          item.type === newType &&
          item.startTime === newStartTime &&
          item.endTime === newEndTime,
      );

      if (hasDuplicate) {
        return res.status(409).json({
          success: false,
          message: "Lịch ngoại lệ này đã tồn tại",
        });
      }
    }

    // 13. Cập nhật dữ liệu
    scheduleException.date = newDate;
    scheduleException.type = newType;

    if (newType === "CLOSED") {
      scheduleException.startTime = undefined;
      scheduleException.endTime = undefined;
      scheduleException.capacity = undefined;
    } else {
      scheduleException.startTime = newStartTime;
      scheduleException.endTime = newEndTime;

      if (capacity !== undefined) {
        scheduleException.capacity = capacity === null ? undefined : capacity;
      }
    }

    if (reason !== undefined) {
      scheduleException.reason = reason === null ? "" : reason.trim();
    }

    // 14. Lưu thay đổi
    await scheduleException.save();

    // 15. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật lịch ngoại lệ thành công",
      data: scheduleException,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// GET - Danh sách lịch ngoại lệ
// ==============================
const getAllScheduleExceptions = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem lịch ngoại lệ",
      });
    }

    // 2. Lấy query params
    const { branchServiceId, fromDate, toDate } = req.query;

    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    // 3. Kiểm tra BranchService
    const branchService = await BranchService.findById(branchServiceId);

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 4. Kiểm tra Branch
    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 5. Kiểm tra Business thuộc Owner
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

    // 7. Hàm kiểm tra ngày YYYY-MM-DD
    const parseDate = (value) => {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== value
      ) {
        return null;
      }

      return parsed;
    };

    // 8. Validate khoảng ngày
    let startDate;
    let endDate;

    if (fromDate !== undefined) {
      startDate = parseDate(fromDate);

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message: "fromDate phải có định dạng YYYY-MM-DD hợp lệ",
        });
      }
    }

    if (toDate !== undefined) {
      endDate = parseDate(toDate);

      if (!endDate) {
        return res.status(400).json({
          success: false,
          message: "toDate phải có định dạng YYYY-MM-DD hợp lệ",
        });
      }
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate không được lớn hơn toDate",
      });
    }

    // 9. Tạo điều kiện tìm kiếm
    const filter = {
      branchServiceId,
    };

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = startDate;
      }

      if (endDate) {
        // Bao gồm toàn bộ ngày toDate
        const nextDate = new Date(endDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);

        filter.date.$lt = nextDate;
      }
    }

    // 10. Lấy danh sách lịch ngoại lệ
    const scheduleExceptions = await ScheduleException.find(filter)
      .sort({
        date: 1,
        startTime: 1,
        createdAt: 1,
      })
      .lean();

    // 11. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách lịch ngoại lệ thành công",
      total: scheduleExceptions.length,
      data: scheduleExceptions,
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// GET - Xem chi tiết ScheduleException
// ======================================
const getScheduleExceptionById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem lịch ngoại lệ",
      });
    }

    // 2. Kiểm tra ID
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch ngoại lệ không hợp lệ",
      });
    }

    // 3. Tìm ScheduleException
    const scheduleException = await ScheduleException.findById(id);

    if (!scheduleException) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch ngoại lệ",
      });
    }

    // 4. Tìm BranchService
    const branchService = await BranchService.findById(
      scheduleException.branchServiceId,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 5. Tìm Branch
    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 6. Kiểm tra quyền sở hữu Business
    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Lịch ngoại lệ không thuộc doanh nghiệp của bạn",
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

    // 8. Populate thông tin liên quan
    await scheduleException.populate({
      path: "branchServiceId",
      select:
        "branchId serviceId price pricingUnit durationMinutes capacity petTypes status",
      populate: [
        {
          path: "branchId",
          select: "name address phone status",
        },
        {
          path: "serviceId",
          select: "name description serviceType categoryId status",
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
      message: "Lấy chi tiết lịch ngoại lệ thành công",
      data: scheduleException,
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// DELETE - Xóa lịch ngoại lệ
// ======================================
const deleteScheduleException = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa lịch ngoại lệ",
      });
    }

    // 2. Kiểm tra ID
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch ngoại lệ không hợp lệ",
      });
    }

    // 3. Tìm ScheduleException
    const scheduleException = await ScheduleException.findById(id);

    if (!scheduleException) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch ngoại lệ",
      });
    }

    // 4. Tìm BranchService
    const branchService = await BranchService.findById(
      scheduleException.branchServiceId,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 5. Tìm Branch
    const branch = await Branch.findById(branchService.branchId);

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
        message: "Lịch ngoại lệ không thuộc doanh nghiệp của bạn",
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

    // 8. Xóa ScheduleException
    await ScheduleException.deleteOne({
      _id: scheduleException._id,
    });

    // 9. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Xóa lịch ngoại lệ thành công",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createScheduleException,
  updateScheduleException,
  getAllScheduleExceptions,
  getScheduleExceptionById,
  deleteScheduleException,
};
