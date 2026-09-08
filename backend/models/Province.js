const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema(
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

    capital_en: {
      type: String,
      trim: true
    },

    capital_so: {
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

const Province = mongoose.model("Province", provinceSchema);

module.exports = Province;