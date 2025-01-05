// Controller xử lý logic API
const getAllStories = (req, res) => {
    res.status(200).json({
        success: true,
        data: [
            { id: 1, title: 'Truyện 1', views: 100 },
            { id: 2, title: 'Truyện 2', views: 200 },
        ],
    });
};

module.exports = { getAllStories };
