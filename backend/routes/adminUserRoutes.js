const express = require("express");

const {
  getAllUsers,
  searchUsers,
  getSingleUser,
  toggleUserStatus,
  deleteUser
} = require("../controllers/adminUserController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Authentication
router.use(protect);

// ADMIN only
router.use(authorizeRoles("ADMIN"));

// Get all users
router.get("/", getAllUsers);

// Search users
router.get("/search", searchUsers);

// Get single user
router.get("/:id", getSingleUser);

// Toggle user active/inactive
router.patch("/:id/toggle", toggleUserStatus);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;