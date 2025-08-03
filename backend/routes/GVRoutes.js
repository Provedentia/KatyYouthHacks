const express = require('express');
const router = express.Router();
const GVcontroller = require('../controllers/GVcontroller');

/**
 * @route   POST /api/identify-brand
 * @desc    Identify brand names from uploaded images, fallback to food identification
 * @access  Public
 * @accepts multipart/form-data with 'image' field
 * @returns JSON with brand or food information
 */
router.post('/identify-brand', 
  GVcontroller.uploadMiddleware,
  GVcontroller.identifyBrand
);

router.post('/test-upload', GVcontroller.uploadMiddleware, GVcontroller.testImageUpload)


module.exports = router; 