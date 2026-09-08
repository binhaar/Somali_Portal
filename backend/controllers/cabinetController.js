const CabinetMember = require("../models/CabinetMember");
const Ministry = require("../models/Ministry");

// ==========================================
// CREATE CABINET MEMBER
// ==========================================
const createCabinetMember = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      position_en,
      position_so,
      description_en,
      description_so,
      photo,
      ministry
    } = req.body;

    if (
      !name_en ||
      !name_so ||
      !position_en ||
      !position_so
    ) {
      return res.status(400).json({
        message:
          "Name and position in English and Somali are required"
      });
    }

    if (ministry) {
      const ministryExists = await Ministry.findById(ministry);

      if (!ministryExists) {
        return res.status(404).json({
          message: "Ministry not found"
        });
      }
    }

    const member = await CabinetMember.create({
      name_en: name_en.trim(),
      name_so: name_so.trim(),
      position_en: position_en.trim(),
      position_so: position_so.trim(),
      description_en: description_en?.trim() || "",
      description_so: description_so?.trim() || "",
      photo: photo?.trim() || "",
      ministry: ministry || undefined,
      is_active: true
    });

    return res.status(201).json({
      message: "Cabinet member created successfully",
      member
    });

  } catch (error) {
    console.error("CREATE CABINET ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while creating cabinet member"
    });
  }
};


// ==========================================
// GET ACTIVE CABINET
// ==========================================
const getCabinetMembers = async (req, res) => {
  try {
    const members = await CabinetMember.find({
      is_active: true
    })
      .populate("ministry", "name_en name_so")
      .sort({
        position_en: 1
      });

    return res.status(200).json({
      count: members.length,
      members
    });

  } catch (error) {
    console.error("GET CABINET ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while fetching cabinet members"
    });
  }
};


// ==========================================
// GET ALL - ADMIN
// ==========================================
const getAllCabinetMembers = async (req, res) => {
  try {
    const members = await CabinetMember.find()
      .populate("ministry", "name_en name_so")
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      count: members.length,
      members
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching all cabinet members"
    });
  }
};


// ==========================================
// UPDATE
// ==========================================
const updateCabinetMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CabinetMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Cabinet member not found"
      });
    }

    const {
      name_en,
      name_so,
      position_en,
      position_so,
      description_en,
      description_so,
      photo,
      ministry
    } = req.body;

    if (ministry !== undefined) {
      if (ministry) {
        const ministryExists = await Ministry.findById(ministry);

        if (!ministryExists) {
          return res.status(404).json({
            message: "Ministry not found"
          });
        }
      }

      member.ministry = ministry || undefined;
    }

    if (name_en !== undefined)
      member.name_en = name_en.trim();

    if (name_so !== undefined)
      member.name_so = name_so.trim();

    if (position_en !== undefined)
      member.position_en = position_en.trim();

    if (position_so !== undefined)
      member.position_so = position_so.trim();

    if (description_en !== undefined)
      member.description_en = description_en.trim();

    if (description_so !== undefined)
      member.description_so = description_so.trim();

    if (photo !== undefined)
      member.photo = photo.trim();

    await member.save();

    return res.status(200).json({
      message: "Cabinet member updated successfully",
      member
    });

  } catch (error) {
    console.error("UPDATE CABINET ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while updating cabinet member"
    });
  }
};


// ==========================================
// DELETE
// ==========================================
const deleteCabinetMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CabinetMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Cabinet member not found"
      });
    }

    await CabinetMember.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Cabinet member deleted successfully"
    });

  } catch (error) {
    console.error("DELETE CABINET ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while deleting cabinet member"
    });
  }
};


// ==========================================
// TOGGLE STATUS
// ==========================================
const toggleCabinetMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CabinetMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Cabinet member not found"
      });
    }

    member.is_active = !member.is_active;

    await member.save();

    return res.status(200).json({
      message: member.is_active
        ? "Cabinet member activated successfully"
        : "Cabinet member deactivated successfully",
      member
    });

  } catch (error) {
    console.error("TOGGLE CABINET ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while changing cabinet status"
    });
  }
};


module.exports = {
  createCabinetMember,
  getCabinetMembers,
  getAllCabinetMembers,
  updateCabinetMember,
  deleteCabinetMember,
  toggleCabinetMemberStatus
};