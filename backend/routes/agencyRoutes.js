const express = require("express");

const {
  createAgency,
  getAgencies,
  getAllAgencies,
  updateAgency,
  deleteAgency,
  toggleAgencyStatus
} = require("../controllers/agencyController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// PUBLIC
router.get("/", getAgencies);


// ADMIN
router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllAgencies
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createAgency
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateAgency
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteAgency
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleAgencyStatus
);


module.exports = router;