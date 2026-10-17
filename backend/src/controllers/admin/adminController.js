// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Truy cập Admin Dashboard thành công",
      data: {
        admin: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    console.error("Admin Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi tải Dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};
