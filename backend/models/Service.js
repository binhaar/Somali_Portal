const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // ==========================================
    // SERVICE NAME
    // ==========================================
    title_en: {
      type: String,
      required: true,
      trim: true
    },

    title_so: {
      type: String,
      required: true,
      trim: true
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================
    description_en: {
      type: String,
      trim: true
    },

    description_so: {
      type: String,
      trim: true
    },

    // ==========================================
    // CATEGORY
    // ==========================================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    // ==========================================
    // MINISTRY / INSTITUTION
    // ==========================================
    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministry",
      required: true
    },

    // ==========================================
    // ICON
    // ==========================================
    icon: {
      type: String,
      trim: true
    },

    // ==========================================
    // EXTERNAL SERVICE WEBSITE
    // ==========================================
    external_url: {
      type: String,
      required: true,
      trim: true
    },

    // ==========================================
    // STATUS
    // ==========================================
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;