const Tourism = require("../models/Tourism");

// =====================================================
// ADMIN - GET ALL
// =====================================================

const getAllTourism = async (req, res) => {
  try {
    const records = await Tourism.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("GET ALL TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tourism information.",
    });
  }
};

// =====================================================
// ADMIN - GET ONE
// =====================================================

const getTourismById = async (req, res) => {
  try {
    const tourism = await Tourism.findById(
      req.params.id
    ).lean();

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tourism,
    });
  } catch (error) {
    console.error("GET TOURISM BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tourism information.",
    });
  }
};

// =====================================================
// PUBLIC
// GET /api/tourism?lang=en
// GET /api/tourism?lang=so
// =====================================================

const getTourism = async (req, res) => {
  try {
    const language =
      req.query.lang === "so" ? "so" : "en";

    const tourism = await Tourism.findOne({
      slug: "tourism",
      status: "active",
    }).lean();

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message: "Tourism information not found.",
      });
    }

    const isSomali = language === "so";

    const data = {
      _id: tourism._id,

      title: isSomali
        ? tourism.titleSomali
        : tourism.titleEnglish,

      subtitle: isSomali
        ? tourism.subtitleSomali
        : tourism.subtitleEnglish,

      heroImage: tourism.heroImage,

      heroTitle: isSomali
        ? tourism.heroTitleSomali
        : tourism.heroTitleEnglish,

      heroDescription: isSomali
        ? tourism.heroDescriptionSomali
        : tourism.heroDescriptionEnglish,

      introductionTitle: isSomali
        ? tourism.introductionTitleSomali
        : tourism.introductionTitleEnglish,

      introduction: isSomali
        ? tourism.introductionSomali
        : tourism.introductionEnglish,

      destinationsHeading: isSomali
        ? tourism.destinationsHeadingSomali
        : tourism.destinationsHeadingEnglish,

      destinations: (tourism.destinations || [])
        .filter(
          (item) =>
            item.status === "active"
        )
        .sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
        .map((item) => ({
          _id: item._id,

          title: isSomali
            ? item.nameSomali
            : item.nameEnglish,

          description: isSomali
            ? item.descriptionSomali
            : item.descriptionEnglish,

          location: item.location,
          category: item.category,
          image: item.image,
          featured: item.featured,
          order: item.order,
        })),

      highlightsHeading: isSomali
        ? tourism.highlightsHeadingSomali
        : tourism.highlightsHeadingEnglish,

      highlights: (tourism.highlights || [])
        .filter(
          (item) =>
            item.status === "active"
        )
        .sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
        .map((item) => ({
          _id: item._id,

          title: isSomali
            ? item.titleSomali
            : item.titleEnglish,

          description: isSomali
            ? item.descriptionSomali
            : item.descriptionEnglish,

          image: item.image,
          order: item.order,
        })),

      galleryHeading: isSomali
        ? tourism.galleryHeadingSomali
        : tourism.galleryHeadingEnglish,

      gallery: (tourism.gallery || [])
        .filter(
          (item) =>
            item.status === "active"
        )
        .sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
        .map((item) => ({
          _id: item._id,

          title: isSomali
            ? item.titleSomali
            : item.titleEnglish,

          description: isSomali
            ? item.descriptionSomali
            : item.descriptionEnglish,

          image: item.image,
          order: item.order,
        })),

      ctaTitle: isSomali
        ? tourism.ctaTitleSomali
        : tourism.ctaTitleEnglish,

      ctaText: isSomali
        ? tourism.ctaTextSomali
        : tourism.ctaTextEnglish,
    };

    return res.status(200).json({
      success: true,
      language,
      data,
    });
  } catch (error) {
    console.error("GET TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to load tourism information.",
    });
  }
};

// =====================================================
// CREATE
// =====================================================

const createTourism = async (req, res) => {
  try {
    const existing = await Tourism.findOne({
      slug: "tourism",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Tourism information already exists. Update the existing record.",
      });
    }

    const tourism = await Tourism.create({
      ...req.body,
      slug: "tourism",
    });

    return res.status(201).json({
      success: true,
      message:
        "Tourism information created successfully.",
      data: tourism,
    });
  } catch (error) {
    console.error("CREATE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to create tourism information.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE
// =====================================================

const updateTourism = async (req, res) => {
  try {
    const tourism = await Tourism.findById(
      req.params.id
    );

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message:
          "Tourism information not found.",
      });
    }

    Object.assign(tourism, {
      ...req.body,
      slug: "tourism",
    });

    await tourism.save();

    return res.status(200).json({
      success: true,
      message:
        "Tourism information updated successfully.",
      data: tourism,
    });
  } catch (error) {
    console.error("UPDATE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update tourism information.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE
// =====================================================

const deleteTourism = async (req, res) => {
  try {
    const tourism =
      await Tourism.findByIdAndDelete(
        req.params.id
      );

    if (!tourism) {
      return res.status(404).json({
        success: false,
        message:
          "Tourism information not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Tourism information deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE TOURISM ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete tourism information.",
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