const mongoose = require("mongoose");

const Review = require("../../models/Review");
const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Pet = require("../../models/Pet");

const VALID_STATUSES = ["VISIBLE", "HIDDEN"];

// ========================================
// HELPERS
// ========================================
const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidDateOnly = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const formatAddress = (address) => {
  if (!address) return "";

  if (typeof address === "string") {
    return address;
  }

  return [address.detail, address.district, address.province]
    .filter(Boolean)
    .join(", ");
};

const toEntity = (document, fields) => {
  if (!document || typeof document !== "object") {
    return null;
  }

  const result = { _id: document._id };

  for (const field of fields) {
    result[field] = document[field] ?? null;
  }

  return result;
};

// Populate các trường liên quan để phục vụ
// cả danh sách lẫn modal chi tiết.
const populateReview = (query) =>
  query
    .populate({
      path: "customerId",
      select: "fullName email phone avatar",
    })
    .populate({
      path: "businessId",
      select: "name",
    })
    .populate({
      path: "branchId",
      select: "name address phone businessId",
    })
    .populate({
      path: "serviceId",
      select: "name serviceType",
    })
    .populate({
      path: "bookingId",
      select: "bookingCode status bookingType petId",
      populate: {
        path: "petId",
        select: "name species breed",
      },
    })
    .populate({
      path: "businessReply.repliedBy",
      select: "fullName email",
    });

const formatReview = (review) => {
  const customer = review.customerId;
  const business = review.businessId;
  const branch = review.branchId;
  const service = review.serviceId;
  const booking = review.bookingId;
  const pet = booking?.petId;

  return {
    _id: review._id,

    rating: review.rating,
    comment: review.comment || "",
    images: review.images || [],
    status: review.status,

    createdAt: review.createdAt,
    updatedAt: review.updatedAt,

    customer: toEntity(customer, ["fullName", "email", "phone", "avatar"]),

    business: toEntity(business, ["name"]),

    branch: branch
      ? {
          _id: branch._id,
          name: branch.name,
          address: formatAddress(branch.address),
          addressDetails: branch.address || null,
          phone: branch.phone || "",
        }
      : null,

    service: toEntity(service, ["name", "serviceType"]),

    booking: booking
      ? {
          _id: booking._id,
          bookingCode: booking.bookingCode,
          status: booking.status,
          bookingType: booking.bookingType,
        }
      : null,

    pet: toEntity(pet, ["name", "species", "breed"]),

    businessReply: {
      content: review.businessReply?.content || "",
      repliedAt: review.businessReply?.repliedAt || null,
      repliedBy: review.businessReply?.repliedBy
        ? toEntity(review.businessReply.repliedBy, ["fullName", "email"])
        : null,
    },
  };
};

// ========================================
// GET /api/admin/reviews
// Tìm kiếm, lọc, phân trang
// ========================================
const getReviews = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      rating = "all",
      branchId = "all",
      fromDate = "",
      toDate = "",
    } = req.query;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    if (status !== "all" && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đánh giá không hợp lệ.",
      });
    }

    if (
      rating !== "all" &&
      !["1", "2", "3", "4", "5"].includes(String(rating))
    ) {
      return res.status(400).json({
        success: false,
        message: "Số sao phải từ 1 đến 5.",
      });
    }

    if (branchId !== "all" && !mongoose.isValidObjectId(branchId)) {
      return res.status(400).json({
        success: false,
        message: "ID chi nhánh không hợp lệ.",
      });
    }

    if (
      (fromDate && !isValidDateOnly(fromDate)) ||
      (toDate && !isValidDateOnly(toDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Ngày lọc phải có định dạng YYYY-MM-DD hợp lệ.",
      });
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
      });
    }

    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (rating !== "all") {
      filter.rating = Number(rating);
    }

    if (branchId !== "all") {
      filter.branchId = branchId;
    }

    // Lọc theo ngày tạo Review,
    // sử dụng ranh giới ngày giờ Việt Nam.
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(`${fromDate}T00:00:00.000+07:00`);
      }

      if (toDate) {
        filter.createdAt.$lte = new Date(`${toDate}T23:59:59.999+07:00`);
      }
    }

    const keyword = String(search).trim();

    if (keyword.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Từ khóa tìm kiếm quá dài.",
      });
    }

    if (keyword) {
      const regex = new RegExp(escapeRegex(keyword), "i");

      const [
        matchedCustomers,
        matchedBranches,
        matchedBusinesses,
        matchedServices,
        matchedBookings,
      ] = await Promise.all([
        User.find({
          $or: [{ fullName: regex }, { email: regex }, { phone: regex }],
        })
          .select("_id")
          .lean(),

        Branch.find({
          name: regex,
        })
          .select("_id")
          .lean(),

        Business.find({
          name: regex,
        })
          .select("_id")
          .lean(),

        Service.find({
          name: regex,
        })
          .select("_id")
          .lean(),

        Booking.find({
          bookingCode: regex,
        })
          .select("_id")
          .lean(),
      ]);

      filter.$or = [
        { comment: regex },

        {
          customerId: {
            $in: matchedCustomers.map((item) => item._id),
          },
        },

        {
          branchId: {
            $in: matchedBranches.map((item) => item._id),
          },
        },

        {
          businessId: {
            $in: matchedBusinesses.map((item) => item._id),
          },
        },

        {
          serviceId: {
            $in: matchedServices.map((item) => item._id),
          },
        },

        {
          bookingId: {
            $in: matchedBookings.map((item) => item._id),
          },
        },
      ];

      // Hỗ trợ tìm theo chính MongoDB Review ID.
      if (mongoose.isValidObjectId(keyword)) {
        filter.$or.push({
          _id: new mongoose.Types.ObjectId(keyword),
        });
      }
    }

    const skip = (page - 1) * limit;

    const [total, reviewDocuments] = await Promise.all([
      Review.countDocuments(filter),

      populateReview(
        Review.find(filter)
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .skip(skip)
          .limit(limit),
      ).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        reviews: reviewDocuments.map(formatReview),

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Admin] getReviews:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách đánh giá.",
    });
  }
};

// ========================================
// GET /api/admin/reviews/facilities
// Dropdown chi nhánh có đánh giá
// ========================================
const getReviewFacilities = async (req, res) => {
  try {
    const branchIds = await Review.distinct("branchId");

    const branches = await Branch.find({
      _id: { $in: branchIds },
    })
      .select("name address businessId")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        facilities: branches.map((branch) => ({
          _id: branch._id,
          name: branch.name,
          address: formatAddress(branch.address),
          businessId: branch.businessId,
        })),
      },
    });
  } catch (error) {
    console.error("[Admin] getReviewFacilities:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách cơ sở.",
    });
  }
};

// ========================================
// GET /api/admin/reviews/:id
// Chi tiết đánh giá
// ========================================
const getReviewDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID đánh giá không hợp lệ.",
      });
    }

    const review = await populateReview(Review.findById(id)).lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        review: formatReview(review),
      },
    });
  } catch (error) {
    console.error("[Admin] getReviewDetail:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy chi tiết đánh giá.",
    });
  }
};

// ========================================
// PATCH /api/admin/reviews/:id/status
// Ẩn hoặc khôi phục đánh giá
// ========================================
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID đánh giá không hợp lệ.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái phải là VISIBLE hoặc HIDDEN.",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        $set: { status },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "HIDDEN"
          ? "Đã ẩn đánh giá thành công."
          : "Đã khôi phục đánh giá thành công.",
      data: {
        review: {
          _id: updatedReview._id,
          status: updatedReview.status,
          updatedAt: updatedReview.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("[Admin] updateReviewStatus:", error);

    return res.status(500).json({
      success: false,
      message: "Có lỗi khi cập nhật trạng thái đánh giá.",
    });
  }
};

module.exports = {
  getReviews,
  getReviewFacilities,
  getReviewDetail,
  updateReviewStatus,
};
