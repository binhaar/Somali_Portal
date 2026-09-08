const Category = require("../models/Category");

// ==========================================
// CREATE CATEGORY
// ==========================================
const createCategory = async (req, res) => {
  try {
    const {
      name_en,
      name_so,
      description_en,
      description_so,
      icon
    } = req.body;

    if (!name_en || !name_so) {
      return res.status(400).json({
        message: "English and Somali category names are required"
      });
    }

    const existingCategory = await Category.findOne({
      name_en: name_en.trim()
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name_en: name_en.trim(),
      name_so: name_so.trim(),
      description_en: description_en
        ? description_en.trim()
        : "",
      description_so: description_so
        ? description_so.trim()
        : "",
      icon: icon ? icon.trim() : "",
      is_active: true
    });

    return res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while creating category",
      error: error.message
    });
  }
};


// ==========================================
// GET ACTIVE CATEGORIES
// ==========================================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      is_active: true
    }).sort({
      name_en: 1
    });

    return res.status(200).json({
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while fetching categories",
      error: error.message
    });
  }
};


// ==========================================
// GET ALL CATEGORIES - ADMIN
// ==========================================
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error("GET ALL CATEGORIES ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while fetching all categories",
      error: error.message
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name_en,
      name_so,
      description_en,
      description_so,
      icon
    } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    category.name_en =
      name_en !== undefined
        ? name_en.trim()
        : category.name_en;

    category.name_so =
      name_so !== undefined
        ? name_so.trim()
        : category.name_so;

    category.description_en =
      description_en !== undefined
        ? description_en.trim()
        : category.description_en;

    category.description_so =
      description_so !== undefined
        ? description_so.trim()
        : category.description_so;

    category.icon =
      icon !== undefined
        ? icon.trim()
        : category.icon;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category
    });

  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while updating category",
      error: error.message
    });
  }
};


// ==========================================
// DELETE CATEGORY
// ==========================================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while deleting category",
      error: error.message
    });
  }
};


// ==========================================
// TOGGLE CATEGORY STATUS
// ==========================================
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    category.is_active = !category.is_active;

    await category.save();

    return res.status(200).json({
      message: category.is_active
        ? "Category activated successfully"
        : "Category deactivated successfully",

      category
    });

  } catch (error) {
    console.error("TOGGLE CATEGORY ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while changing category status",
      error: error.message
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
};