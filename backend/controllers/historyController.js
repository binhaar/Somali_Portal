const History = require("../models/History");

// ==========================================
// PUBLIC - GET ACTIVE HISTORY
// ==========================================

const getHistory = async (req, res) => {
  try {
    const history = await History.findOne({
      slug: "history",
      status: "active",
    }).lean();

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History page not found.",
      });
    }

    history.content = (history.content || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    history.responsibilities = (history.responsibilities || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    history.closingContent = (history.closingContent || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading History.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET ALL HISTORY
// ==========================================

const getAllHistory = async (req, res) => {
  try {
    const history = await History.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get All History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading History data.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET HISTORY BY ID
// ==========================================

const getHistoryById = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get History By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading History record.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - CREATE HISTORY
// ==========================================

const createHistory = async (req, res) => {
  try {
    const existingHistory = await History.findOne({
      slug: "history",
    });

    if (existingHistory) {
      return res.status(409).json({
        success: false,
        message:
          "History page already exists. Please update the existing page.",
      });
    }

    const history = await History.create({
      title: req.body.title || "History",

      slug: "history",

      heading:
        req.body.heading || "Historical Background",

      content: Array.isArray(req.body.content)
        ? req.body.content
        : [],

      responsibilitiesHeading:
        req.body.responsibilitiesHeading ||
        "Responsibilities",

      responsibilities:
        Array.isArray(req.body.responsibilities)
          ? req.body.responsibilities
          : [],

      closingContent:
        Array.isArray(req.body.closingContent)
          ? req.body.closingContent
          : [],

      status: req.body.status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "History page created successfully.",
      data: history,
    });
  } catch (error) {
    console.error("Create History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating History page.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE HISTORY
// ==========================================

const updateHistory = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History record not found.",
      });
    }

    if (req.body.title !== undefined) {
      history.title = req.body.title;
    }

    history.slug = "history";

    if (req.body.heading !== undefined) {
      history.heading = req.body.heading;
    }

    if (Array.isArray(req.body.content)) {
      history.content = req.body.content;
    }

    if (req.body.responsibilitiesHeading !== undefined) {
      history.responsibilitiesHeading =
        req.body.responsibilitiesHeading;
    }

    if (Array.isArray(req.body.responsibilities)) {
      history.responsibilities =
        req.body.responsibilities;
    }

    if (Array.isArray(req.body.closingContent)) {
      history.closingContent =
        req.body.closingContent;
    }

    if (req.body.status !== undefined) {
      history.status = req.body.status;
    }

    await history.save();

    return res.status(200).json({
      success: true,
      message: "History page updated successfully.",
      data: history,
    });
  } catch (error) {
    console.error("Update History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating History page.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - DELETE HISTORY
// ==========================================

const deleteHistory = async (req, res) => {
  try {
    const history = await History.findByIdAndDelete(
      req.params.id
    );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History page deleted successfully.",
    });
  } catch (error) {
    console.error("Delete History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting History page.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getHistory,
  getAllHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
};