const Tourism = require("../models/Tourism");

// PUBLIC
const getTourism = async (req, res) => {
  try {
    console.log("GET /api/tourism CALLED");

    const tourism = await Tourism.findOne({
      slug: "tourism",
      status: "active",
    }).lean();

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tourism,
    });
  } catch (error) {
    console.error("GET TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tourism information",
      error: error.message,
    });
  }
};

// ADMIN - GET ALL
const getAllTourism = async (req, res) => {
  try {
    const tourism = await Tourism.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: tourism,
    });
  } catch (error) {
    console.error("GET ALL TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tourism information",
      error: error.message,
    });
  }
};

// ADMIN - GET ONE
const getTourismById = async (req, res) => {
  try {
    const tourism = await Tourism.findById(
      req.params.id
    ).lean();

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tourism,
    });
  } catch (error) {
    console.error("GET TOURISM BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tourism information",
      error: error.message,
    });
  }
};

// CREATE
const createTourism = async (req, res) => {
  try {
    const existing = await Tourism.findOne({
      slug: "tourism",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Tourism information already exists",
      });
    }

    const tourism = await Tourism.create({
      ...req.body,
      slug: "tourism",
    });

    return res.status(201).json({
      success: true,
      message: "Tourism created successfully",
      data: tourism,
    });
  } catch (error) {
    console.error("CREATE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create tourism",
      error: error.message,
    });
  }
};

// UPDATE
const updateTourism = async (req, res) => {
  try {
    const tourism = await Tourism.findById(
      req.params.id
    );

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found",
      });
    }

    Object.assign(tourism, {
      ...req.body,
      slug: "tourism",
    });

    await tourism.save();

    return res.status(200).json({
      success: true,
      message: "Tourism updated successfully",
      data: tourism,
    });
  } catch (error) {
    console.error("UPDATE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update tourism",
      error: error.message,
    });
  }
};

// DELETE
const deleteTourism = async (req, res) => {
  try {
    const tourism =
      await Tourism.findByIdAndDelete(
        req.params.id
      );

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tourism deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete tourism",
      error: error.message,
    });
  }
};

module.exports = {
  getTourism,
  getAllTourism,
  getTourismById,
  createTourism,
  updateTourism,
  deleteTourism,
};