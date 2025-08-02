/**
 * Controller for main application functionality
 */

// Welcome endpoint
exports.welcome = (req, res) => {
  res.json({ 
    message: 'Welcome to the Sustain-ify API',
    version: '1.0.0',
    status: 'active' 
  });
};

// Health check endpoint
exports.healthCheck = (req, res) => {
  res.json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};
