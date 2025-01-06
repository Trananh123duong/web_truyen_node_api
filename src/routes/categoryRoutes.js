const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// GET: Lấy danh sách tất cả categories
router.get('/', getAllCategories);

// GET: Lấy thông tin một category theo ID
router.get('/:id', getCategoryById);

// POST: Tạo một category mới
router.post('/', createCategory);

// PUT: Cập nhật một category theo ID
router.put('/:id', updateCategory);

// DELETE: Xóa một category theo ID
router.delete('/:id', deleteCategory);

module.exports = router;
