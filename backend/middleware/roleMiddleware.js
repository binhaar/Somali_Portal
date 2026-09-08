// ==========================================
// AUTHORIZE USER ROLES
// ==========================================

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // ==========================================
    // CHECK AUTHENTICATION
    // ==========================================

    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated."
      });
    }

    // ==========================================
    // CHECK USER ROLE
    // ==========================================

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Access denied. You do not have permission to access this resource."
      });
    }

    // ==========================================
    // AUTHORIZED
    // ==========================================

    next();
  };
};

module.exports = {
  authorizeRoles
};