/**
 * Controller for Tavily-related functionality
 */

const { tavily } = require("@tavily/core");
require('dotenv').config();


// Perform a real Tavily search
exports.tavilySearch = async (req, res) => {
  try {
    // Get the search query from the request body
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Tavily API key not set in .env' });
    }

    // Initialize the Tavily client
    const tvly = tavily({ apiKey });
    
    const response = await tvly.search(query);          // Perform the search using the Tavily API
    // Filter the results to only include url and score
    let filtered = Array.isArray(response.results)
      ? response.results.map(({ url, score }) => ({ url, score }))
      : [];
    // Sort by score descending and take the top 3, then map to just urls
    const topUrls = filtered.sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.url);
    // Return only the list of URLs
    res.json({ success: true, urls: topUrls });
  } catch (error) {
    // Handle any errors and return a 500 error
    console.error('Error in Tavily search:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.extractTavilyData = async (req, res) => {
  try {
    const { urls } = req.body;
    const response = await tvly.extract(urls);
    return res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error in extractTavilyData:', error);
    return;
  }
}

