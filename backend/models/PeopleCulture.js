const mongoose = require("mongoose");

/* =====================================================
   PEOPLE CONTENT
===================================================== */

const peopleSchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      trim: true,
    },

    titleSomali: {
      type: String,
      trim: true,
    },

    contentEnglish: {
      type: String,
      trim: true,
    },

    contentSomali: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
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
  {
    _id: true,
  }
);

/* =====================================================
   CULTURE CONTENT
===================================================== */

const cultureSchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      trim: true,
    },

    titleSomali: {
      type: String,
      trim: true,
    },

    contentEnglish: {
      type: String,
      trim: true,
    },

    contentSomali: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
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
  {
    _id: true,
  }
);

/* =====================================================
   GALLERY
===================================================== */

const gallerySchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      trim: true,
    },

    titleSomali: {
      type: String,
      trim: true,
    },

    descriptionEnglish: {
      type: String,
      trim: true,
    },

    descriptionSomali: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
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
  {
    _id: true,
  }
);

/* =====================================================
   PEOPLE & CULTURE
===================================================== */

const peopleCultureSchema = new mongoose.Schema(
  {
    titleEnglish: {
      type: String,
      required: true,
      trim: true,
      default: "People & Culture",
    },

    titleSomali: {
      type: String,
      required: true,
      trim: true,
      default: "Dadka & Dhaqanka",
    },

    subtitleEnglish: {
      type: String,
      trim: true,
    },

    subtitleSomali: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "people-culture",
    },

    heroImage: {
      type: String,
      trim: true,
    },

    /* =================================================
       INTRODUCTION
    ================================================= */

    introductionTitleEnglish: {
      type: String,
      trim: true,
    },

    introductionTitleSomali: {
      type: String,
      trim: true,
    },

    introductionEnglish: {
      type: String,
      trim: true,
    },

    introductionSomali: {
      type: String,
      trim: true,
    },

    /* =================================================
       PEOPLE
    ================================================= */

    peopleHeadingEnglish: {
      type: String,
      trim: true,
    },

    peopleHeadingSomali: {
      type: String,
      trim: true,
    },

    people: {
      type: [peopleSchema],
      default: [],
    },

    /* =================================================
       CULTURE
    ================================================= */

    cultureHeadingEnglish: {
      type: String,
      trim: true,
    },

    cultureHeadingSomali: {
      type: String,
      trim: true,
    },

    culture: {
      type: [cultureSchema],
      default: [],
    },

    /* =================================================
       GALLERY
    ================================================= */

    galleryHeadingEnglish: {
      type: String,
      trim: true,
    },

    galleryHeadingSomali: {
      type: String,
      trim: true,
    },

    gallery: {
      type: [gallerySchema],
      default: [],
    },

    /* =================================================
       CTA
    ================================================= */

    ctaTitleEnglish: {
      type: String,
      trim: true,
    },

    ctaTitleSomali: {
      type: String,
      trim: true,
    },

    ctaTextEnglish: {
      type: String,
      trim: true,
    },

    ctaTextSomali: {
      type: String,
      trim: true,
    },

    /* =================================================
       STATUS
    ================================================= */

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
  "PeopleCulture",
  peopleCultureSchema
);