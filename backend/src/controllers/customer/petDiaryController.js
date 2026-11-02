const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const PetDiary = require('../../models/PetDiary');

const getDiary = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Mã lịch đặt không hợp lệ.' });
    }
    const booking = await Booking.findOne({ _id: req.params.id, customerId: req.user._id || req.user.id })
      .select('bookingCode status bookingType bookingDate startTime endTime checkInDate checkOutDate numberOfDays customerNote petId branchServiceId createdAt')
      .populate('petId', 'name breed gender dateOfBirth weight avatar careNotes feedingNotes')
      .populate({ path: 'branchServiceId', select: 'branchId serviceId', populate: [
        { path: 'branchId', select: 'name address phone openingHours businessId' },
        { path: 'serviceId', select: 'name' },
      ] }).lean();
    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch đặt của bạn.' });
    // Ownership is checked before querying the diary. A customer cannot request
    // another booking's journal by supplying a pet or customer ID.
    const entries = await PetDiary.find({ bookingId: booking._id })
      .select('activityType description images activityTime createdAt updatedAt')
      .sort({ activityTime: 1, createdAt: 1, _id: 1 }).lean();
    res.json({ success: true, data: { booking, entries } });
  } catch (error) { next(error); }
};

module.exports = { getDiary };
