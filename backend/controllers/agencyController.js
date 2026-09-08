const Agency = require("../models/Agency");
const Ministry = require("../models/Ministry");

// ==========================================
// CREATE AGENCY
// ==========================================
const createAgency = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      description_en,
      description_so,
      logo,
      website_url,
      ministry
    } = req.body;

    if (!name_en || !name_so || !ministry) {
      return res.status(400).json({
        message: "Name English, Name Somali and Ministry are required"
      });
    }

    const ministryExists = await Ministry.findById(ministry);

    if (!ministryExists) {
      return res.status(404).json({
        message: "Ministry not found"
      });
    }

    const existingAgency = await Agency.findOne({
      name_en: name_en.trim()
    });

    if (existingAgency) {
      return res.status(409).json({
        message: "Agency already exists"
      });
    }

    const agency = await Agency.create({
      name_en: name_en.trim(),
      name_so: name_so.trim(),
      description_en: description_en?.trim() || "",
      description_so: description_so?.trim() || "",
      logo: logo?.trim() || "",
      website_url: website_url?.trim() || "",
      ministry,
      is_active: true
    });

    res.status(201).json({
      message: "Agency created successfully",
      agency
    });

  } catch (error) {
    console.error("CREATE AGENCY ERROR:", error.message);

    res.status(500).json({
      message: "Server error while creating agency"
    });
  }
};


// ==========================================
// GET ACTIVE AGENCIES
// ==========================================
const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({
      is_active: true
    })
      .populate("ministry", "name_en name_so")
      .sort({
        name_en: 1
      });

    res.status(200).json({
      count: agencies.length,
      agencies
    });

  } catch (error) {
    console.error("GET AGENCIES ERROR:", error.message);

    res.status(500).json({
      message: "Server error while fetching agencies"
    });
  }
};


// ==========================================
// GET ALL - ADMIN
// ==========================================
const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find()
      .populate("ministry", "name_en name_so")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      count: agencies.length,
      agencies
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching all agencies"
    });
  }
};


// ==========================================
// UPDATE
// ==========================================
const updateAgency = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agency.findById(id);

    if (!agency) {
      return res.status(404).json({
        message: "Agency not found"
      });
    }

    const {
      name_en,
      name_so,
      description_en,
      description_so,
      logo,
      website_url,
      ministry
    } = req.body;

    if (ministry !== undefined) {
      const ministryExists = await Ministry.findById(ministry);

      if (!ministryExists) {
        return res.status(404).json({
          message: "Ministry not found"
        });
      }

      agency.ministry = ministry;
    }

    if (name_en !== undefined)
      agency.name_en = name_en.trim();

    if (name_so !== undefined)
      agency.name_so = name_so.trim();

    if (description_en !== undefined)
      agency.description_en = description_en.trim();

    if (description_so !== undefined)
      agency.description_so = description_so.trim();

    if (logo !== undefined)
      agency.logo = logo.trim();

    if (website_url !== undefined)
      agency.website_url = website_url.trim();

    await agency.save();

    res.status(200).json({
      message: "Agency updated successfully",
      agency
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while updating agency"
    });
  }
};


// ==========================================
// DELETE
// ==========================================
const deleteAgency = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agency.findById(id);

    if (!agency) {
      return res.status(404).json({
        message: "Agency not found"
      });
    }

    await Agency.findByIdAndDelete(id);

    res.status(200).json({
      message: "Agency deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting agency"
    });
  }
};


// ==========================================
// TOGGLE STATUS
// ==========================================
const toggleAgencyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agency.findById(id);

    if (!agency) {
      return res.status(404).json({
        message: "Agency not found"
      });
    }

    agency.is_active = !agency.is_active;

    await agency.save();

    res.status(200).json({
      message: agency.is_active
        ? "Agency activated successfully"
        : "Agency deactivated successfully",
      agency
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while changing agency status"
    });
  }
};


module.exports = {
  createAgency,
  getAgencies,
  getAllAgencies,
  updateAgency,
  deleteAgency,
  toggleAgencyStatus
};