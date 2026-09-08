const express = require("express");

const {
  createEvent,
  getEvents,
  getSingleEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  toggleEventStatus
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// PUBLIC
router.get("/", getEvents);


// ADMIN
router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllEvents
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteEvent
);

router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("ADMIN"),
  toggleEventStatus
);


// SINGLE EVENT
router.get(
  "/:id",
  getSingleEvent
);


module.exports = router;