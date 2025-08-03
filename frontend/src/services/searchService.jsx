import axios from 'axios';

// searchService.jsx
// Boilerplate for calling backend API to analyze a product

export async function analyzeProduct(product) {
  const response = await axios.post('http://localhost:3000/tavily/crawl', {
    product
  });
  return response.data;
}
