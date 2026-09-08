const express = require("express");

const {
  createCabinetMember,
  getCabinetMembers,
  getAllCabinetMembers,
  updateCabinetMember,
  deleteCabinetMember,
  toggleCabinetMemberStatus
} = require("../controllers/cabinetController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.get("/", getCabinetMembers);


// ==========================================
// ADMIN
// ==========================================

router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllCabinetMembers
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createCabinetMember
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateCabinetMember
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteCabinetMember
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleCabinetMemberStatus
);


module.exports = router;