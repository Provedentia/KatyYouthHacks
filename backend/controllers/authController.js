/**
 * Authentication Controller
 * Handles all authentication operations with inline validation and auth checks
 */

const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Helper function to validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Helper function to validate password strength
 */
const isValidPassword = (password) => {
  // At least 6 characters, contains letter and number
  return password && password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password);
};

/**
 * Helper function to authenticate user from token
 */
const authenticateUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { error: 'Invalid or expired token', status: 401 };
    }
    return { user: user.user, token };
  } catch (error) {
    return { error: 'Authentication failed', status: 401 };
  }
};

/**
 * Register new user
 * POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters and contain both letters and numbers'
      });
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`
        }
      }
    });

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists'
        });
      }
      
      return res.status(400).json({
        success: false,
        error: error.message || 'Registration failed'
      });
    }

    // Successful registration
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata.first_name,
          lastName: data.user.user_metadata.last_name,
          emailConfirmed: data.user.email_confirmed_at !== null
        }
      },
      message: 'Registration successful. Please check your email for verification.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    });

    if (error) {
      // Handle authentication errors
      if (error.message.includes('Invalid login credentials')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      if (error.message.includes('Email not confirmed')) {
        return res.status(401).json({
          success: false,
          error: 'Please verify your email before logging in'
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Login failed'
      });
    }

    // Successful login
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata.first_name,
          lastName: data.user.user_metadata.last_name,
          emailConfirmed: data.user.email_confirmed_at !== null,
          lastSignIn: data.user.last_sign_in_at
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logoutUser = async (req, res) => {
  try {
    // Authenticate user first
    const authResult = await authenticateUser(req);
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error
      });
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Logout failed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to send password reset email'
      });
    }

    // Always return success for security (don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate inputs
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Reset token and new password are required'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters and contain both letters and numbers'
      });
    }

    // Update password using the reset token
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Verify email
 * GET /api/auth/verify-email
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token, type } = req.query;

    if (!token || type !== 'email') {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification link'
      });
    }

    // Verify the email using the token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get user profile (protected)
 * GET /api/auth/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Authenticate user
    const authResult = await authenticateUser(req);
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error
      });
    }

    const user = authResult.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.user_metadata.first_name,
          lastName: user.user_metadata.last_name,
          fullName: user.user_metadata.full_name,
          emailConfirmed: user.email_confirmed_at !== null,
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update user profile (protected)
 * PUT /api/auth/profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // Authenticate user
    const authResult = await authenticateUser(req);
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error
      });
    }

    const { firstName, lastName } = req.body;

    // Validate inputs
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update profile'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata.first_name,
          lastName: data.user.user_metadata.last_name,
          fullName: data.user.user_metadata.full_name
        }
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Change password (protected)
 * POST /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    // Authenticate user
    const authResult = await authenticateUser(req);
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters and contain both letters and numbers'
      });
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: authResult.user.email,
      password: currentPassword
    });

    if (verifyError) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Delete user account (protected)
 * DELETE /api/auth/delete-account
 */
exports.deleteUserAccount = async (req, res) => {
  try {
    // Authenticate user
    const authResult = await authenticateUser(req);
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error
      });
    }

    const { password } = req.body;

    // Require password confirmation for account deletion
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password confirmation is required to delete account'
      });
    }

    // Verify password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: authResult.user.email,
      password: password
    });

    if (verifyError) {
      return res.status(401).json({
        success: false,
        error: 'Password is incorrect'
      });
    }

    // Delete user account (requires admin privileges)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(
      authResult.user.id
    );

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete account'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 