const Tourism = require("../models/Tourism");

const cleanItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => ({
      title: (item.title || "").trim(),
      description: (item.description || "").trim(),
      image: (item.image || "").trim(),
      location: (item.location || "").trim(),
      category: (item.category || "").trim(),
      featured: Boolean(item.featured),
      order: index,
      status: item.status || "active",
    }))
    .filter((item) => item.title);
};

const cleanGallery = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => ({
      title: (item.title || "").trim(),
      description: (item.description || "").trim(),
      image: (item.image || "").trim(),
      order: index,
      status: item.status || "active",
    }))
    .filter((item) => item.image);
};

const shapePublic = (tourism) => {
  if (!tourism) return null;

  tourism.destinations = (tourism.destinations || [])
    .filter((item) => item.status === "active")
    .sort((a, b) => a.order - b.order);

  tourism.highlights = (tourism.highlights || [])
    .filter((item) => item.status === "active")
    .sort((a, b) => a.order - b.order);

  tourism.gallery = (tourism.gallery || [])
    .filter((item) => item.status === "active")
    .sort((a, b) => a.order - b.order);

  return tourism;
};

// PUBLIC
const getTourism = async (req, res) => {
  try {
    const tourism = await Tourism.findOne({
      slug: "tourism",
      status: "active",
    }).lean();

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: shapePublic(tourism),
    });
  } catch (error) {
    console.error("Get Tourism Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Tourism page.",
    });
  }
};

// ADMIN - GET ALL
const getAllTourism = async (req, res) => {
  try {
    const records = await Tourism.find().sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Get All Tourism Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Tourism records.",
    });
  }
};

// ADMIN - GET ONE
const getTourismById = async (req, res) => {
  try {
    const tourism = await Tourism.findById(req.params.id);

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tourism,
    });
  } catch (error) {
    console.error("Get Tourism By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Tourism record.",
    });
  }
};

const buildPayload = (body) => ({
  title: (body.title || "Tourism").trim(),

  slug: "tourism",

  subtitle: (body.subtitle || "").trim(),

  heroImage: (body.heroImage || "").trim(),

  heroTitle: (body.heroTitle || "Discover Somalia").trim(),

  heroDescription: (body.heroDescription || "").trim(),

  introductionTitle:
    (body.introductionTitle || "Tourism in Somalia").trim(),

  introduction: (body.introduction || "").trim(),

  destinationsHeading:
    (body.destinationsHeading || "Explore Destinations").trim(),

  destinations: cleanItems(body.destinations),

  highlightsHeading:
    (body.highlightsHeading || "Experience Somalia").trim(),

  highlights: cleanItems(body.highlights),

  galleryHeading:
    (body.galleryHeading || "Discover Somalia").trim(),

  gallery: cleanGallery(body.gallery),

  ctaTitle:
    (body.ctaTitle || "Discover the Beauty of Somalia").trim(),

  ctaText: (body.ctaText || "").trim(),

  status: body.status || "active",
});

// ADMIN - CREATE
const createTourism = async (req, res) => {
  try {
    const existing = await Tourism.findOne({
      slug: "tourism",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Tourism page already exists. Please edit the existing page.",
      });
    }

    const tourism = await Tourism.create(
      buildPayload(req.body)
    );

    return res.status(201).json({
      success: true,
      message: "Tourism page created successfully.",
      data: tourism,
    });
  } catch (error) {
    console.error("Create Tourism Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Tourism page.",
    });
  }
};

// ADMIN - UPDATE
const updateTourism = async (req, res) => {
  try {
    const tourism = await Tourism.findById(req.params.id);

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism record not found.",
      });
    }

    Object.assign(
      tourism,
      buildPayload(req.body)
    );

    tourism.slug = "tourism";

    await tourism.save();

    return res.status(200).json({
      success: true,
      message: "Tourism page updated successfully.",
      data: tourism,
    });
  } catch (error) {
    console.error("Update Tourism Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Tourism page.",
    });
  }
};

// ADMIN - DELETE
const deleteTourism = async (req, res) => {
  try {
    const tourism =
      await Tourism.findByIdAndDelete(req.params.id);

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tourism page deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Tourism Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Tourism page.",
    });
  }
};

module.exports = {
  getTourism,
  getAllTourism,
  getTourismById,
  createTourism,
  updateTourism,
  deleteTourism,
};