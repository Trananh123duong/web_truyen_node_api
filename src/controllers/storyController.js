const Story = require('../models/storyModel');
const Category = require('../models/categoryModel');
const Chapter = require('../models/chapterModel');


// Lấy danh sách tất cả các stories
const getAllStories = async (req, res) => {
  try {
    // Lấy query parameters
    const { keyword, active } = req.query;

    // Tạo điều kiện tìm kiếm
    let queryConditions = {};

    // Nếu có keyword, tìm trong title và content
    if (keyword) {
      queryConditions.$or = [
        { title: { $regex: keyword, $options: 'i' } }, // Tìm kiếm không phân biệt hoa thường
        { content: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Nếu có active, kiểm tra với active trong DB
    if (active) {
      queryConditions.active = active;
    }

    // Thực hiện truy vấn với điều kiện
    const stories = await Story.find(queryConditions)
      .populate('categories', '_id name'); // Lấy thông tin của categories

    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin chi tiết một story theo ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm kiếm story theo ID
    const story = await Story.findById(id).populate('categories', '_id name');

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Tìm chapters liên quan đến story
    const chapters = await Chapter.find({ story_id: id }).select('_id title');

    res.status(200).json({
      success: true,
      data: {
        ...story.toObject(),
        chapters // Thêm danh sách chapters vào kết quả
      }
    });
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
