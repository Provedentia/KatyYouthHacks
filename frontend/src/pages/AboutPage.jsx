import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Users, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import thrivableLogo from '../assets/thrivable-logo.png';

// NavLink component to match the Landing Page
const NavLink = ({ children, onClick }) => (
  <motion.span
    className="text-emerald-800 font-medium cursor-pointer"
    whileHover={{ color: '#047857' }}
    onClick={onClick}
  >
    {children}
  </motion.span>
);

const AboutPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/signup');
  };
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 font-sans">
      {/* Header - Copied from Landing Page */}
      <header className="container mx-auto px-6 py-6">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <img src={thrivableLogo} alt="Thrivable Logo" className="w-10 h-10 object-contain rounded-full cursor-pointer" onClick={() => navigate('/')} />
            <h1 className="text-2xl font-bold text-emerald-800">Thrivable</h1>
          </div>
          <div className="hidden md:flex gap-8">
            <NavLink onClick={() => navigate('/')}>Home</NavLink>
            <NavLink onClick={() => {
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/#features-section');
            }}>Features</NavLink>
            <NavLink onClick={() => navigate('/about')}>About</NavLink>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              className="px-4 py-2 rounded-full font-medium text-emerald-600 border border-emerald-600 bg-white text-sm"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
            >
              Login
            </motion.button>
            <motion.button 
              className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </header>
      
      {/* Hero Section with Integrated Logo */}
      <section className="container mx-auto px-6 py-12 relative">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-100 rounded-full opacity-40 blur-xl"></div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Integrated logo and heading */}
          <motion.div
            className="flex flex-col items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          >
            <motion.img
              src={thrivableLogo}
              alt="Thrivable Logo"
              className="w-40 h-40 object-contain mb-6 drop-shadow-xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.5, delay: 0.1 }}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">Our Story</h1>
            <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full mb-8"></div>
            
            <p className="text-lg text-emerald-700 max-w-2xl mx-auto leading-relaxed">
              Born from our collective passion for environmental sustainability, Thrivable started as a KatyYouthHacks 2025 project with a simple idea: what if we could help people make better ecological choices every day?
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="mb-6 text-emerald-50">
                  We're building a future where sustainable choices are easy, informed, and rewarding.
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/40 backdrop-blur-sm rounded-full">
                    <Lightbulb size={20} />
                  </div>
                  <span className="font-medium">Innovation in Sustainability</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/40 backdrop-blur-sm rounded-full">
                    <Users size={20} />
                  </div>
                  <span className="font-medium">Student-Led Initiative</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/40 backdrop-blur-sm rounded-full">
                    <Sparkles size={20} />
                  </div>
                  <span className="font-medium">KatyYouthHacks 2025 Project</span>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 p-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why We Built This</h2>
                <p className="text-emerald-700 mb-6">
                  Born from our collective passion for environmental sustainability, Thrivable started as a KatyYouthHacks 2025 project with a simple idea: what if we could help people make better ecological choices every day?
                </p>
                <p className="text-emerald-700 mb-6">
                  As students from different universities across the country, we noticed a common challenge - despite growing awareness about sustainability, it's still difficult for consumers to know the environmental impact of their purchases.
                </p>
                <p className="text-emerald-700">
                  That's why we built Thrivable - to bridge this information gap and empower people to make choices that are better for our planet, all while building a community of environmentally conscious consumers.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <motion.div 
              className="inline-block p-3 bg-emerald-50 rounded-full mb-4"
              whileHover={{ scale: 1.1, backgroundColor: "#10b981", color: "#ffffff" }}
            >
              <GraduationCap className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">The Team</h2>
            <p className="text-emerald-600">Meet the students behind Thrivable</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div 
              className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-5 hover:border-emerald-300 transition-colors"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl shadow-md">CD</div>
              <div>
                <h3 className="font-bold text-lg text-emerald-800">Chad Diao</h3>
                <p className="text-emerald-600 text-sm">Rice University</p>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-5 hover:border-emerald-300 transition-colors"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl shadow-md">SA</div>
              <div>
                <h3 className="font-bold text-lg text-emerald-800">Suhaib Aden</h3>
                <p className="text-emerald-600 text-sm">Northwestern University</p>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-5 hover:border-emerald-300 transition-colors"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl shadow-md">BK</div>
              <div>
                <h3 className="font-bold text-lg text-emerald-800">Brian Kim</h3>
                <p className="text-emerald-600 text-sm">Columbia University</p>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-5 hover:border-emerald-300 transition-colors"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl shadow-md">DS</div>
              <div>
                <h3 className="font-bold text-lg text-emerald-800">Daniel Sung</h3>
                <p className="text-emerald-600 text-sm">Johns Hopkins University</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-12 pt-6 border-t border-emerald-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">Event Information</h3>
                <motion.a 
                  href="https://katyyouthhacks2025.devpost.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors"
                  whileHover={{ scale: 1.02, x: 3 }}
                >
                  <span>KatyYouthHacks 2025</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;