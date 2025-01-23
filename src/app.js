const express = require('express');
const app = express();

const storyRoutes = require('./routes/storyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json()); // Để xử lý JSON

// Routes
app.use('/api/stories', storyRoutes); // Định nghĩa route chính
app.use('/api/categories', categoryRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
