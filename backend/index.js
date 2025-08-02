const express = require('express');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');
const tavilyRoutes = require('./routes/tavilyRoutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', mainRoutes);
app.use('/tavily', tavilyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
