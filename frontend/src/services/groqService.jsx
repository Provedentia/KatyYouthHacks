import axios from 'axios';

// groq cleans raw data and extracts relevant information
export async function analyzeGroq(product, description) {
  try {
    const response = await axios.post('http://localhost:3000/groq/analyze', {
      product,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error in analyzeGroq:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Sends raw text and product name to backend to keep only relevant sentences
export async function keepRelevantText(rawText, productName) {
  try {
    const response = await axios.post('http://localhost:3000/groq/keep-relevant', {
      rawText,
      productName
    });
    return response.data;
  } catch (error) {
    console.error('Error in keepRelevantText:', error.response ? error.response.data : error.message);
    throw error;
  }
}
