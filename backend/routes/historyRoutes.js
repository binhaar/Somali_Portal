const express = require("express");

const {
  getHistory,
  getAllHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
} = require("../controllers/historyController");

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get("/", getHistory);

// ==========================================
// ADMIN
// ==========================================

router.get("/admin/all", getAllHistory);

router.get("/admin/:id", getHistoryById);

router.post("/admin", createHistory);

router.put("/admin/:id", updateHistory);

router.delete("/admin/:id", deleteHistory);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;