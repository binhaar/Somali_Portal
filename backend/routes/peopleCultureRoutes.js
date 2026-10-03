const express = require("express");

const {
  getPeopleCulture,
  getAllPeopleCulture,
  getPeopleCultureById,
  createPeopleCulture,
  updatePeopleCulture,
  deletePeopleCulture,
} = require("../controllers/peopleCultureController");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

// GET
// /api/people-culture?lang=en
// /api/people-culture?lang=so

router.get("/", getPeopleCulture);

// =====================================================
// ADMIN - GET ALL
// =====================================================

// GET
// /api/people-culture/admin/all

router.get(
  "/admin/all",
  getAllPeopleCulture
);

// =====================================================
// ADMIN - GET ONE
// =====================================================

// GET
// /api/people-culture/admin/:id

router.get(
  "/admin/:id",
  getPeopleCultureById
);

// =====================================================
// ADMIN - CREATE
// =====================================================

// POST
// /api/people-culture/admin

router.post(
  "/admin",
  createPeopleCulture
);

// =====================================================
// ADMIN - UPDATE
// =====================================================

// PUT
// /api/people-culture/admin/:id

router.put(
  "/admin/:id",
  updatePeopleCulture
);

// =====================================================
// ADMIN - DELETE
// =====================================================

// DELETE
// /api/people-culture/admin/:id

router.delete(
  "/admin/:id",
  deletePeopleCulture
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;