/**
 * MongoDB Connection Configuration
 * Establishes connection to MongoDB with optimized settings
 */

const mongoose = require("mongoose");
const { MONGODB_URI, MONGODB_POOL_SIZE, NODE_ENV } = require("./env");

/**
 * Connect to MongoDB with connection pooling and optimization
 * @returns {Promise<void>}
 */
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

    // Log connection pool stats in development
    if (NODE_ENV === "development") {
      mongoose.connection.on("connected", () => {
        console.log("🔗 Mongoose connected to MongoDB");
      });

      mongoose.connection.on("error", (err) => {
        console.error("❌ Mongoose connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("🔌 Mongoose disconnected from MongoDB");
      });
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
