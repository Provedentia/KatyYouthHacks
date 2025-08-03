const express = require('express');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');
const tavilyRoutes = require('./routes/tavilyRoutes');
const authRoutes = require('./routes/authRoutes');
const GVRoutes = require('./routes/GVRoutes');
const groqRoutes = require('./routes/groqRoutes');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', mainRoutes);
app.use('/tavily', tavilyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', GVRoutes);
app.use('/groq', groqRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
