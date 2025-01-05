const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true }, // Liên kết với Story
  chapter_ids: { type: String}, // Liên kết các chương liên quan
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
