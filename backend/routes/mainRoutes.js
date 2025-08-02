const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

/**
 * @route   GET /
 * @desc    Welcome endpoint
 * @access  Public
 */
router.get('/', mainController.welcome);

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', mainController.healthCheck);

module.exports = router;
