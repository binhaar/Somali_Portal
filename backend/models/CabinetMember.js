const mongoose = require("mongoose");

const cabinetMemberSchema = new mongoose.Schema(
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

    position_en: {
      type: String,
      required: true,
      trim: true
    },

    position_so: {
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

    photo: {
      type: String,
      trim: true
    },

    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministry"
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

const CabinetMember = mongoose.model(
  "CabinetMember",
  cabinetMemberSchema
);

module.exports = CabinetMember;