const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String},
  isCompleted: { type: String}, // Truyện đã hoàn thành hay chưa
  content: { type: String},
  active: { type: Number, default: 0 }, // 0: chưa crawl xong, 1: đã crawl xong
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Liên kết nhiều-nhiều với Category
  // chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }]
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
