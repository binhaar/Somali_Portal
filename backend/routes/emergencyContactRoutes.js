const express = require("express");

const {
  createEmergencyContact,
  getEmergencyContacts,
  getSingleEmergencyContact,
  getAllEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  toggleEmergencyContactStatus
} = require("../controllers/emergencyContactController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// PUBLIC
router.get("/", getEmergencyContacts);


// ADMIN
router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllEmergencyContacts
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createEmergencyContact
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateEmergencyContact
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteEmergencyContact
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleEmergencyContactStatus
);


// SINGLE CONTACT
router.get(
  "/:id",
  getSingleEmergencyContact
);


module.exports = router;