const mongoose = require("mongoose");
const { MONGODB_URI, MONGODB_POOL_SIZE, NODE_ENV } = require("./env");

const connectDB = async () => {
  try {
    const options = {
      // Connection pool size for handling concurrent requests
      maxPoolSize: MONGODB_POOL_SIZE,
      minPoolSize: 2,

      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Auto-indexing (disable in production for performance)
      autoIndex: NODE_ENV === "development",

      // Buffering settings
      bufferCommands: false,
    };

    const conn = await mongoose.connect(MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
