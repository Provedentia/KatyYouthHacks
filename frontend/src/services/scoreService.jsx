import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

/**
 * Get current user ID from JWT token
 * @returns {string|null} - The user ID or null if not found
 */
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Updates a user's environmental score based on the Groq analysis
 * @param {number} points - The points to add to the user's score
 * @param {string} userid - The user ID (optional, will use current user if not provided)
 * @returns {Promise<object>} - The response from the server with updated user score data
 */
const updateUserScore = async (points, userid = null) => {
  try {
    // If userid is not provided, get it from the JWT token
    const effectiveUserId = userid || getCurrentUserId();
    
    if (!effectiveUserId) {
      throw new Error('User ID is required but not provided and not found in JWT');
    }
    
    console.log('Sending score update with userId:', effectiveUserId, 'points:', points);
    
    const response = await axios.post('http://localhost:3000/api/scores/update_score', {
      points: parseInt(points, 10), // Convert to integer
      userid: effectiveUserId
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user score:', error);
    throw error;
  }
};

/**
 * Gets the user's current score and rank
 * @param {string} userid - The user ID (optional, will use current user if not provided)
 * @returns {Promise<object>} - The response with user score data
 */
const getUserScore = async (userid = null) => {
  try {
    // If userid is not provided, get it from the JWT token
    const effectiveUserId = userid || getCurrentUserId();
    
    if (!effectiveUserId) {
      throw new Error('User ID is required but not provided and not found in JWT');
    }
    
    console.log('Fetching score for userId:', effectiveUserId);
    
    const endpoint = `http://localhost:3000/api/scores/${effectiveUserId}`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error getting user score:', error);
    throw error;
  }
};

/**
 * Gets the global leaderboard of environmental scores
 * @param {number} limit - Number of top scores to retrieve (default 10, max 50)
 * @returns {Promise<object>} - The response with leaderboard data
 */
const getLeaderboard = async (limit = 10) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/scores/leaderboard?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

export { updateUserScore, getUserScore, getLeaderboard };
