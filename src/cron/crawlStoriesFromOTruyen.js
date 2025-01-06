const axios = require("axios");
const Story = require("../models/storyModel"); // Import model Story
const nodeCron = require("node-cron");

// URL của API nguồn
const SOURCE_API_URL = "https://api-nguon.com/stories"; // Thay bằng URL nguồn

// Hàm crawl truyện từ API nguồn
const crawlStoriesFromOTruyen = async () => {
    try {
        console.log("Bắt đầu crawl truyện từ API nguồn...");

        // Gửi request tới API nguồn
        const response = await axios.get(SOURCE_API_URL);

        // Kiểm tra dữ liệu trả về
        if (!response.data || !response.data.stories) {
            console.error("Không tìm thấy dữ liệu stories trong API nguồn");
            return;
        }

        const stories = response.data.stories;

        // Lưu dữ liệu vào database
        for (const story of stories) {
            // Kiểm tra nếu truyện đã tồn tại trong DB (dựa vào tiêu đề)
            const existingStory = await Story.findOne({ title: story.title });

            if (!existingStory) {
                // Nếu truyện chưa tồn tại, lưu vào DB
                const newStory = new Story({
                    title: story.title,
                    author: story.author || "Không rõ", // Lấy tác giả từ API nguồn, nếu không có thì mặc định
                    isCompleted: story.isCompleted ? "true" : "false", // Đã hoàn thành hay chưa
                    content: story.content || "Đang cập nhật...", // Nội dung
                    active: 0, // Mặc định là chưa crawl xong (0)
                    categories: [], // Mặc định để rỗng, có thể xử lý thêm nếu API nguồn có category
                });

                await newStory.save();
                console.log(`Đã lưu truyện mới: ${story.title}`);
            } else {
                console.log(`Truyện đã tồn tại: ${story.title}`);
            }
        }

        console.log("Hoàn thành crawl truyện từ API nguồn.");
    } catch (error) {
        console.error("Lỗi khi crawl truyện:", error.message);
    }
};

// Tạo cron job chạy mỗi 6 giờ
nodeCron.schedule("0 */6 * * *", () => {
    console.log("Chạy cron job crawl truyện...");
    crawlStoriesFromOTruyen();
});

module.exports = crawlStoriesFromOTruyen;
