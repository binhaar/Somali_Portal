const mongoose = require("mongoose");

const historyContentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    _id: true,
  }
);

const historySchema = new mongoose.Schema(
  {
    // Page title
    title: {
      type: String,
      required: true,
      trim: true,
      default: "History",
    },

    // Fixed URL: /about-somalia/history
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "history",
    },

    // Main heading
    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Historical Background",
    },

    // Historical background paragraphs
    content: {
      type: [historyContentSchema],
      default: [],
    },

    // Responsibilities heading
    responsibilitiesHeading: {
      type: String,
      default: "Responsibilities",
      trim: true,
    },

    // Numbered responsibilities
    responsibilities: {
      type: [historyContentSchema],
      default: [],
    },

    // Final paragraphs
    closingContent: {
      type: [historyContentSchema],
      default: [],
    },

    // Publish status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);