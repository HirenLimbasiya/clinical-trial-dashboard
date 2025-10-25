import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS globally
app.use(cors()); // simple and works for all routes

// Parse JSON
app.use(express.json());

// Base route
app.get("/test", (req, res) =>
  res.send("Clinical Trial Analytics API is running...")
);

// Analytics routes
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
