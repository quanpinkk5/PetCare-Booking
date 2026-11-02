const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const Payment = require("../../models/Payment");

const getPayments = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({ success: false, message: "Không có quyền truy cập thanh toán" });
    }
    // Always derive the business from the authenticated owner, never request input.
    const business = await Business.findOne({ ownerId: req.user._id || req.user.id }).select("_id").lean();
    if (!business) return res.json({ success: true, data: [], branches: [] });

    const [payments, branches] = await Promise.all([
      Payment.find({ businessId: business._id })
        .select("paymentCode bookingId customerId amount currency method status transactionId paidAt failedAt refundedAt failureReason createdAt")
        .populate({ path: "customerId", select: "fullName phone avatar" })
        .populate({
          path: "bookingId", select: "bookingCode totalPrice branchServiceId",
          populate: {
            path: "branchServiceId", select: "branchId serviceId",
            populate: [
              { path: "branchId", select: "name" },
              { path: "serviceId", select: "name serviceType" },
            ],
          },
        })
        .sort({ createdAt: -1, _id: -1 }).lean(),
      Branch.find({ businessId: business._id }).select("name").sort({ name: 1 }).lean(),
    ]);
    return res.json({ success: true, data: payments, branches });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments };
