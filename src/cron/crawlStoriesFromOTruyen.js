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

            const dataListStory = response.data.data.items;
            if (dataListStory.length == 0) {
                break;
            } else {
                dataListStory.forEach(async (element, index) => {
                    await crawlStory(MANGA_OTRUYEN_URL + "/v1/api/truyen-tranh/" +element.slug);
                });
            }

            i++;
            if (i > 5) {
                i = 1;
            }
        }

        console.log("Hoàn thành crawl truyện từ API nguồn.");
    } catch (error) {
        console.error("Lỗi khi crawl truyện:", error.message);
    }
};

const crawlStory = async (linkContent) => {
    try {
        await sleep(5000);
        const response = await axios.get(linkContent);
        const data = response.data.data.item;
        
        const isCompleted = data.status;
        const listChapters = data.chapters[0].server_data;
        const title = data.name;
        const content = data.content;
        const author = data.author.join(", ");

        console.log(author);
    } catch (error) {
        console.error("Lỗi khi crawl truyện:", error.message);
    }
}

// Tạo cron job chạy mỗi 6 giờ
nodeCron.schedule("0 */6 * * *", () => {
    console.log("Chạy cron job crawl truyện...");
    crawlStoriesFromOTruyen();
});

module.exports = crawlStoriesFromOTruyen;
