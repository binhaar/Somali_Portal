const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
      unique: true,
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

    logo: {
      type: String,
      trim: true
    },

    website_url: {
      type: String,
      trim: true
    },

    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministry",
      required: true
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

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;