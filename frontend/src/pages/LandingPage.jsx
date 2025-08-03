import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Scan, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



function LandingPage() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/get-started');
  }
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
          <div className="hidden md:flex gap-8">
            <NavLink>Features</NavLink>
            <NavLink>About</NavLink>
            <NavLink>Contact</NavLink>
          </div>
          <motion.button 
            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
          >
            Get Started
          </motion.button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 leading-tight mb-6">
              Live sustainably with ease
            </h2>
            <p className="text-lg text-emerald-800/80 mb-8 max-w-md">
              Sustain-ify guides you toward a more sustainable lifestyle through personalized recommendations and practical solutions.
            </p>
            <div className="flex gap-4">
              <motion.button 
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-emerald-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
              >
                Get Started
              </motion.button>
              <motion.button 
                className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-full font-medium cursor-pointer"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="w-full h-[400px] bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl overflow-hidden relative">
              {/* Placeholder for app screenshot or illustration */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-xl font-medium">Sustainable Living at Your Fingertips</span>
              </div>
            </div>
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-200 rounded-xl"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                y: [0, -5, 0, 5, 0]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -top-4 -right-4 w-14 h-14 bg-teal-300 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Three Ways to Live Sustainably</h2>
          <p className="text-lg text-emerald-800/80 max-w-2xl mx-auto">
            Sustain-ify offers a trio of powerful features to help you make environmentally conscious decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<Camera className="w-7 h-7" />}
            title="DIY Project Generator"
            description="Upload a picture of a household item and get creative do-it-yourself projects to repurpose it instead of throwing it away."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Scan className="w-7 h-7" />}
            title="Eco-Shopping Assistant"
            description="Scan a product's barcode to see its environmental impact score and get recommendations for more sustainable alternatives."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Heart className="w-7 h-7" />}
            title="Health & Wellness Advisor"
            description="Upload health reports to receive personalized shopping advice that aligns with both your health needs and sustainability goals."
            delay={0.5}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <motion.div 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div 
              className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-white"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -10, 0],
                y: [0, 10, 0]
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your lifestyle?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of users who have already made the switch to a more sustainable way of living with Sustain-ify.
            </p>
            <motion.button 
              className="bg-white text-emerald-600 px-8 py-3 rounded-full font-medium shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started For Free
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-400 rounded-full" />
                <h3 className="text-xl font-bold">Sustain-ify</h3>
              </div>
              <p className="max-w-xs text-emerald-300">
                Guiding you toward a more sustainable lifestyle, one step at a time.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className='col-span-2'>
                <h4 className="font-bold mb-4">Features</h4>
                <ul className="space-y-2">
                  <FooterLink>DIY Projects</FooterLink>
                  <FooterLink>Eco-Shopping</FooterLink>
                  <FooterLink>Health Advisor</FooterLink>
                </ul>
              </div>
              {/* <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <FooterLink>About Us</FooterLink>
                  <FooterLink>Our Mission</FooterLink>
                  <FooterLink>Contact</FooterLink>
                </ul>
              </div> */}
            </div>
          </div>
          {/* <div className="border-t border-emerald-800 mt-12 pt-6 text-center text-emerald-400">
            <p>© {new Date().getFullYear()} Sustain-ify. All rights reserved.</p>
          </div> */}
        </div>
      </footer>
    </div>
  );
}

// Utility Components
const NavLink = ({ children }) => (
  <motion.a 
    href="#" 
    className="text-emerald-700 hover:text-emerald-500 font-medium"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <motion.div 
      className="bg-emerald-100 text-emerald-600 p-3 rounded-lg inline-block mb-4"
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        backgroundColor: "#10b981",
        color: "#ffffff"
      }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold text-emerald-900 mb-3">{title}</h3>
    <p className="text-emerald-700/80">{description}</p>
  </motion.div>
);

const FooterLink = ({ children }) => (
  <li>
    <motion.a 
      href="#" 
      className="text-emerald-300 hover:text-white transition-colors"
      whileHover={{ x: 3 }}
    >
      {children}
    </motion.a>
  </li>
);

export default LandingPage;
