const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED", "CLOSED"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

module.exports = ContactMessage;