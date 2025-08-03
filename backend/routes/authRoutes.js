/**
 * Authentication Routes
 * Connects all authentication endpoints to controller functions
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user account
 * @access  Public
 * @body    { email, password, firstName, lastName }
 */
router.post('/register', authController.registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', authController.loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate session
 * @access  Protected
 * @headers Authorization: Bearer <token>
 */
router.post('/logout', authController.logoutUser);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 * @body    { token, password }
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify user email address
 * @access  Public
 * @query   ?token=<verification_token>&type=email
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Protected
 * @headers Authorization: Bearer <token>
 */
router.get('/profile', authController.getUserProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile information
 * @access  Protected
 * @headers Authorization: Bearer <token>
 * @body    { firstName, lastName }
 */
router.put('/profile', authController.updateUserProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Protected
 * @headers Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 */
router.post('/change-password', authController.changePassword);

/**
 * @route   DELETE /api/auth/delete-account
 * @desc    Delete user account permanently
 * @access  Protected
 * @headers Authorization: Bearer <token>
 * @body    { password }
 */
router.delete('/delete-account', authController.deleteUserAccount);

module.exports = router; 