
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kết nối MongoDB trước khi mở cổng nhận request
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Cannot start server:", error.message);
    process.exit(1);
  }
};

startServer();
