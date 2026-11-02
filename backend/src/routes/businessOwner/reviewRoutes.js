const router = require('express').Router();
const authenticate = require('../../middlewares/authMiddleware');
const authorize = require('../../middlewares/roleMiddleware');
const controller = require('../../controllers/businessOwner/reviewController');
const guard = [authenticate, authorize('BUSINESS_OWNER')];
router.get('/reviews', guard, controller.getReviews);
router.patch('/reviews/:id/reply', guard, controller.replyReview);
router.patch('/reviews/:id/hidden', guard, controller.hideReview);
module.exports = router;
