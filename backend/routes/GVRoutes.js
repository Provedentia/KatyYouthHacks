const express = require('express');
const router = express.Router();
const GVcontroller = require('../controllers/GVcontroller');
const checkAuth = require('../middleware/checkAuth');

/**
 * @route   POST /api/identify-brand
 * @desc    Identify brand names from uploaded images, fallback to food identification
 * @access  Public
 * @accepts multipart/form-data with 'image' field
 * @returns JSON with brand or food information
 */
router.post('/identify-brand', checkAuth,
  GVcontroller.uploadMiddleware,
  GVcontroller.identifyBrand
);

router.post('/test-upload', checkAuth, GVcontroller.uploadMiddleware, GVcontroller.testImageUpload)


module.exports = router; 