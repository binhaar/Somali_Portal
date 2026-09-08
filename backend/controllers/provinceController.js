const Province = require("../models/Province");

// ==========================================
// CREATE PROVINCE
// ==========================================
const createProvince = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      description_en,
      description_so,
      capital_en,
      capital_so
    } = req.body;

    if (!name_en || !name_so) {
      return res.status(400).json({
        message: "English and Somali names are required"
      });
    }

    const existingProvince = await Province.findOne({
      name_en: name_en.trim()
    });

    if (existingProvince) {
      return res.status(409).json({
        message: "Province already exists"
      });
    }

    const province = await Province.create({
      name_en: name_en.trim(),
      name_so: name_so.trim(),
      description_en: description_en?.trim() || "",
      description_so: description_so?.trim() || "",
      capital_en: capital_en?.trim() || "",
      capital_so: capital_so?.trim() || "",
      is_active: true
    });

    return res.status(201).json({
      message: "Province created successfully",
      province
    });

  } catch (error) {
    console.error("CREATE PROVINCE ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while creating province"
    });
  }
};


// ==========================================
// GET ACTIVE PROVINCES
// ==========================================
const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find({
      is_active: true
    }).sort({
      name_en: 1
    });

    return res.status(200).json({
      count: provinces.length,
      provinces
    });

  } catch (error) {
    console.error("GET PROVINCES ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while fetching provinces"
    });
  }
};


// ==========================================
// GET ALL - ADMIN
// ==========================================
const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find()
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      count: provinces.length,
      provinces
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching all provinces"
    });
  }
};


// ==========================================
// UPDATE
// ==========================================
const updateProvince = async (req, res) => {
  try {
    const { id } = req.params;

    const province = await Province.findById(id);

    if (!province) {
      return res.status(404).json({
        message: "Province not found"
      });
    }

    const {
      name_en,
      name_so,
      description_en,
      description_so,
      capital_en,
      capital_so
    } = req.body;

    if (name_en !== undefined)
      province.name_en = name_en.trim();

    if (name_so !== undefined)
      province.name_so = name_so.trim();

    if (description_en !== undefined)
      province.description_en = description_en.trim();

    if (description_so !== undefined)
      province.description_so = description_so.trim();

    if (capital_en !== undefined)
      province.capital_en = capital_en.trim();

    if (capital_so !== undefined)
      province.capital_so = capital_so.trim();

    await province.save();

    return res.status(200).json({
      message: "Province updated successfully",
      province
    });

  } catch (error) {
    console.error("UPDATE PROVINCE ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while updating province"
    });
  }
};


// ==========================================
// DELETE
// ==========================================
const deleteProvince = async (req, res) => {
  try {
    const { id } = req.params;

    const province = await Province.findById(id);

    if (!province) {
      return res.status(404).json({
        message: "Province not found"
      });
    }

    await Province.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Province deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PROVINCE ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while deleting province"
    });
  }
};


// ==========================================
// TOGGLE STATUS
// ==========================================
const toggleProvinceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const province = await Province.findById(id);

    if (!province) {
      return res.status(404).json({
        message: "Province not found"
      });
    }

    province.is_active = !province.is_active;

    await province.save();

    return res.status(200).json({
      message: province.is_active
        ? "Province activated successfully"
        : "Province deactivated successfully",

      province
    });

  } catch (error) {
    console.error("TOGGLE PROVINCE ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while changing province status"
    });
  }
};


module.exports = {
  createProvince,
  getProvinces,
  getAllProvinces,
  updateProvince,
  deleteProvince,
  toggleProvinceStatus
};