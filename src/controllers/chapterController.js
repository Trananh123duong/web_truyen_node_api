const Chapter = require('../models/chapterModel');
const Story = require('../models/storyModel');

// Lấy danh sách tất cả các chapters
const getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('story_id'); // Lấy đầy đủ thông tin của story liên quan
    res.status(200).json({ success: true, data: chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin chi tiết một chapter theo ID
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findById(id).populate('story_id'); // Lấy thông tin story liên quan
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }
    res.status(200).json({ success: true, data: chapter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo một chapter mới
const createChapter = async (req, res) => {
  try {
    const { title, story_id, chapter_ids } = req.body;

    // Kiểm tra xem story có tồn tại không
    const story = await Story.findById(story_id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Tạo chapter
    const newChapter = new Chapter({ title, story_id, chapter_ids });
    await newChapter.save();

    res.status(201).json({ success: true, data: newChapter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật thông tin một chapter
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, story_id, chapter_ids } = req.body;

    // Kiểm tra xem story có tồn tại không (nếu truyền vào story_id mới)
    if (story_id) {
      const story = await Story.findById(story_id);
      if (!story) {
        return res.status(404).json({ success: false, message: 'Story not found' });
      }
    }

    // Tìm và cập nhật chapter
    const updatedChapter = await Chapter.findByIdAndUpdate(
      id,
      { title, story_id, chapter_ids },
      { new: true, runValidators: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    res.status(200).json({ success: true, data: updatedChapter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa một chapter
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa chapter
    const deletedChapter = await Chapter.findByIdAndDelete(id);

    if (!deletedChapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    res.status(200).json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
};
