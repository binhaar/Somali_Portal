const express = require("express");

const {
  getDashboardStats,
  getRecentDashboardData
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

// ==========================================
// RECENT DASHBOARD DATA
// ==========================================

router.get(
  "/dashboard/recent",
  protect,
  authorizeRoles("ADMIN"),
  getRecentDashboardData
);

module.exports = router;