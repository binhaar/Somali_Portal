const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // ACCOUNT TYPE
    // ==========================================
    accountType: {
      type: String,
      enum: ["CITIZEN", "VISITOR"],
      required: true
    },

    // ==========================================
    // ROLE
    // ==========================================
    role: {
      type: String,
      enum: ["CITIZEN", "VISITOR", "ADMIN"],
      required: true,
      default: "CITIZEN"
    },

    // ==========================================
    // BASIC INFORMATION
    // ==========================================
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    otherNames: {
      type: String,
      trim: true
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    placeOfBirth: {
      type: String,
      required: true,
      trim: true
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true
    },

    // ==========================================
    // IDENTIFICATION
    // ==========================================
    nationalIdNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    passportNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    nationality: {
      type: String,
      trim: true
    },

    // ==========================================
    // CONTACT
    // ==========================================
    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // ==========================================
    // PASSWORD
    // ==========================================
    password: {
      type: String,
      required: true,
      minlength: 8
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================
    isVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;