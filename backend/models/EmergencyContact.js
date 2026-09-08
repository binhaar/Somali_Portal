const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
      trim: true
    },

    name_so: {
      type: String,
      required: true,
      trim: true
    },

    description_en: {
      type: String,
      trim: true
    },

    description_so: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    alternative_phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    location_en: {
      type: String,
      trim: true
    },

    location_so: {
      type: String,
      trim: true
    },

    website_url: {
      type: String,
      trim: true
    },

    icon: {
      type: String,
      trim: true
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);

module.exports = EmergencyContact;