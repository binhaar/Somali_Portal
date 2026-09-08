const User = require("../models/User");

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// GET ALL USERS - PAGINATED
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments()
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    res.status(500).json({
      message: "Failed to get users"
    });
  }
};

// ==========================================
// SEARCH USERS - PAGINATED
// ==========================================

const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const searchText = escapeRegex(q);
    const regex = new RegExp(searchText, "i");

    const filter = {
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { nationalIdNumber: regex },
        { passportNumber: regex }
      ]
    };

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      query: q,
      data: users,
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Search users error:", error.message);

    res.status(500).json({
      message: "Failed to search users"
    });
  }
};

// ==========================================
// GET SINGLE USER
// ==========================================

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get single user error:", error.message);

    res.status(400).json({
      message: "Invalid user ID"
    });
  }
};

// ==========================================
// TOGGLE USER STATUS
// ==========================================

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot deactivate your own account"
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Toggle user status error:", error.message);

    res.status(400).json({
      message: "Invalid user ID"
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account"
      });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({
        message: "Admin accounts cannot be deleted"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error.message);

    res.status(400).json({
      message: "Invalid user ID"
    });
  }
};

module.exports = {
  getAllUsers,
  searchUsers,
  getSingleUser,
  toggleUserStatus,
  deleteUser
};