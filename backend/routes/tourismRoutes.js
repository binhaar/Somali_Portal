const express = require("express");

const {
  getTourism,
  getAllTourism,
  getTourismById,
  createTourism,
  updateTourism,
  deleteTourism,
} = require("../controllers/tourismController");

const router = express.Router();

router.get("/", getTourism);

router.get(
  "/admin/all",
  getAllTourism
);

router.get(
  "/admin/:id",
  getTourismById
);

router.post(
  "/admin",
  createTourism
);

router.put(
  "/admin/:id",
  updateTourism
);

router.delete(
  "/admin/:id",
  deleteTourism
);

module.exports = router;