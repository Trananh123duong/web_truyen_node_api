const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // Có thể rỗng
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }], // Liên kết nhiều-nhiều với Story
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
