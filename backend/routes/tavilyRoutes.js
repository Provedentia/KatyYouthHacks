const express = require('express');
const router = express.Router();
const tavilyController = require('../controllers/tavilyController');
const { route } = require('./mainRoutes');

/**
 * @route   POST /tavily/search
 * @desc    Perform a Tavily search
 * @access  Public
 */
router.post('/search', tavilyController.tavilySearch);

router.post('/extract', tavilyController.extractTavilyData);

module.exports = router;
