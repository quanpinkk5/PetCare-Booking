
const ExcelJS = require("exceljs");
const User = require("../../models/User");

// Chống ký tự đặc biệt làm sai biểu thức tìm kiếm
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Chuyển ngày YYYY-MM-DD sang mốc giờ Việt Nam (+07:00)
const parseVietnamDate = (dateString, endOfDay = false) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const time = endOfDay ? "23:59:59.999" : "00:00:00.000";

  const date = new Date(`${dateString}T${time}+07:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Kiểm tra ngày hợp lệ, tránh 31/02...
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  if (`${year}-${month}-${day}` !== dateString) {
    return null;
  }

  return date;
};

const getVietnamToday = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) =>
    parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
};

const ROLE_LABELS = {
  CUSTOMER: "Khách hàng",
  BUSINESS_OWNER: "Chủ cơ sở",
  ADMIN: "Quản trị viên",
};

const STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  LOCKED: "Đã khóa",
};

// GET /api/admin/users/export
const exportUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "all",
      status = "all",
      timeRange = "all",
      startDate = "",
      endDate = "",
    } = req.query;

    const filter = {};

    // 1. Tìm kiếm theo tên, email, số điện thoại
    const keyword = String(search).trim();

    if (keyword) {
      const regex = new RegExp(escapeRegex(keyword), "i");

      filter.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    // 2. Lọc vai trò
    if (
      role !== "all" &&
      ["CUSTOMER", "BUSINESS_OWNER", "ADMIN"].includes(role)
    ) {
      filter.role = role;
    }

    // 3. Lọc trạng thái
    if (
      status !== "all" &&
      ["ACTIVE", "LOCKED"].includes(status)
    ) {
      filter.status = status;
    }

    // 4. Lọc theo ngày tạo tài khoản
    const today = getVietnamToday();

    if (timeRange === "today") {
      filter.createdAt = {
        $gte: parseVietnamDate(today),
        $lte: parseVietnamDate(today, true),
      };
    } else if (
      timeRange === "7days" ||
      timeRange === "30days"
    ) {
      const days = timeRange === "7days" ? 7 : 30;

      const end = parseVietnamDate(today, true);
      const start = parseVietnamDate(today);

      // Tính cả ngày hôm nay
      start.setUTCDate(start.getUTCDate() - (days - 1));

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    } else if (timeRange === "custom") {
      const from = startDate
        ? parseVietnamDate(String(startDate))
        : null;

      const to = endDate
        ? parseVietnamDate(String(endDate), true)
        : null;

      if ((startDate && !from) || (endDate && !to)) {
        return res.status(400).json({
          success: false,
          message: "Ngày lọc không hợp lệ",
        });
      }

      if (from && to && from > to) {
        return res.status(400).json({
          success: false,
          message: "Ngày bắt đầu không được sau ngày kết thúc",
        });
      }

      if (from || to) {
        filter.createdAt = {};

        if (from) filter.createdAt.$gte = from;
        if (to) filter.createdAt.$lte = to;
      }
    }

    // 5. Lấy toàn bộ người dùng phù hợp
    // Không sử dụng skip/limit như bảng phân trang
    const users = await User.find(filter)
      .select("fullName email phone role status createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    // 6. Tạo workbook Excel
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "PetCare Booking Admin";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Danh sách người dùng");

    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Họ và tên", key: "fullName", width: 28 },
      { header: "Email", key: "email", width: 35 },
      { header: "Số điện thoại", key: "phone", width: 20 },
      { header: "Vai trò", key: "role", width: 20 },
      { header: "Trạng thái", key: "status", width: 18 },
      { header: "Ngày đăng ký", key: "createdAt", width: 22 },
    ];

    // 7. Định dạng tiêu đề
    const headerRow = worksheet.getRow(1);

    headerRow.height = 28;
    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF059669" },
      };

      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: "FF047857" },
        },
      };
    });

    // 8. Thêm dữ liệu người dùng
    users.forEach((user, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: ROLE_LABELS[user.role] || user.role,
        status: STATUS_LABELS[user.status] || user.status,
        createdAt: user.createdAt
          ? new Date(user.createdAt)
          : null,
      });

      row.height = 22;

      row.getCell("createdAt").numFmt = "dd/mm/yyyy hh:mm";

      row.alignment = {
        vertical: "middle",
      };

      // Dòng xen kẽ giúp dễ đọc
      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF1F5F9" },
          };
        });
      }
    });

    // Định dạng ngày giờ theo giờ Việt Nam.
    // Excel không lưu timezone trong ô Date,
    // nên chuyển UTC sang giờ Việt Nam trước khi ghi.
    users.forEach((user, index) => {
      if (!user.createdAt) return;

      const localTime = new Date(
        new Date(user.createdAt).getTime() +
          7 * 60 * 60 * 1000
      );

      worksheet.getRow(index + 2).getCell("createdAt").value =
        localTime;
    });

    // 9. Cố định tiêu đề và thêm bộ lọc Excel
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    worksheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    // 10. Tạo file và gửi về trình duyệt
    const buffer = await workbook.xlsx.writeBuffer();

    const fileDate = getVietnamToday().replace(/-/g, "");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="petcare-users-${fileDate}.xlsx"`
    );

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Admin exportUsers error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể xuất dữ liệu người dùng",
    });
  }
};

module.exports = {
  exportUsers,
};
