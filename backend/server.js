const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const ministryRoutes = require("./routes/ministryRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const provinceRoutes = require("./routes/provinceRoutes");
const cabinetRoutes = require("./routes/cabinetRoutes");
const newsRoutes = require("./routes/newsRoutes");
const eventRoutes = require("./routes/eventRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const searchRoutes = require("./routes/searchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const settingRoutes = require("./routes/settingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const historyRoutes = require("./routes/historyRoutes");
const tourismRoutes = require("./routes/tourismRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://somali-portal.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      // Postman, Thunder Client, browser direct requests, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/ministries", ministryRoutes);

app.use("/api/agencies", agencyRoutes);

app.use("/api/provinces", provinceRoutes);

app.use("/api/cabinet", cabinetRoutes);

app.use("/api/news", newsRoutes);

app.use("/api/events", eventRoutes);

app.use(
  "/api/emergency-contacts",
  emergencyContactRoutes
);

app.use("/api/search", searchRoutes);

app.use("/api/admin", adminRoutes);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use("/api/settings", settingRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/history", historyRoutes);

// =====================================================
// TOURISM ROUTE
// =====================================================

console.log("Loading Tourism routes...");

app.use(
  "/api/tourism",
  tourismRoutes
);

console.log("TOURISM ROUTES REGISTERED");

// =====================================================
// TOURISM TEST ROUTE
// =====================================================

app.get(
  "/api/tourism-test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Tourism route test is working",
    });
  }
);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Somalia Government Portal API is running",
  });
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Tourism API: http://localhost:${PORT}/api/tourism`
    );

    console.log(
      `Tourism Test: http://localhost:${PORT}/api/tourism-test`
    );
  }
);