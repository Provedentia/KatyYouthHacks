const express = require('express');
const router = express.Router();
const tavilyController = require('../controllers/tavilyController');

/**
 * @route   GET /tavily
 * @desc    Get data from Tavily endpoint
 * @access  Public
 */
router.get('/', tavilyController.getTavilyData);

/**
 * @route   POST /tavily
 * @desc    Process data through Tavily
 * @access  Public
 */
router.post('/', tavilyController.processTavilyQuery);

module.exports = router;

module.exports = router;
