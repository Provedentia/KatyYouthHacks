/**
 * Score Controller
 * Handles user scoring system and leaderboard functionality
 */

const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Update user score based on successful identification
 * @param {string} userid - User ID
 * @param {number} points - Points to award
 * @returns {Promise<boolean>} Success status
 */
exports.updateUserScore = async (userid, points) => {
  try {
    // Check if userid exists
    if (!userid) {
      console.log('No userid provided for scoring');
      return false;
    }

    console.log(`Awarding ${points} points to user ${userid}`);

    // Get user profile for metadata
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userid)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return false;
    }

    // Update user score in profiles table directly
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        score: (profile.score || 0) + points,
        first_name: profile?.first_name || 'User',
        last_name: profile?.last_name || ''
      })
      .eq('id', userid);

    if (error) {
      console.error('Error updating user score:', error);
      return false;
    }

    console.log(`✓ Successfully awarded ${points} points to user ${userid}`);
    return true;

  } catch (error) {
    console.error('Error in updateUserScore:', error);
    return false;
  }
};

/**
 * Get leaderboard with top scoring users
 * @route GET /api/scores/leaderboard
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('score, first_name, last_name, created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true }) // Tiebreaker: earlier registration wins
      .limit(Math.min(limit, 50)); // Cap at 50 users max

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard'
      });
    }

    // Format leaderboard data
    const leaderboard = data
      .filter(user => (user.score || 0) >= 0) // Show all users including those with 0 points
      .map((user, index) => ({
        rank: index + 1,
        name: `${user.first_name} ${user.last_name}`.trim() || 'Anonymous',
        score: user.score || 0
      }));

    res.json({
      success: true,
      data: {
        leaderboard: leaderboard,
        total: leaderboard.length
      },
      message: 'Leaderboard retrieved successfully'
    });

  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update user score endpoint
 * @route POST /api/scores/update_score
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.updateScore = async (req, res) => {
  try {
    const { points, userid } = req.body;
    
    // Validate points input
    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Points must be a positive number'
      });
    }

    // Validate userid input
    if (!userid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const success = await exports.updateUserScore(userid, points);

    if (success) {
      res.json({
        success: true,
        message: `Successfully awarded ${points} points`,
        data: { points, userid }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to update score - invalid user ID or database error'
      });
    }

  } catch (error) {
    console.error('Error in updateScore endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get user's current score and rank
 * @route GET /api/scores/:userid
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getUserScore = async (req, res) => {
  try {
    const { userid } = req.params;

    // Validate userid parameter
    if (!userid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user's profile with score
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('score, first_name, last_name')
      .eq('id', userid)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    // Calculate user's rank
    const { data: rankData, error: rankError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .gt('score', profile.score || 0)
      .order('score', { ascending: false });

    const rank = rankError ? null : (rankData?.length || 0) + 1;

    res.json({
      success: true,
      data: {
        user: {
          name: `${profile.first_name} ${profile.last_name}`.trim(),
          score: profile.score || 0,
          rank: rank
        }
      }
    });

  } catch (error) {
    console.error('Error in getUserScore:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 