const { tavily } = require("@tavily/core");
require('dotenv').config();

const apiKey = process.env.TAVILY_API_KEY;
// Initialize the Tavily client
const tvly = tavily({ apiKey });


// Perform a Tavily search 
// Input: name of product
// returns a list of objects with url, score, and cleaned_link
// cleaned_link is what we want to keep in the frontend to be passed to extractTavilyData
exports.tavilySearch = async (req, res) => {
  try {
    // Get the product name from the request body
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    
    // Augment the query with environmental context
    const envQuery = `${query} site:greenchoicenow.com`;
    
    console.log('Tavily search query:', envQuery);

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Tavily API key not set in .env' });
    }
    
    const response = await tvly.search(envQuery);          // Perform the search using the Tavily API
    // Filter the results to only include url and score
    let filtered = Array.isArray(response.results)
      ? response.results.map(({ url, score }) => ({ url, score }))
      : [];
    // Sort by score descending and take the top 3
    const topResults = filtered.sort((a, b) => b.score - a.score).slice(0, 3);
    // Add cleaned_link to each result
    const processedResults = topResults.map(({ url, score }) => {
      let cleaned_link;
      try {
        const u = new URL(url);
        cleaned_link = u.origin + u.pathname;
      } catch (e) {
        cleaned_link = url;
      }
      return { url, score, cleaned_link };
    });
    // Return the list of objects
    console.log('Tavily search results:', processedResults);
    
    res.json({ success: true, results: processedResults });
  } catch (error) {
    // Handle any errors and return a 500 error
    console.error('Error in Tavily search:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.extractTavilyData = async (req, res) => {
  try {
    console.log('Extracting Tavily data with body:', req.body);
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ success: false, message: 'urls must be an array' });
    }
    const response = await tvly.extract(urls, { format: 'text' }); // Use Tavily Extract API with format: 'text' for plain text extraction

    console.log('Tavily extract response:', response);
    return res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error in extractTavilyData:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}

exports.tavilyCrawl = async (req, res) => {
  console.log('Crawling with Tavily with body:', req.body);
  // 1) Basic presence + type checks
  let { url, productName } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, message: '"url" is required and must be a string' });
  }
  if (!productName || typeof productName !== "string") {
    return res.status(400).json({ success: false, message: '"productName" is required and must be a string' });
  }

  // Trim & sanitise
  url = url.trim();
  productName = productName.trim().replace(/`/g, ""); // remove back-ticks that could break a template

  if (!tvly) {
    return res.status(500).json({ success: false, message: "Tavily client not initialised – check API key" });
  }

  try {
    const response = await tvly.crawl(url, {
      instructions: `Find all product pages that are related to ${productName}`,
      max_depth: 5,        
      limit: 15,
      include_images: false,
    });

    console.log("\nTavily crawl response:", response);

    return res.json({ success: true, ...response });

  } catch (error) {
    const status = error?.response?.status || 500;
    console.error("Error in tavilyCrawl:", error);
    return res.status(status).json({
      success: false,
      message: "Failed to crawl with Tavily",
      error: error.message,
    });
  }
}; 
