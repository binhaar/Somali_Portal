const express = require("express");

const {
  createService,
  getServices,
  getSingleService,
  getAllServices,
  updateService,
  deleteService,
  toggleServiceStatus
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get("/", getServices);

// ==========================================
// ADMIN
// ==========================================

router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllServices
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createService
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateService
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteService
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleServiceStatus
);

// ==========================================
// PUBLIC SINGLE SERVICE
// Must be after /admin/all
// ==========================================

router.get("/:id", getSingleService);

module.exports = router;