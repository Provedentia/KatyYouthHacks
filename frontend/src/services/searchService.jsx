import axios from 'axios';


// calls tavily search
export async function searchProduct(product) {
  try {
    const response = await axios.post('http://localhost:3000/tavily/search', {
      query: product
    });
    const data = response.data;
    // Extract cleaned_links from results if not already present
    let cleanedLinks = [];
    if (Array.isArray(data.results)) {
      cleanedLinks = data.results.map(item => item.cleaned_link).filter(Boolean);
    }
    return { ...data, cleaned_links: cleanedLinks };
  } catch (error) {
    console.error('Error in searchProduct:', error.response ? error.response.data : error.message);
    throw error;
  }
}


// makes tavily search for pages related to a product return raw text
export async function analyzeProduct(product) {
  try {
    const response = await axios.post('http://localhost:3000/tavily/crawl', {
      url: 'https://www.greenchoicenow.com',
      productName: product
    });
    return response.data;
  } catch (error) {
    console.error('Error in analyzeProduct:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// calls tavily extract to get extracted data from a list of URLs
export async function extractLinks(urls) {
  try {
    const response = await axios.post('http://localhost:3000/tavily/extract', {
      urls
    });
    // Backend returns { success: true, data: ... }
    return response.data;
  } catch (error) {
    console.error('Error in extractLinks:', error.response ? error.response.data : error.message);
    throw error;
  }
}