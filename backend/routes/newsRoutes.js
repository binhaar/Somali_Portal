const express = require("express");

const {
  createNews,
  getNews,
  getSingleNews,
  getAllNews,
  updateNews,
  deleteNews,
  toggleNewsStatus
} = require("../controllers/newsController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.get("/", getNews);

router.get("/:id", getSingleNews);


// ==========================================
// ADMIN
// ==========================================

router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllNews
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createNews
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateNews
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteNews
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleNewsStatus
);


module.exports = router;