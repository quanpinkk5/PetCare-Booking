const router = require('express').Router();
const authenticate = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/customer/notificationsController');

router.use(authenticate, (req, res, next) => {
  if (req.user.role !== 'CUSTOMER') return res.status(403).json({ success: false, message: 'Không có quyền truy cập.' });
  next();
});
router.get('/', controller.list);
router.patch('/read-all', controller.markAllRead);
router.delete('/read', controller.clearRead);
router.patch('/:id/read', controller.setRead);
router.delete('/:id', controller.remove);

module.exports = router;
