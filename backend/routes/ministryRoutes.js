const express = require("express");

const {
  createMinistry,
  getMinistries,
  getAllMinistries,
  updateMinistry,
  deleteMinistry,
  toggleMinistryStatus
} = require("../controllers/ministryController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// PUBLIC
router.get("/", getMinistries);


// ADMIN
router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllMinistries
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createMinistry
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateMinistry
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteMinistry
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleMinistryStatus
);

module.exports = router;