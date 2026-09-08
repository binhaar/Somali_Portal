const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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

    description_en: {
      type: String,
      trim: true
    },

    description_so: {
      type: String,
      trim: true
    },

    location_en: {
      type: String,
      trim: true
    },

    location_so: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    organizer: {
      type: String,
      trim: true
    },

    external_url: {
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

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;