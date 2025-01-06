const axios = require("axios");
const Story = require("../models/storyModel"); // Import model Story
const nodeCron = require("node-cron");

// URL của API nguồn
const MANGA_OTRUYEN_URL="https://otruyenapi.com"; // Thay bằng URL nguồn

// Hàm sleep 5 giây
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Hàm crawl truyện từ API nguồn
const crawlStoriesFromOTruyen = async () => {
    try {
        console.log("Bắt đầu crawl truyện từ API nguồn...");

        let i = 1;
        while (true) {
            let url = MANGA_OTRUYEN_URL + "/v1/api/danh-sach/dang-phat-hanh";

            await sleep(5000);

            // Gửi request tới API nguồn
            const response = await axios.get(url, {
                params: {
                    page: i,
                },
            });

            // Kiểm tra dữ liệu trả về
            if (!response.data) {
                console.error('Không tìm thấy dữ liệu stories trong API nguồn');
                return;
            }

            const dataListStory = response.data;
            console.log(dataListStory);
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
