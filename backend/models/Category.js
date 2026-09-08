const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;