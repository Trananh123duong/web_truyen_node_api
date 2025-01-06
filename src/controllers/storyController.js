const Story = require('../models/storyModel');
const Category = require('../models/categoryModel');

// Lấy danh sách tất cả các stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('categories'); // Lấy thông tin đầy đủ của categories
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin chi tiết một story theo ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id).populate('categories');
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo một story mới
const createStory = async (req, res) => {
  try {
    const { title, author, isCompleted, content, active, categories } = req.body;

    // Tạo story
    const newStory = new Story({ title, author, isCompleted, content, active, categories });
    await newStory.save();

    // Cập nhật danh sách stories trong từng category
    if (categories && categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: categories } },
        { $push: { stories: newStory._id } }
      );
    }

    res.status(201).json({ success: true, data: newStory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật thông tin một story
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isCompleted, content, active, categories } = req.body;

    // Tìm và cập nhật story
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { title, author, isCompleted, content, active, categories },
      { new: true, runValidators: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Cập nhật danh sách categories nếu có
    if (categories && categories.length > 0) {
      // Loại bỏ story ID khỏi các categories cũ
      await Category.updateMany(
        { stories: id },
        { $pull: { stories: id } }
      );

      // Thêm story ID vào các categories mới
      await Category.updateMany(
        { _id: { $in: categories } },
        { $push: { stories: id } }
      );
    }

    res.status(200).json({ success: true, data: updatedStory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa một story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa story
    const deletedStory = await Story.findByIdAndDelete(id);

    if (!deletedStory) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Loại bỏ story ID khỏi tất cả các categories liên quan
    await Category.updateMany(
      { stories: id },
      { $pull: { stories: id } }
    );

    res.status(200).json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
};
