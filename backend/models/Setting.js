const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    portal_name_en: {
      type: String,
      required: true,
      trim: true,
    },

    portal_name_so: {
      type: String,
      required: true,
      trim: true,
    },

    portal_description_en: {
      type: String,
      trim: true,
    },

    portal_description_so: {
      type: String,
      trim: true,
    },

    logo_url: {
      type: String,
      trim: true,
    },

    favicon_url: {
      type: String,
      trim: true,
    },

    official_website: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address_en: {
      type: String,
      trim: true,
    },

    address_so: {
      type: String,
      trim: true,
    },

    facebook_url: {
      type: String,
      trim: true,
    },

    twitter_url: {
      type: String,
      trim: true,
    },

    youtube_url: {
      type: String,
      trim: true,
    },

    instagram_url: {
      type: String,
      trim: true,
    },

    default_language: {
      type: String,
      enum: ["en", "so"],
      default: "so",
    },

    maintenance_mode: {
      type: Boolean,
      default: false,
    },

    registration_enabled: {
      type: Boolean,
      default: true,
    },

    public_services_enabled: {
      type: Boolean,
      default: true,
    },

    notifications_enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;