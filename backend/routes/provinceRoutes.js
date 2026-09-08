const express = require("express");

const {
  createProvince,
  getProvinces,
  getAllProvinces,
  updateProvince,
  deleteProvince,
  toggleProvinceStatus
} = require("../controllers/provinceController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.get("/", getProvinces);


// ==========================================
// ADMIN
// ==========================================

router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllProvinces
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createProvince
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateProvince
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteProvince
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleProvinceStatus
);


module.exports = router;