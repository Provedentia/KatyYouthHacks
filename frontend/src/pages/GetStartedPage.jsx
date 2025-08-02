import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GetStartedPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('environmental');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 font-sans">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 bg-emerald-500 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <h1 className="text-2xl font-bold text-emerald-800">Sustain-ify</h1>
          </div>
          
          <motion.button 
            onClick={handleBack}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-500 font-medium cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </motion.div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Left Side - Camera/Image Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                Capture or Upload Image
              </h2>
              
              {/* Image Display Area */}
              <div className="w-full h-80 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2" />
                    <p>No image captured yet</p>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-3">
                <motion.button 
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </motion.button>
                
                <motion.button 
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </motion.button>
              </div>
            </div>
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
                <EnvironmentalImpactTab />
              ) : (
                <DIYProjectTab />
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// Tab Components
const EnvironmentalImpactTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

const DIYProjectTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-emerald-900 mb-4">
          DIY Project Ideas
        </h3>
        <p className="text-gray-600 mb-4">
          Upload an image to get personalized DIY project suggestions for repurposing items.
        </p>
        
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-800">
              No image uploaded yet. Please capture or upload an image to get DIY project suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;