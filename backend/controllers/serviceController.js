const Service = require("../models/Service");
const Category = require("../models/Category");
const Ministry = require("../models/Ministry");

// ==========================================
// URL VALIDATION
// ==========================================

const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
};

// ==========================================
// CREATE SERVICE
// ADMIN ONLY
// ==========================================

const createService = async (req, res) => {
  try {
    const {
      title_en,
      title_so,
      description_en,
      description_so,
      category,
      ministry,
      icon,
      external_url
    } = req.body;

    // Check required fields
    if (
      !title_en ||
      !title_so ||
      !category ||
      !ministry ||
      !external_url
    ) {
      return res.status(400).json({
        message:
          "title_en, title_so, category, ministry and external_url are required"
      });
    }

    // Validate URL
    if (!isValidUrl(external_url)) {
      return res.status(400).json({
        message: "external_url must be a valid HTTP or HTTPS URL"
      });
    }

    // Check category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    // Check ministry
    const ministryExists = await Ministry.findById(ministry);

    if (!ministryExists) {
      return res.status(404).json({
        message: "Ministry not found"
      });
    }

    // Create service
    const service = await Service.create({
      title_en: title_en.trim(),
      title_so: title_so.trim(),
      description_en: description_en?.trim(),
      description_so: description_so?.trim(),
      category,
      ministry,
      icon: icon?.trim(),
      external_url: external_url.trim(),
      is_active: true
    });

    // Populate category and ministry
    const populatedService = await Service.findById(service._id)
      .populate("category", "name_en name_so")
      .populate("ministry", "name_en name_so");

    res.status(201).json({
      message: "Service created successfully",
      data: populatedService
    });
  } catch (error) {
    console.error("Create service error:", error.message);

    res.status(500).json({
      message: "Failed to create service"
    });
  }
};

// ==========================================
// GET ACTIVE SERVICES
// PUBLIC
// PAGINATION
// ==========================================

const getServices = async (req, res) => {
  try {
    // Page
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    // Limit
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    // Calculate skip
    const skip = (page - 1) * limit;

    // Only active services
    const filter = {
      is_active: true
    };

    // Get services + total count
    const [services, totalServices] = await Promise.all([
      Service.find(filter)
        .populate("category", "name_en name_so")
        .populate("ministry", "name_en name_so")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Service.countDocuments(filter)
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(
      totalServices / limit
    );

    res.status(200).json({
      success: true,

      data: services,

      pagination: {
        currentPage: page,
        limit,
        totalServices,
        totalPages,

        hasNextPage: page < totalPages,

        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Get services error:", error.message);

    res.status(500).json({
      message: "Failed to get services"
    });
  }
};

// ==========================================
// GET SINGLE SERVICE
// PUBLIC
// ==========================================

const getSingleService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      is_active: true
    })
      .populate("category", "name_en name_so")
      .populate("ministry", "name_en name_so");

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error(
      "Get single service error:",
      error.message
    );

    res.status(400).json({
      message: "Invalid service ID"
    });
  }
};

// ==========================================
// GET ALL SERVICES
// ADMIN ONLY
// PAGINATION
// ==========================================

const getAllServices = async (req, res) => {
  try {
    // Page
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    // Limit
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get all services
    const [services, totalServices] = await Promise.all([
      Service.find()
        .populate("category", "name_en name_so")
        .populate("ministry", "name_en name_so")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Service.countDocuments()
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(
      totalServices / limit
    );

    res.status(200).json({
      success: true,

      data: services,

      pagination: {
        currentPage: page,
        limit,
        totalServices,
        totalPages,

        hasNextPage: page < totalPages,

        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error(
      "Get all services error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get all services"
    });
  }
};

// ==========================================
// UPDATE SERVICE
// ADMIN ONLY
// ==========================================

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const {
      title_en,
      title_so,
      description_en,
      description_so,
      category,
      ministry,
      icon,
      external_url,
      is_active
    } = req.body;

    // Validate URL if provided
    if (
      external_url !== undefined &&
      !isValidUrl(external_url)
    ) {
      return res.status(400).json({
        message:
          "external_url must be a valid HTTP or HTTPS URL"
      });
    }

    // Validate category if provided
    if (category !== undefined) {
      const categoryExists =
        await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      service.category = category;
    }

    // Validate ministry if provided
    if (ministry !== undefined) {
      const ministryExists =
        await Ministry.findById(ministry);

      if (!ministryExists) {
        return res.status(404).json({
          message: "Ministry not found"
        });
      }

      service.ministry = ministry;
    }

    // Update fields
    if (title_en !== undefined) {
      service.title_en = title_en.trim();
    }

    if (title_so !== undefined) {
      service.title_so = title_so.trim();
    }

    if (description_en !== undefined) {
      service.description_en =
        description_en?.trim();
    }

    if (description_so !== undefined) {
      service.description_so =
        description_so?.trim();
    }

    if (icon !== undefined) {
      service.icon = icon?.trim();
    }

    if (external_url !== undefined) {
      service.external_url =
        external_url.trim();
    }

    if (is_active !== undefined) {
      service.is_active = is_active;
    }

    await service.save();

    // Return populated service
    const updatedService =
      await Service.findById(service._id)
        .populate("category", "name_en name_so")
        .populate("ministry", "name_en name_so");

    res.status(200).json({
      message: "Service updated successfully",
      data: updatedService
    });
  } catch (error) {
    console.error(
      "Update service error:",
      error.message
    );

    res.status(400).json({
      message: "Invalid service ID"
    });
  }
};

// ==========================================
// DELETE SERVICE
// ADMIN ONLY
// ==========================================

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    await Service.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete service error:",
      error.message
    );

    res.status(400).json({
      message: "Invalid service ID"
    });
  }
};

// ==========================================
// TOGGLE SERVICE STATUS
// ADMIN ONLY
// ==========================================

const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    // Toggle status
    service.is_active = !service.is_active;

    await service.save();

    const updatedService =
      await Service.findById(service._id)
        .populate("category", "name_en name_so")
        .populate("ministry", "name_en name_so");

    res.status(200).json({
      message: service.is_active
        ? "Service activated successfully"
        : "Service deactivated successfully",

      data: updatedService
    });
  } catch (error) {
    console.error(
      "Toggle service status error:",
      error.message
    );

    res.status(400).json({
      message: "Invalid service ID"
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createService,
  getServices,
  getSingleService,
  getAllServices,
  updateService,
  deleteService,
  toggleServiceStatus
};