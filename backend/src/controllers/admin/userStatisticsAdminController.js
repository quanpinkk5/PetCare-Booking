
const User = require("../../models/User");

// GET /api/admin/users/statistics
const getUserStatistics = async (req, res) => {
  try {
    // 1. Thống kê các tài khoản
    const [
      totalUsers,
      totalCustomers,
      totalBusinessOwners,
      totalAdmins,
      lockedUsers,
      recentUsers,
    ] = await Promise.all([
      // Tổng tất cả tài khoản
      User.countDocuments(),

      // Số khách hàng
      User.countDocuments({
        role: "CUSTOMER",
      }),

      // Số chủ cơ sở
      User.countDocuments({
        role: "BUSINESS_OWNER",
      }),

      // Số quản trị viên
      User.countDocuments({
        role: "ADMIN",
      }),

      // Số tài khoản bị khóa (mọi vai trò)
      User.countDocuments({
        status: "LOCKED",
      }),

      // 5 tài khoản mới được tạo gần nhất
      User.find()
        .select(
          "_id fullName email avatar role status createdAt"
        )
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .limit(5)
        .lean(),
    ]);

    // 2. Tính tỷ lệ phần trăm theo vai trò
    const calculatePercentage = (count) => {
      if (totalUsers === 0) return 0;

      return Number(
        ((count / totalUsers) * 100).toFixed(1)
      );
    };

    const roleDistribution = [
      {
        role: "CUSTOMER",
        label: "Khách hàng",
        count: totalCustomers,
        percentage: calculatePercentage(totalCustomers),
      },
      {
        role: "BUSINESS_OWNER",
        label: "Chủ cơ sở",
        count: totalBusinessOwners,
        percentage: calculatePercentage(totalBusinessOwners),
      },
      {
        role: "ADMIN",
        label: "Quản trị viên",
        count: totalAdmins,
        percentage: calculatePercentage(totalAdmins),
      },
    ];

    // 3. Trả dữ liệu cho trang quản lý người dùng
    return res.status(200).json({
      success: true,
      message: "Lấy thống kê người dùng thành công",
      data: {
        totalUsers,
        totalCustomers,
        totalBusinessOwners,
        totalAdmins,
        lockedUsers,
        roleDistribution,
        recentUsers,
      },
    });
  } catch (error) {
    console.error(
      "Admin getUserStatistics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê người dùng",
    });
  }
};

module.exports = {
  getUserStatistics,
};
