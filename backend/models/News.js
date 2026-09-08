const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
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

    content_en: {
      type: String,
      required: true,
      trim: true
    },

    content_so: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      trim: true
    },

    author: {
      type: String,
      trim: true
    },

    publishedAt: {
      type: Date,
      default: Date.now
    },

    is_published: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;