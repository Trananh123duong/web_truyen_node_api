const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');

// GET: Lấy danh sách tất cả stories
router.get('/', getAllStories);

// GET: Lấy thông tin một story theo ID
router.get('/:id', getStoryById);

// POST: Tạo một story mới
router.post('/', createStory);

// PUT: Cập nhật một story theo ID
router.put('/:id', updateStory);

// DELETE: Xóa một story theo ID
router.delete('/:id', deleteStory);

module.exports = router;
