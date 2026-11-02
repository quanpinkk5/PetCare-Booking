const mongoose = require('mongoose');
const defaults = {
  soundEnabled: true, desktopAlert: true, emailDigest: false,
  notifyNewBooking: true, notifyBookingCancel: true, notifyBoardingCheckout: true,
  notifyNewReview: true, notifyPaymentReceived: true, notifyCustomerMessage: true, notifySystemMaintenance: true,
};
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  ...Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { type: Boolean, default: value }])),
}, { timestamps: true, collection: 'businessNotificationSettings' });
module.exports = mongoose.model('BusinessNotificationSettings', schema);
module.exports.defaults = defaults;
