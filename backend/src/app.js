const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const {
  CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
} = require("./config/env");

const app = express();

// Security middleware - Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// CORS configuration - Allow cross-origin requests from frontend
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression middleware - Compress all responses
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting - Prevent abuse by limiting repeated requests
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes default
  max: RATE_LIMIT_MAX_REQUESTS, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api", routes);

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404,
    },
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
