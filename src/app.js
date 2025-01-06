const express = require('express');
const app = express();

const storyRoutes = require('./routes/storyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Middleware
app.use(express.json()); // Để xử lý JSON

// Routes
app.use('/api/stories', storyRoutes); // Định nghĩa route chính
app.use('/api/categories', categoryRoutes);

module.exports = app;
