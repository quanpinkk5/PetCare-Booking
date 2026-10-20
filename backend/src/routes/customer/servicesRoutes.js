const router = require('express').Router();
const controller = require('../../controllers/customer/servicesController');

router.get('/service-categories', controller.getCategories);
router.get('/services', controller.getServices);

module.exports = router;
