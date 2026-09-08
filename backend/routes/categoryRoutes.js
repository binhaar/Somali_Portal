const express = require("express");

const {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.get("/", getCategories);


// ==========================================
// ADMIN
// ==========================================

router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllCategories
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createCategory
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteCategory
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleCategoryStatus
);


module.exports = router;