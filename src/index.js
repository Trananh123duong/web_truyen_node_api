const app = require('./app'); // Import cấu hình Express
const PORT = process.env.PORT || 3000;

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
