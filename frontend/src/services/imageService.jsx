// frontend/src/services/imageService.jsx
import axios from 'axios';

/**
 * Sends a captured or uploaded image (base64 string) to the backend for testing upload.
 * @param {string} imageData - The base64 image data (data URL).
 * @returns {Promise<object>} - The backend response.
 */
export async function sendImageToBackend(imageData) {
  try {
    // Convert base64 data URL to Blob
    function dataURLtoBlob(dataurl) {
      const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
      return new Blob([u8arr], { type: mime });
    }
    const blob = dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append('image', blob, 'upload.jpg');

    const response = await axios.post('http://localhost:3000/api/identify-brand/test-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending image to backend:', error);
    throw error;
  }
}

/**
 * Sends a captured or uploaded image (base64 string) to the backend for Google Vision brand/food identification.
 * @param {string} imageData - The base64 image data (data URL).
 * @returns {Promise<object>} - The backend response.
 */
export async function identifyBrandWithImage(imageData) {
  try {
    function dataURLtoBlob(dataurl) {
      const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
      return new Blob([u8arr], { type: mime });
    }
    const blob = dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append('image', blob, 'upload.jpg');

    const response = await axios.post('http://localhost:3000/api/identify-brand/identify-brand', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending image to Google Vision identify-brand:', error);
    throw error;
  }
}
