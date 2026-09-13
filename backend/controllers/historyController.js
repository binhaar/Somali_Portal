const History = require("../models/History");

// =========================================================
// GET PUBLIC HISTORY
// GET /api/history
// =========================================================

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

    // Sort historical content
    history.content = (history.content || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => a.order - b.order);

    // Sort responsibilities
    history.responsibilities = (
      history.responsibilities || []
    )
      .filter((item) => item.status === "active")
      .sort((a, b) => a.order - b.order);

    // Sort closing content
    history.closingContent = (
      history.closingContent || []
    )
      .filter((item) => item.status === "active")
      .sort((a, b) => a.order - b.order);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load History page.",
    });
  }
};


// =========================================================
// GET ALL HISTORY
// GET /api/history/admin/all
// =========================================================

const getAllHistory = async (req, res) => {
  try {
    const histories = await History.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: histories,
    });
  } catch (error) {
    console.error("Get All History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load History records.",
    });
  }
};


// =========================================================
// GET HISTORY BY ID
// GET /api/history/admin/:id
// =========================================================

const getHistoryById = async (req, res) => {
  try {
    const history = await History.findById(
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
      data: history,
    });
  } catch (error) {
    console.error(
      "Get History By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load History record.",
    });
  }
};


// =========================================================
// CREATE HISTORY
// POST /api/history/admin
// =========================================================

const createHistory = async (req, res) => {
  try {
    const {
      title,
      heading,
      content,
      responsibilitiesHeading,
      responsibilities,
      closingContent,
      status,
    } = req.body;

    // Validate required fields
    if (!title || !heading) {
      return res.status(400).json({
        success: false,
        message:
          "Title and heading are required.",
      });
    }

    // Only ONE History page
    const existingHistory =
      await History.findOne({
        slug: "history",
      });

    if (existingHistory) {
      return res.status(409).json({
        success: false,
        message:
          "History page already exists. Please edit the existing page.",
      });
    }

    const history = await History.create({
      title: title.trim(),

      slug: "history",

      heading: heading.trim(),

      content: Array.isArray(content)
        ? content.map((item, index) => ({
            text: item.text,
            order: index,
            status:
              item.status || "active",
          }))
        : [],

      responsibilitiesHeading:
        responsibilitiesHeading ||
        "Responsibilities",

      responsibilities:
        Array.isArray(responsibilities)
          ? responsibilities.map(
              (item, index) => ({
                text: item.text,
                order: index,
                status:
                  item.status || "active",
              })
            )
          : [],

      closingContent:
        Array.isArray(closingContent)
          ? closingContent.map(
              (item, index) => ({
                text: item.text,
                order: index,
                status:
                  item.status || "active",
              })
            )
          : [],

      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message:
        "History page created successfully.",
      data: history,
    });
  } catch (error) {
    console.error(
      "Create History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create History page.",
    });
  }
};


// =========================================================
// UPDATE HISTORY
// PUT /api/history/admin/:id
// =========================================================

const updateHistory = async (req, res) => {
  try {
    const {
      title,
      heading,
      content,
      responsibilitiesHeading,
      responsibilities,
      closingContent,
      status,
    } = req.body;

    const history =
      await History.findById(
        req.params.id
      );

    if (!history) {
      return res.status(404).json({
        success: false,
        message:
          "History record not found.",
      });
    }

    history.title =
      title?.trim() || history.title;

    // URL is permanently fixed
    history.slug = "history";

    history.heading =
      heading?.trim() ||
      history.heading;

    history.content =
      Array.isArray(content)
        ? content.map(
            (item, index) => ({
              text: item.text,
              order: index,
              status:
                item.status || "active",
            })
          )
        : [];

    history.responsibilitiesHeading =
      responsibilitiesHeading ||
      "Responsibilities";

    history.responsibilities =
      Array.isArray(responsibilities)
        ? responsibilities.map(
            (item, index) => ({
              text: item.text,
              order: index,
              status:
                item.status || "active",
            })
          )
        : [];

    history.closingContent =
      Array.isArray(closingContent)
        ? closingContent.map(
            (item, index) => ({
              text: item.text,
              order: index,
              status:
                item.status || "active",
            })
          )
        : [];

    history.status =
      status || "active";

    await history.save();

    return res.status(200).json({
      success: true,
      message:
        "History page updated successfully.",
      data: history,
    });
  } catch (error) {
    console.error(
      "Update History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update History page.",
    });
  }
};


// =========================================================
// DELETE HISTORY
// DELETE /api/history/admin/:id
// =========================================================

const deleteHistory = async (req, res) => {
  try {
    const history =
      await History.findByIdAndDelete(
        req.params.id
      );

    if (!history) {
      return res.status(404).json({
        success: false,
        message:
          "History record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "History page deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete History page.",
    });
  }
};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {
  getHistory,
  getAllHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
};