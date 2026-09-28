const mongoose = require("mongoose");

const tourismItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
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

const tourismGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
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

const tourismSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Tourism",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "tourism",
    },

    subtitle: {
      type: String,
      trim: true,
      default: "Discover the beauty of Somalia",
    },

    heroImage: {
      type: String,
      trim: true,
      default: "",
    },

    heroTitle: {
      type: String,
      trim: true,
      default: "",
    },

    heroDescription: {
      type: String,
      trim: true,
      default: "",
    },

    introductionTitle: {
      type: String,
      trim: true,
      default: "Discover Somalia",
    },

    introduction: {
      type: String,
      trim: true,
      default: "",
    },

    destinationsHeading: {
      type: String,
      trim: true,
      default: "Popular Destinations",
    },

    destinations: {
      type: [tourismItemSchema],
      default: [],
    },

    highlightsHeading: {
      type: String,
      trim: true,
      default: "Tourism Highlights",
    },

    highlights: {
      type: [tourismItemSchema],
      default: [],
    },

    galleryHeading: {
      type: String,
      trim: true,
      default: "Gallery",
    },

    gallery: {
      type: [tourismGallerySchema],
      default: [],
    },

    ctaTitle: {
      type: String,
      trim: true,
      default: "",
    },

    ctaText: {
      type: String,
      trim: true,
      default: "",
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

module.exports = mongoose.model("Tourism", tourismSchema);