/**
 * Enhanced Controller for Google Vision API functionality
 * Handles dynamic brand name identification and comprehensive food identification
 * with improved confidence scoring, OCR processing, and error handling
 */

const vision = require('@google-cloud/vision');
const multer = require('multer');

// Initialize Google Vision clients with API key
let client;
let productSearchClient;
try {
  const clientConfig = {
    apiKey: process.env.GOOGLE_API_KEY,
    projectId: process.env.GOOGLE_PROJECT_ID
  };
  
  client = new vision.ImageAnnotatorClient(clientConfig);
  productSearchClient = new vision.ProductSearchClient(clientConfig);
  
  console.log('Google Vision clients initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google Vision clients:', error);
  throw new Error('Google Cloud Vision API authentication failed. Please check credentials.');
}

// Configure multer for image upload (unchanged)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.'));
    }
  }
});

// Simplified exclusions - only obvious non-brands
const isObviouslyNotBrand = (text) => {
  const lower = text.toLowerCase();
  return (
    /\d+(ml|oz|g|lb|cal|%)/.test(text) ||         // Measurements
    /(ingredients|nutrition|facts|expires|best before|use by)/.test(lower) ||  // Labels
    text.length < 2 || /^\d+$/.test(text) ||      // Too short/pure numbers
    /^\d{8,}$/.test(text) ||                      // Barcodes
    /^(www\.|http|\.com)/.test(lower)             // URLs
  );
};

// Comprehensive food category mapping with scoring weights
const FOOD_CATEGORIES = {
  'Beverages': {
    keywords: ['drink', 'beverage', 'soda', 'juice', 'water', 'cola', 'beer', 'wine', 'coffee', 'tea', 'smoothie', 'shake', 'lemonade', 'sports drink', 'energy drink'],
    weight: 1.0
  },
  'Snack Foods': {
    keywords: ['chip', 'crisp', 'snack', 'cracker', 'pretzel', 'popcorn', 'nuts', 'trail mix', 'granola bar'],
    weight: 1.0
  },
  'Confectionery': {
    keywords: ['chocolate', 'candy', 'sweet', 'gum', 'mint', 'lollipop', 'caramel', 'fudge', 'truffle', 'bonbon'],
    weight: 1.0
  },
  'Dairy Products': {
    keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream', 'frozen yogurt', 'pudding'],
    weight: 0.9
  },
  'Baked Goods': {
    keywords: ['bread', 'cake', 'cookie', 'biscuit', 'muffin', 'donut', 'pastry', 'bagel', 'croissant'],
    weight: 0.9
  },
  'Packaged Foods': {
    keywords: ['cereal', 'pasta', 'sauce', 'soup', 'canned', 'frozen meal', 'instant', 'ready meal'],
    weight: 0.8
  },
  'Fresh Produce': {
    keywords: ['fruit', 'vegetable', 'apple', 'banana', 'orange', 'lettuce', 'tomato', 'potato', 'fresh'],
    weight: 0.7
  },
  'Meat & Seafood': {
    keywords: ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'turkey', 'ham', 'bacon', 'sausage'],
    weight: 0.8
  },
  'Condiments & Seasonings': {
    keywords: ['sauce', 'dressing', 'condiment', 'spice', 'seasoning', 'salt', 'pepper', 'vinegar', 'oil'],
    weight: 0.7
  },
  'Personal Care': {
    keywords: ['shampoo', 'soap', 'lotion', 'toothpaste', 'deodorant', 'skincare', 'cosmetic'],
    weight: 0.6
  },
  'Household Items': {
    keywords: ['detergent', 'cleaner', 'tissue', 'paper', 'cleaning', 'laundry'],
    weight: 0.5
  }
};

// OCR character substitution patterns for common misreads
const OCR_CORRECTIONS = {
  '0': 'O',
  '1': 'I',
  '5': 'S',
  '8': 'B',
  'rn': 'm',
  'vv': 'w',
  'cl': 'd'
};

/**
 * Detect brand using Google Vision Product Search API
 * @param {Buffer} imageBuffer - Image buffer data
 * @returns {object|null} Product search results
 */
const detectBrandWithProductSearch = async (imageBuffer) => {
  try {
    console.log('Attempting Product Search brand detection...');
    
    // Configure Product Search request
    const request = {
      image: { content: imageBuffer },
      features: [{ type: 'PRODUCT_SEARCH', maxResults: 10 }],
      imageContext: {
        productSearchParams: {
          productCategories: ['packagedgoods'],
          filter: '', // Can add geographic or other filters if needed
        },
      },
    };

    // Make Product Search API call
    const [result] = await Promise.race([
      client.annotateImage(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Product Search timeout')), 10000)
      )
    ]);

    const productSearchResults = result.productSearchResults;
    
    if (!productSearchResults || !productSearchResults.results || productSearchResults.results.length === 0) {
      console.log('No Product Search results found');
      return null;
    }

    // Process Product Search results
    const topResult = productSearchResults.results[0];
    const product = topResult.product;
    
    if (!product) {
      console.log('No product information in search result');
      return null;
    }

    // Extract brand name from product information
    let brandName = null;
    let confidence = (topResult.score || 0) * 100;

    // Try to extract brand from product display name
    if (product.displayName) {
      brandName = extractBrandFromProductName(product.displayName);
    }

    // Fallback to product labels if display name doesn't contain brand
    if (!brandName && product.productLabels) {
      for (const label of product.productLabels) {
        if (label.key && (label.key.toLowerCase().includes('brand') || label.key.toLowerCase().includes('manufacturer'))) {
          brandName = label.value;
          break;
        }
      }
    }

    // Final fallback to display name itself
    if (!brandName && product.displayName) {
      brandName = product.displayName.split(' ')[0]; // Take first word as brand guess
    }

    if (brandName) {
      console.log(`✓ Product Search found brand: "${brandName}" (confidence: ${Math.round(confidence)}%)`);
      return {
        name: brandName,
        confidence: Math.round(confidence),
        method: 'product_search',
        productInfo: {
          displayName: product.displayName,
          category: product.productCategory,
          labels: product.productLabels
        }
      };
    }

    console.log('Product found but no clear brand identified');
    return null;

  } catch (error) {
    console.error('Product Search failed:', error.message);
    
    // Handle specific API errors
    if (error.code === 7) { // PERMISSION_DENIED
      console.error('Product Search API access denied - check project configuration');
    } else if (error.code === 8) { // RESOURCE_EXHAUSTED
      console.error('Product Search API quota exceeded');
    } else if (error.message.includes('timeout')) {
      console.error('Product Search API timeout');
    }
    
    return null;
  }
};

/**
 * Extract brand name from product display name
 * @param {string} displayName - Product display name
 * @returns {string|null} Extracted brand name
 */
const extractBrandFromProductName = (displayName) => {
  if (!displayName) return null;
  
  // Common patterns for brand extraction from product names
  const patterns = [
    // "Brand Name - Product Description"
    /^([^-]+)\s*-/,
    // "Brand Name Product Description"
    /^([A-Z][a-zA-Z'&-]*(?:\s+[A-Z][a-zA-Z'&-]*)?)/,
    // First capitalized word(s)
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ];
  
  for (const pattern of patterns) {
    const match = displayName.match(pattern);
    if (match) {
      const brand = match[1].trim();
      // Validate brand name (not too generic)
      if (brand.length >= 2 && !isObviouslyNotBrand(brand)) {
        return brand;
      }
    }
  }
  
  return null;
};

/**
 * Combine nearby text fragments to reconstruct split brand names
 * @param {object[]} textBlocks - Individual text annotations
 * @returns {object[]} Combined text candidates
 */
const combineNearbyText = (textBlocks) => {
  const combinations = [];
  const used = new Set();
  
  // Add original blocks
  textBlocks.forEach((block, i) => {
    combinations.push({
      text: block.description.trim(),
      boundingBox: block.boundingPoly,
      combined: false,
      originalIndex: i
    });
  });
  
  // Try to combine nearby blocks (within 100px horizontally or 50px vertically)
  for (let i = 0; i < textBlocks.length; i++) {
    if (used.has(i)) continue;
    
    const block1 = textBlocks[i];
    const box1 = block1.boundingPoly?.vertices?.[0];
    if (!box1) continue;
    
    for (let j = i + 1; j < textBlocks.length; j++) {
      if (used.has(j)) continue;
      
      const block2 = textBlocks[j];
      const box2 = block2.boundingPoly?.vertices?.[0];
      if (!box2) continue;
      
      const distance = Math.sqrt(
        Math.pow((box1.x || 0) - (box2.x || 0), 2) + 
        Math.pow((box1.y || 0) - (box2.y || 0), 2)
      );
      
      // Combine if close enough
      if (distance < 200) {
        const combinedText = `${block1.description.trim()} ${block2.description.trim()}`.trim();
        
        // Create combined bounding box
        const allVertices = [
          ...(block1.boundingPoly?.vertices || []),
          ...(block2.boundingPoly?.vertices || [])
        ];
        
        if (allVertices.length > 0) {
          const minX = Math.min(...allVertices.map(v => v.x || 0));
          const maxX = Math.max(...allVertices.map(v => v.x || 0));
          const minY = Math.min(...allVertices.map(v => v.y || 0));
          const maxY = Math.max(...allVertices.map(v => v.y || 0));
          
          combinations.push({
            text: combinedText,
            boundingBox: {
              vertices: [
                { x: minX, y: minY },
                { x: maxX, y: minY },
                { x: maxX, y: maxY },
                { x: minX, y: maxY }
              ]
            },
            combined: true,
            originalIndices: [i, j]
          });
          
          used.add(i);
          used.add(j);
        }
      }
    }
  }
  
  return combinations;
};

/**
 * Calculate image quality score based on OCR and label detection results
 * @param {object[]} textAnnotations - Text detection results
 * @param {object[]} labels - Label detection results
 * @returns {number} Quality score (0-100)
 */
const calculateImageQuality = (textAnnotations, labels) => {
  let qualityScore = 50; // Base score
  
  // Text detection quality indicators
  if (textAnnotations && textAnnotations.length > 0) {
    const textCount = textAnnotations.length - 1; // Exclude full text annotation
    
    // More detected text blocks indicate better OCR quality
    if (textCount > 10) qualityScore += 20;
    else if (textCount > 5) qualityScore += 10;
    else if (textCount < 3) qualityScore -= 15;
    
    // Check for high-confidence text detection
    const avgTextConfidence = textAnnotations.slice(1)
      .reduce((sum, ann) => sum + (ann.confidence || 0.8), 0) / Math.max(textCount, 1);
    qualityScore += (avgTextConfidence - 0.5) * 40;
  }
  
  // Label detection quality indicators
  if (labels && labels.length > 0) {
    const avgLabelConfidence = labels.reduce((sum, label) => sum + label.score, 0) / labels.length;
    qualityScore += (avgLabelConfidence - 0.5) * 30;
    
    // More labels indicate clearer image
    if (labels.length > 8) qualityScore += 10;
    else if (labels.length < 3) qualityScore -= 10;
  }
  
  return Math.max(10, Math.min(95, Math.round(qualityScore)));
};

/**
 * OCR-based brand extraction as fallback - simplified for reliability
 * @param {object[]} textAnnotations - Google Vision text annotations
 * @param {number} imageQuality - Image quality score (kept for compatibility)
 * @returns {object|null} Brand identification results
 */
const extractBrandFromOCR = (textAnnotations, imageQuality = 50) => {
  if (!textAnnotations || textAnnotations.length === 0) {
    console.log('No text annotations found for OCR fallback');
    return null;
  }

  console.log(`OCR fallback: Processing ${textAnnotations.length} text annotations`);
  
  // Skip the first annotation (full text) and get individual blocks
  const textBlocks = textAnnotations.slice(1);
  
  if (textBlocks.length === 0) {
    console.log('No individual text blocks found');
    return null;
  }

  // Combine nearby text fragments first (handles "Coca" + "-" + "Cola")
  const textCandidates = combineNearbyText(textBlocks);
  console.log(`Generated ${textCandidates.length} text candidates`);

  // Score each candidate with simple logic
  const scoredCandidates = [];
  
  textCandidates.forEach(candidate => {
    const score = simpleScoreBrand(candidate.text, candidate.boundingBox);
    
    if (score > 0) { // Only keep non-excluded candidates
      scoredCandidates.push({
        text: candidate.text,
        confidence: score,
        boundingBox: candidate.boundingBox,
        combined: candidate.combined || false
      });
    }
  });

  // Sort by confidence
  scoredCandidates.sort((a, b) => b.confidence - a.confidence);
  
  console.log(`OCR top candidates:`, scoredCandidates.slice(0, 3).map(c => `"${c.text}" (${c.confidence}%)`));

  // Lower threshold for fallback - accept anything above 30%
  const bestBrand = scoredCandidates.find(candidate => candidate.confidence >= 30);
  
  if (bestBrand) {
    console.log(`OCR selected brand: "${bestBrand.text}" with ${bestBrand.confidence}% confidence`);
    return {
      name: bestBrand.text,
      confidence: bestBrand.confidence,
      method: bestBrand.combined ? 'ocr_text_combination' : 'ocr_fallback'
    };
  }
  
  // Final fallback: return best guess if no good brand found
  console.log('No high-confidence OCR brand found, trying best guess fallback');
  const bestGuess = getBestGuess(textCandidates);
  if (bestGuess) {
    bestGuess.method = 'ocr_best_guess';
  }
  return bestGuess;
};

/**
 * Enhanced brand extraction with Product Search + OCR fallback
 * @param {Buffer} imageBuffer - Image buffer for Product Search
 * @param {object[]} textAnnotations - Text annotations for OCR fallback
 * @param {number} imageQuality - Image quality score
 * @returns {object|null} Brand identification results
 */
const extractBrandFromText = async (imageBuffer, textAnnotations, imageQuality = 50) => {
  // Primary: Try Product Search first
  try {
    const productSearchResult = await detectBrandWithProductSearch(imageBuffer);
    if (productSearchResult && productSearchResult.confidence >= 60) {
      console.log(`✓ Product Search successful: ${productSearchResult.name}`);
      return productSearchResult;
    } else if (productSearchResult) {
      console.log(`Product Search found result but low confidence: ${productSearchResult.confidence}%`);
    }
  } catch (error) {
    console.error('Product Search completely failed:', error.message);
  }

  // Secondary: Fall back to OCR-based detection
  console.log('Falling back to OCR-based brand detection...');
  const ocrResult = extractBrandFromOCR(textAnnotations, imageQuality);
  
  if (ocrResult) {
    console.log(`✓ OCR fallback successful: ${ocrResult.name}`);
    return ocrResult;
  }

  console.log('Both Product Search and OCR failed to find brand');
  return null;
};

/**
 * Simple brand scoring for hackathon demo - prioritizes prominence
 * @param {string} text - Text content
 * @param {object} boundingBox - Text bounding box
 * @returns {number} Simple score (0-100)
 */
const simpleScoreBrand = (text, boundingBox) => {
  let score = 50;
  
  console.log(`Scoring "${text}"`);
  
  // Obvious exclusions first
  if (isObviouslyNotBrand(text)) {
    console.log(`  Excluded as obvious non-brand`);
    return 0;
  }
  
  // Calculate text area (bigger = more prominent = more likely brand)
  const area = calculateArea(boundingBox);
  if (area > 5000) {
    score += 35;
    console.log(`  Large text (+35): area=${area}`);
  } else if (area > 3000) {
    score += 25;
    console.log(`  Medium text (+25): area=${area}`);
  } else if (area > 1000) {
    score += 15;
    console.log(`  Small text (+15): area=${area}`);
  }
  
  // Position scoring - top 60% of image gets boost
  const yPosition = getRelativePosition(boundingBox);
  if (yPosition < 0.4) {
    score += 25;
    console.log(`  Top position (+25): y=${yPosition}`);
  } else if (yPosition < 0.6) {
    score += 15;
    console.log(`  Upper position (+15): y=${yPosition}`);
  }
  
  // Trademark symbols = definitely brand
  if (/[™®©]/.test(text)) {
    score += 40;
    console.log(`  Trademark symbol (+40)`);
  }
  
  // Length bonus for reasonable brand names
  if (text.length >= 3 && text.length <= 20) {
    score += 10;
    console.log(`  Good length (+10): ${text.length} chars`);
  }
  
  const finalScore = Math.max(0, Math.min(100, score));
  console.log(`  Final score: ${finalScore}`);
  return finalScore;
};

/**
 * Calculate area of bounding box
 * @param {object} boundingBox - Bounding box with vertices
 * @returns {number} Area in pixels
 */
const calculateArea = (boundingBox) => {
  if (!boundingBox?.vertices || boundingBox.vertices.length < 4) return 0;
  
  const vertices = boundingBox.vertices;
  const width = Math.abs((vertices[1]?.x || 0) - (vertices[0]?.x || 0));
  const height = Math.abs((vertices[2]?.y || 0) - (vertices[1]?.y || 0));
  return width * height;
};

/**
 * Get relative Y position in image (0 = top, 1 = bottom)
 * @param {object} boundingBox - Bounding box with vertices
 * @returns {number} Relative position 0-1
 */
const getRelativePosition = (boundingBox) => {
  if (!boundingBox?.vertices) return 0.5;
  
  const avgY = boundingBox.vertices.reduce((sum, vertex) => sum + (vertex.y || 0), 0) / boundingBox.vertices.length;
  
  // Estimate image height from max Y coordinate
  const maxY = Math.max(...boundingBox.vertices.map(v => v.y || 0));
  const estimatedHeight = maxY > 0 ? maxY * 1.2 : 1000;
  
  return Math.min(1, avgY / estimatedHeight);
};

/**
 * Get best guess when brand detection fails - returns most prominent text
 * @param {object[]} textCandidates - Text candidates with scores
 * @returns {object|null} Best guess result
 */
const getBestGuess = (textCandidates) => {
  if (!textCandidates || textCandidates.length === 0) return null;
  
  // Filter out obvious non-brands and sort by area (prominence)
  const validCandidates = textCandidates
    .filter(candidate => !isObviouslyNotBrand(candidate.text))
    .sort((a, b) => calculateArea(b.boundingBox) - calculateArea(a.boundingBox));
  
  if (validCandidates.length === 0) return null;
  
  const bestGuess = validCandidates[0];
  console.log(`Best guess fallback: "${bestGuess.text}" (area: ${calculateArea(bestGuess.boundingBox)})`);
  
  return {
    name: bestGuess.text,
    confidence: 25, // Low confidence since this is a fallback
    method: 'best_guess_fallback'
  };
};

/**
 * Calculate position score based on text location in image
 * @param {object} boundingBox - Text bounding box coordinates
 * @returns {number} Position score (0-100)
 */
const calculatePositionScore = (boundingBox) => {
  if (!boundingBox || !boundingBox.vertices) return 50;
  
  // Calculate average Y position (top = 0, bottom = max)
  const avgY = boundingBox.vertices.reduce((sum, vertex) => sum + (vertex.y || 0), 0) / boundingBox.vertices.length;
  
  // Calculate relative position (assuming variable image heights)
  const maxY = Math.max(...boundingBox.vertices.map(v => v.y || 0));
  const imageHeight = maxY > 0 ? maxY * 1.2 : 1000; // Estimate image height
  const relativePosition = avgY / imageHeight;
  
  // Brand names are typically in the top 40% of packaging
  if (relativePosition <= 0.3) {
    return 85; // Top area - very likely brand
  } else if (relativePosition <= 0.5) {
    return 70; // Upper middle - likely brand
  } else if (relativePosition <= 0.7) {
    return 45; // Lower middle - possible brand
  } else {
    return 25; // Bottom area - unlikely brand
  }
};

/**
 * Calculate size score based on bounding box dimensions
 * @param {object} boundingBox - Text bounding box coordinates
 * @returns {number} Size score (0-100)
 */
const calculateSizeScore = (boundingBox) => {
  if (!boundingBox || !boundingBox.vertices) return 50;
  
  // Calculate text dimensions
  const vertices = boundingBox.vertices;
  const height = Math.abs((vertices[2]?.y || 0) - (vertices[0]?.y || 0));
  const width = Math.abs((vertices[1]?.x || 0) - (vertices[0]?.x || 0));
  
  // Calculate area and aspect ratio
  const area = height * width;
  const aspectRatio = width / Math.max(height, 1);
  
  let score = 50;
  
  // Larger text more likely to be brand name
  if (area > 5000) score += 30;
  else if (area > 2000) score += 20;
  else if (area > 1000) score += 10;
  else if (area < 200) score -= 20;
  
  // Reasonable aspect ratios for brand text
  if (aspectRatio >= 2 && aspectRatio <= 8) {
    score += 15; // Good aspect ratio for brand text
  } else if (aspectRatio > 15) {
    score -= 15; // Too wide - might be ingredient list
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Enhanced food type identification with comprehensive categorization
 * @param {object[]} labels - Google Vision detected labels
 * @returns {object|null} Food identification results with category
 */
const identifyFoodType = (labels) => {
  if (!labels || labels.length === 0) {
    return null;
  }

  let bestMatch = null;
  let maxScore = 0;

  // Analyze each label against food categories
  labels.forEach(label => {
    const labelDesc = label.description.toLowerCase();
    const labelConfidence = label.score;

    Object.entries(FOOD_CATEGORIES).forEach(([category, categoryData]) => {
      const { keywords, weight } = categoryData;
      
      keywords.forEach(keyword => {
        if (labelDesc.includes(keyword)) {
          // Calculate combined score: label confidence * category weight * keyword match strength
          const matchStrength = labelDesc === keyword ? 1.0 : 0.8; // Exact vs partial match
          const combinedScore = labelConfidence * weight * matchStrength * 100;
          
          if (combinedScore > maxScore) {
            maxScore = combinedScore;
            bestMatch = {
              name: capitalizeWords(labelDesc),
              category: category,
              confidence: Math.round(combinedScore),
              method: 'enhanced_categorization'
            };
          }
        }
      });
    });
  });

  // Fallback to highest confidence label if no category match
  if (!bestMatch && labels.length > 0) {
    const bestLabel = labels[0];
    bestMatch = {
      name: capitalizeWords(bestLabel.description),
      category: 'General Product',
      confidence: Math.round(bestLabel.score * 100),
      method: 'fallback_label'
    };
  }

  return bestMatch;
};

/**
 * Capitalize words helper function
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w+/g, word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

/**
 * Enhanced main endpoint for brand identification with parallel processing
 * @route POST /api/identify-brand
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.identifyBrand = async (req, res) => {
  try {
    // Validate image upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        result: null,
        extractedText: null,
        allLabels: [],
        error: 'No image file provided'
      });
    }

    // Validate image buffer
    const imageBuffer = req.file.buffer;
    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        extractedText: null,
        allLabels: [],
        error: 'Invalid image data'
      });
    }

    console.log(`Processing image: ${req.file.originalname}, Size: ${imageBuffer.length} bytes`);

         // Perform parallel API calls for better performance
     const [textResult, labelResult] = await Promise.all([
       client.textDetection({ image: { content: imageBuffer } }).catch(err => {
         console.error('Text detection failed:', err);
         return [{ textAnnotations: [] }];
       }),
       client.labelDetection({ image: { content: imageBuffer } }).catch(err => {
         console.error('Label detection failed:', err);
         return [{ labelAnnotations: [] }];
       })
     ]);

     const textAnnotations = textResult[0]?.textAnnotations || [];
     const labels = labelResult[0]?.labelAnnotations || [];

     // Calculate image quality for dynamic thresholds
     const imageQuality = calculateImageQuality(textAnnotations, labels);
     console.log(`Image quality score: ${imageQuality}`);

     // Extract all detected text
     const extractedText = textAnnotations.length > 0 ? textAnnotations[0].description : '';
     const allLabels = labels.map(label => label.description);

     // Log detection results for debugging
     console.log(`Detected ${textAnnotations.length - 1} text blocks, ${labels.length} labels`);

     // Try to extract brand using Product Search + OCR fallback
     const brandResult = await extractBrandFromText(imageBuffer, textAnnotations, imageQuality);

     let result;
     
           // Accept brand results with confidence threshold based on method
      let minConfidence = 25; // Lower threshold for fallback methods
      if (brandResult?.method === 'product_search') {
        minConfidence = 50; // Higher confidence required for Product Search
      }

      if (brandResult && brandResult.confidence >= minConfidence) {
        // Brand found 
        result = {
          type: 'brand',
          name: brandResult.name,
          confidence: brandResult.confidence,
          method: brandResult.method || 'text_analysis'
        };
        console.log(`✓ Brand detected: ${brandResult.name} (confidence: ${brandResult.confidence}%, method: ${result.method})`);
      } else {
       // Fallback to enhanced food identification
       const foodResult = identifyFoodType(labels);
       
       if (foodResult) {
         result = {
           type: 'food',
           name: foodResult.name,
           confidence: foodResult.confidence,
           method: foodResult.method,
           category: foodResult.category
         };
         console.log(`✓ Food detected: ${foodResult.name} in ${foodResult.category} (confidence: ${foodResult.confidence}%)`);
       } else {
         result = {
           type: 'unknown',
           name: 'Unknown Product',
           confidence: 0,
           method: 'none'
         };
         console.log('✗ No brand or food type could be identified');
       }
     }

    // Send successful response
    res.json({
      success: true,
      result: result,
      extractedText: extractedText,
      allLabels: allLabels
    });

  } catch (error) {
    console.error('Error in Google Vision brand identification:', error);
    
    // Handle specific Google Vision API errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.code === 3) { // INVALID_ARGUMENT
      errorMessage = 'Invalid image format or corrupted image data';
      statusCode = 400;
    } else if (error.code === 7) { // PERMISSION_DENIED
      errorMessage = 'Google Vision API access denied. Check authentication credentials';
      statusCode = 403;
    } else if (error.code === 8) { // RESOURCE_EXHAUSTED
      errorMessage = 'Google Vision API quota exceeded. Please try again later';
      statusCode = 429;
    } else if (error.code === 14) { // UNAVAILABLE
      errorMessage = 'Google Vision API temporarily unavailable';
      statusCode = 503;
    }

    res.status(statusCode).json({
      success: false,
      result: null,
      extractedText: null,
      allLabels: [],
      error: errorMessage
    });
  }
};

// Export multer upload middleware for use in routes
exports.uploadMiddleware = upload.single('image'); 