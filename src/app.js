const express = require('express');
const app = express();
const storyRoutes = require('./routes/storyRoutes');

// Middleware
app.use(express.json()); // Để xử lý JSON

// Routes
app.use('/api/stories', storyRoutes); // Định nghĩa route chính

module.exports = app;
