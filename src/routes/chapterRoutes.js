const express = require('express');
const router = express.Router();
const {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');

// GET: Lấy danh sách tất cả chapters
router.get('/', getAllChapters);

// GET: Lấy thông tin một chapter theo ID
router.get('/:id', getChapterById);

// POST: Tạo một chapter mới
router.post('/', createChapter);

// PUT: Cập nhật một chapter theo ID
router.put('/:id', updateChapter);

// DELETE: Xóa một chapter theo ID
router.delete('/:id', deleteChapter);

module.exports = router;
