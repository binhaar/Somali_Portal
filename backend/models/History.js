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
    title: {
      type: String,
      required: true,
      trim: true,
      default: "History",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "history",
    },

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Historical Background",
    },

    content: {
      type: [historyContentSchema],
      default: [],
    },

    responsibilitiesHeading: {
      type: String,
      default: "Responsibilities",
      trim: true,
    },

    responsibilities: {
      type: [historyContentSchema],
      default: [],
    },

    closingContent: {
      type: [historyContentSchema],
      default: [],
    },

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

module.exports = mongoose.model(
  "History",
  historySchema
);