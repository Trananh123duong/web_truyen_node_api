const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB();

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
