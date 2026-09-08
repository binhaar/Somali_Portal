const express = require("express");

const {
  getSettings,
  updateSettings,
  toggleMaintenanceMode,
  toggleRegistration,
  togglePublicServices,
} = require("../controllers/settingController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();


// ADMIN ONLY

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getSettings
);

router.put(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  updateSettings
);

router.patch(
  "/maintenance",
  protect,
  authorizeRoles("ADMIN"),
  toggleMaintenanceMode
);

router.patch(
  "/registration",
  protect,
  authorizeRoles("ADMIN"),
  toggleRegistration
);

router.patch(
  "/public-services",
  protect,
  authorizeRoles("ADMIN"),
  togglePublicServices
);


module.exports = router;