const express = require('express');
const router = express.Router();
const { getAllStories } = require('../controllers/storyController');

// Định nghĩa các endpoint
router.get('/', getAllStories);

module.exports = router;
