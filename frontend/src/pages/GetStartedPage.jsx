import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ImageCapture from '../components/ImageCapture/ImageCapture';
import { sendImageToBackend } from '../services/imageService';

function GetStartedPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('environmental');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleBack = () => {
    navigate('/');
  };

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
    setUploadMessage('');
  };

  // New: handle sending image to backend
  const handleSendImage = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setUploadMessage('');
    try {
      const res = await sendImageToBackend(capturedImage);
      setUploadMessage(res.message || 'Upload successful!');
    } catch (err) {
      setUploadMessage('Upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 font-sans">
      <PageHeader 
        title="Sustain-ify" 
        onBack={handleBack} 
        showBackButton={true}
      />

      {/* Main Content */}
      <section className="container mx-auto px-6 py-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Left Side - Image Capture */}
          <div>
            <ImageCapture 
              onImageCapture={handleImageCapture}
              capturedImage={capturedImage}
            />
            {/* Upload button and message */}
            {capturedImage && (
              <div className="mt-4 flex flex-col items-center">
                <button
                  onClick={handleSendImage}
                  className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Analyze Image'}
                </button>
                {uploadMessage && (
                  <div className="mt-2 text-emerald-700">{uploadMessage}</div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Information Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('environmental')}
                className={`flex-1 px-6 py-4 font-medium text-center cursor-pointer transition-colors ${
                  activeTab === 'environmental'
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Environmental Impact
              </button>
              <button
                onClick={() => setActiveTab('diy')}
                className={`flex-1 px-6 py-4 font-medium text-center cursor-pointer transition-colors ${
                  activeTab === 'diy'
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                DIY Project Generator
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'environmental' ? (
                <EnvironmentalImpactTab capturedImage={capturedImage} />
              ) : (
                <DIYProjectTab capturedImage={capturedImage} />
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// Tab Components
const EnvironmentalImpactTab = ({ capturedImage }) => {
  return (
    <div className="space-y-6">
      {capturedImage ? (
        <>
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Environmental Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  The aluminum can used for packaging requires energy-intensive mining and manufacturing processes.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  The transportation of the product from the manufacturing facility to retailers contributes to carbon emissions.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  The extensive use of plastic in the product's packaging can contribute to plastic pollution.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Eco Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Consider homemade infused water with fruit and herbs for a natural and refreshing alternative.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Opt for naturally caffeinated beverages like green tea or black coffee.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Explore energy drinks with fewer artificial ingredients and lower caffeine content.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-800">
              Please capture or upload an image to see environmental impact analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const DIYProjectTab = ({ capturedImage }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-emerald-900 mb-4">
          DIY Project Ideas
        </h3>
        
        {capturedImage ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Based on your image, here are some creative DIY project suggestions:
            </p>
            
            <div className="space-y-3">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-2">Plant Pot</h4>
                <p className="text-gray-700 text-sm">
                  Transform this item into a unique plant pot. Add drainage holes and paint with eco-friendly paint.
                </p>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-2">Storage Container</h4>
                <p className="text-gray-700 text-sm">
                  Repurpose as a storage container for small items like jewelry, craft supplies, or office supplies.
                </p>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-2">Decorative Piece</h4>
                <p className="text-gray-700 text-sm">
                  Paint and decorate to create a unique decorative piece for your home.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
              <p className="text-emerald-800">
                No image uploaded yet. Please capture or upload an image to get DIY project suggestions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStartedPage;