const mongoose = require("mongoose");

const tourismItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
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
  { _id: true }
);

const tourismGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
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
  { _id: true }
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
      default: "Discover the beauty of Somalia",
      trim: true,
    },

    heroImage: {
      type: String,
      default: "",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Discover Somalia",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "Explore Somalia's coastline, heritage, landscapes and vibrant culture.",
      trim: true,
    },

    introductionTitle: {
      type: String,
      default: "Tourism in Somalia",
      trim: true,
    },

    introduction: {
      type: String,
      default: "",
      trim: true,
    },

    destinationsHeading: {
      type: String,
      default: "Explore Destinations",
      trim: true,
    },

    destinations: {
      type: [tourismItemSchema],
      default: [],
    },

    highlightsHeading: {
      type: String,
      default: "Experience Somalia",
      trim: true,
    },

    highlights: {
      type: [tourismItemSchema],
      default: [],
    },

    galleryHeading: {
      type: String,
      default: "Discover Somalia",
      trim: true,
    },

    gallery: {
      type: [tourismGallerySchema],
      default: [],
    },

    ctaTitle: {
      type: String,
      default: "Discover the Beauty of Somalia",
      trim: true,
    },

    ctaText: {
      type: String,
      default:
        "Explore the places, people and experiences that make Somalia unique.",
      trim: true,
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