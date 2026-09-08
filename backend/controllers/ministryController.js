const Ministry = require("../models/Ministry");

// CREATE
const createMinistry = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      description_en,
      description_so,
      logo,
      website_url
    } = req.body;

    if (!name_en || !name_so) {
      return res.status(400).json({
        message: "English and Somali names are required"
      });
    }

    const existing = await Ministry.findOne({
      name_en: name_en.trim()
    });

    if (existing) {
      return res.status(409).json({
        message: "Ministry already exists"
      });
    }

    const ministry = await Ministry.create({
      name_en: name_en.trim(),
      name_so: name_so.trim(),
      description_en: description_en?.trim() || "",
      description_so: description_so?.trim() || "",
      logo: logo?.trim() || "",
      website_url: website_url?.trim() || "",
      is_active: true
    });

    res.status(201).json({
      message: "Ministry created successfully",
      ministry
    });

  } catch (error) {
    console.error("CREATE MINISTRY ERROR:", error.message);

    res.status(500).json({
      message: "Server error while creating ministry"
    });
  }
};


// GET ACTIVE
const getMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.find({
      is_active: true
    }).sort({
      name_en: 1
    });

    res.status(200).json({
      count: ministries.length,
      ministries
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching ministries"
    });
  }
};


// GET ALL - ADMIN
const getAllMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: ministries.length,
      ministries
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching ministries"
    });
  }
};


// UPDATE
const updateMinistry = async (req, res) => {
  try {
    const { id } = req.params;

    const ministry = await Ministry.findById(id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found"
      });
    }

    const {
      name_en,
      name_so,
      description_en,
      description_so,
      logo,
      website_url
    } = req.body;

    if (name_en !== undefined) ministry.name_en = name_en.trim();
    if (name_so !== undefined) ministry.name_so = name_so.trim();
    if (description_en !== undefined)
      ministry.description_en = description_en.trim();
    if (description_so !== undefined)
      ministry.description_so = description_so.trim();
    if (logo !== undefined)
      ministry.logo = logo.trim();
    if (website_url !== undefined)
      ministry.website_url = website_url.trim();

    await ministry.save();

    res.status(200).json({
      message: "Ministry updated successfully",
      ministry
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while updating ministry"
    });
  }
};


// DELETE
const deleteMinistry = async (req, res) => {
  try {
    const { id } = req.params;

    const ministry = await Ministry.findById(id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found"
      });
    }

    await Ministry.findByIdAndDelete(id);

    res.status(200).json({
      message: "Ministry deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting ministry"
    });
  }
};


// TOGGLE
const toggleMinistryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const ministry = await Ministry.findById(id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found"
      });
    }

    ministry.is_active = !ministry.is_active;

    await ministry.save();

    res.status(200).json({
      message: ministry.is_active
        ? "Ministry activated successfully"
        : "Ministry deactivated successfully",
      ministry
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while changing ministry status"
    });
  }
};


module.exports = {
  createMinistry,
  getMinistries,
  getAllMinistries,
  updateMinistry,
  deleteMinistry,
  toggleMinistryStatus
};