const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const checkAuth = require('../middleware/checkAuth');

/**
 * @route   GET /
 * @desc    Welcome endpoint
 * @access  Public
 */
router.get('/', checkAuth, mainController.welcome);

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', checkAuth, mainController.healthCheck);

module.exports = router;
