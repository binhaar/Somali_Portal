const EmergencyContact = require("../models/EmergencyContact");


// CREATE
const createEmergencyContact = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      description_en,
      description_so,
      phone,
      alternative_phone,
      email,
      location_en,
      location_so,
      website_url,
      icon
    } = req.body;

    if (!name_en || !name_so || !phone) {
      return res.status(400).json({
        message: "English name, Somali name and phone are required"
      });
    }

    const contact = await EmergencyContact.create({
      name_en,
      name_so,
      description_en,
      description_so,
      phone,
      alternative_phone,
      email,
      location_en,
      location_so,
      website_url,
      icon
    });

    res.status(201).json({
      message: "Emergency contact created successfully",
      contact
    });
  } catch (error) {
    console.error(
      "CREATE EMERGENCY CONTACT ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while creating emergency contact",
      error: error.message
    });
  }
};


// GET PUBLIC CONTACTS
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      is_active: true
    }).sort({
      name_en: 1
    });

    res.status(200).json({
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error(
      "GET EMERGENCY CONTACTS ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching emergency contacts",
      error: error.message
    });
  }
};


// GET SINGLE CONTACT
const getSingleEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({
      _id: req.params.id,
      is_active: true
    });

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found"
      });
    }

    res.status(200).json({
      contact
    });
  } catch (error) {
    console.error(
      "GET SINGLE EMERGENCY CONTACT ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching emergency contact",
      error: error.message
    });
  }
};


// GET ALL FOR ADMIN
const getAllEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find().sort({
      name_en: 1
    });

    res.status(200).json({
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error(
      "GET ALL EMERGENCY CONTACTS ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching all emergency contacts",
      error: error.message
    });
  }
};


// UPDATE
const updateEmergencyContact = async (req, res) => {
  try {
    const contact =
      await EmergencyContact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found"
      });
    }

    res.status(200).json({
      message: "Emergency contact updated successfully",
      contact
    });
  } catch (error) {
    console.error(
      "UPDATE EMERGENCY CONTACT ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while updating emergency contact",
      error: error.message
    });
  }
};


// DELETE
const deleteEmergencyContact = async (req, res) => {
  try {
    const contact =
      await EmergencyContact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found"
      });
    }

    res.status(200).json({
      message: "Emergency contact deleted successfully"
    });
  } catch (error) {
    console.error(
      "DELETE EMERGENCY CONTACT ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while deleting emergency contact",
      error: error.message
    });
  }
};


// TOGGLE STATUS
const toggleEmergencyContactStatus = async (req, res) => {
  try {
    const contact =
      await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found"
      });
    }

    contact.is_active = !contact.is_active;

    await contact.save();

    res.status(200).json({
      message: "Emergency contact status updated successfully",
      contact
    });
  } catch (error) {
    console.error(
      "TOGGLE EMERGENCY CONTACT ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while changing emergency contact status",
      error: error.message
    });
  }
};


module.exports = {
  createEmergencyContact,
  getEmergencyContacts,
  getSingleEmergencyContact,
  getAllEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  toggleEmergencyContactStatus
};