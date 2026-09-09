const ContactMessage = require("../models/ContactMessage");

const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      message,
    } = req.body;

    if (!name || !email || !department || !message) {
      return res.status(400).json({
        message:
          "Name, email, department and message are required.",
      });
    }

    const contactMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
        department: department.trim(),
        message: message.trim(),
      });

    return res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully.",
      data: contactMessage,
    });
  } catch (error) {
    console.error(
      "Create contact message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your message. Please try again.",
    });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const messages =
      await ContactMessage.find()
        .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(
      "Get contact messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve contact messages.",
    });
  }
};

const getContactMessage = async (req, res) => {
  try {
    const message =
      await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error(
      "Get contact message error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve contact message.",
    });
  }
};

const updateContactMessageStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "NEW",
      "READ",
      "REPLIED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid message status.",
      });
    }

    const message =
      await ContactMessage.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Contact message status updated successfully.",
      data: message,
    });
  } catch (error) {
    console.error(
      "Update contact message error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update contact message.",
    });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    const message =
      await ContactMessage.findByIdAndDelete(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete contact message error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to delete contact message.",
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateContactMessageStatus,
  deleteContactMessage,
};