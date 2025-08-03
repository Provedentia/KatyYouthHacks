import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { User } from 'lucide-react';

const PageHeader = ({ title, onBack, onProfile, showBackButton = true }) => {
  return (
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
          <h1 className="text-2xl font-bold text-emerald-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {showBackButton && (
            <motion.button 
              onClick={onBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-500 font-medium cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
                    {onProfile && (
            <motion.button
              onClick={onProfile}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-500 font-medium cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4" />
              Profile
            </motion.button>
          )}
        </div>
      </motion.div>
    </header>
  );
};

export default PageHeader; 