web-truyen-api/
│
├── node_modules/            # Các thư viện đã cài đặt
├── src/
│   ├── routes/              # Nơi định nghĩa các route
│   │   └── storyRoutes.js   # Routes cho truyện
│   ├── controllers/         # Xử lý logic API
│   │   └── storyController.js
│   ├── models/              # Kết nối DB (nếu dùng MongoDB/MySQL)
│   │   └── storyModel.js
│   ├── app.js               # Cấu hình Express
│   └── index.js             # Điểm khởi đầu ứng dụng
├── package.json             # File cấu hình npm
└── .gitignore               # File ignore cho Git
