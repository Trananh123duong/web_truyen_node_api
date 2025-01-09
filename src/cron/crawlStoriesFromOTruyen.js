const axios = require("axios");
const Story = require("../models/storyModel"); // Import model Story
const Category = require("../models/categoryModel"); // Import model Category
const Chapter = require("../models/chapterModel"); // Import model Chapter
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
        const listCategories = data.category;

        let story = await Story.findOne({ title });
        let categoryIds = [];
        if (!story) {
            console.log(`Thêm mới truyện: ${title}`);

            // Tạo các category nếu chưa tồn tại
            categoryIds = await Promise.all(
                listCategories.map(async (categoryName) => {
                    let category = await Category.findOne({ name: categoryName.name });
                    if (!category) {
                        category = new Category({ name: categoryName.name });
                        await category.save();
                    }
                    return category._id;
                })
            );

            // Tạo mới story
            story = new Story({
                title,
                author,
                isCompleted,
                content,
                categories: categoryIds,
                active: 0, // Ban đầu đặt trạng thái chưa crawl xong
            });
            await story.save();
        } else {
            console.log(`Cập nhật thông tin truyện: ${title}`);

            // Cập nhật thông tin truyện
            categoryIds = await Promise.all(
                listCategories.map(async (categoryName) => {
                    let category = await Category.findOne({ name: categoryName.name });
                    if (!category) {
                        category = new Category({ name: categoryName.name });
                        await category.save();
                    }
                    return category._id;
                })
            );

            story.author = author;
            story.isCompleted = isCompleted;
            story.content = content;
            story.categories = categoryIds;
            story.active = 0; // Cập nhật trạng thái đã crawl xong
            await story.save();
        }

        await Promise.all(
            categoryIds.map(async (categoryId) => {
                const category = await Category.findById(categoryId);
                console.log(story._id);
                if (!category.stories.includes(story._id)) {
                    category.stories.push(story._id);
                    await category.save();
                }
            })
        );

        listChapters.forEach(async (dataChapter) => {
            let chapterTitle = 'Chapter ' + dataChapter.chapter_name + (dataChapter.chapter_title ? ": " + dataChapter.chapter_title : '');
            await crawlChapter(story._id, dataChapter.chapter_api_data, chapterTitle);
        });
    } catch (error) {
        console.error("Lỗi khi crawl truyện:", error.message);
    }
}

const crawlChapter = async (storyId, linkContent, title) => {
    console.log(storyId, linkContent, title);
}

// Tạo cron job chạy mỗi 6 giờ
nodeCron.schedule("0 */6 * * *", () => {
    console.log("Chạy cron job crawl truyện...");
    crawlStoriesFromOTruyen();
});

module.exports = crawlStoriesFromOTruyen;
