const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    nameEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    nameSomali: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionSomali: {
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

    image: {
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
  { _id: true }
);

const highlightSchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    titleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionSomali: {
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
  { _id: true }
);

const gallerySchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    titleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    descriptionSomali: {
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
  { _id: true }
);

const tourismSchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      required: true,
      trim: true,
      default: "Tourism",
    },

    titleSomali: {
      type: String,
      required: true,
      trim: true,
      default: "Dalxiiska",
    },

    subtitleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    subtitleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    heroImage: {
      type: String,
      trim: true,
      default: "",
    },

    heroTitleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    heroTitleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    heroDescriptionEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    heroDescriptionSomali: {
      type: String,
      trim: true,
      default: "",
    },

    introductionTitleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    introductionTitleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    introductionEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    introductionSomali: {
      type: String,
      trim: true,
      default: "",
    },

    destinationsHeadingEnglish: {
      type: String,
      trim: true,
      default: "Popular Destinations",
    },

    destinationsHeadingSomali: {
      type: String,
      trim: true,
      default: "Goobaha Dalxiiska",
    },

    destinations: {
      type: [destinationSchema],
      default: [],
    },

    highlightsHeadingEnglish: {
      type: String,
      trim: true,
      default: "Tourism Highlights",
    },

    highlightsHeadingSomali: {
      type: String,
      trim: true,
      default: "Waxyaabaha Muhiimka ah ee Dalxiiska",
    },

    highlights: {
      type: [highlightSchema],
      default: [],
    },

    galleryHeadingEnglish: {
      type: String,
      trim: true,
      default: "Gallery",
    },

    galleryHeadingSomali: {
      type: String,
      trim: true,
      default: "Sawirrada Dalxiiska",
    },

    gallery: {
      type: [gallerySchema],
      default: [],
    },

    ctaTitleEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    ctaTitleSomali: {
      type: String,
      trim: true,
      default: "",
    },

    ctaTextEnglish: {
      type: String,
      trim: true,
      default: "",
    },

    ctaTextSomali: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default: "tourism",
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
  "Tourism",
  tourismSchema
);