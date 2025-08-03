/**
 * Score Routes
 * Handles leaderboard and user scoring endpoints
 */

const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

/**
 * @route   GET /api/scores/leaderboard
 * @desc    Get top scoring users leaderboard
 * @access  Public
 * @query   ?limit=10 (optional, max 50)
 */
router.get('/leaderboard', scoreController.getLeaderboard);

/**
 * @route   GET /api/scores/:userid
 * @desc    Get user's score and rank by user ID
 * @access  Public (will be protected by middleware)
 * @param   userid - User ID parameter
 */
router.get('/:userid', scoreController.getUserScore);

/**
 * @route   POST /api/scores/update_score
 * @desc    Update user's score by adding points
 * @access  Public (will be protected by middleware)
 * @body    { "points": number, "userid": string }
 */
router.post('/update_score', scoreController.updateScore);

module.exports = router; 