const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();


// Any logged-in user
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
});


// Admin only
router.get(
  "/admin-test",
  protect,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);


module.exports = router;