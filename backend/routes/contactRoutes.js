const express = require("express");

const {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.post("/", createContactMessage);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  getContactMessages
);

router.get(
  "/admin/:id",
  protect,
  authorizeRoles("ADMIN"),
  getContactMessage
);

router.patch(
  "/admin/:id/status",
  protect,
  authorizeRoles("ADMIN"),
  updateContactMessageStatus
);

router.delete(
  "/admin/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteContactMessage
);

module.exports = router;