const PeopleCulture = require("../models/PeopleCulture");

/* =========================================================
   GET PUBLIC PEOPLE & CULTURE
   GET /api/people-culture
   GET /api/people-culture?lang=en
   GET /api/people-culture?lang=so
========================================================= */

const getPeopleCulture = async (req, res) => {
  try {
    const language = req.query.lang === "so" ? "so" : "en";

    const content = await PeopleCulture.findOne({
      slug: "people-culture",
      status: "active",
    }).lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "People & Culture content not found",
      });
    }

    const isSomali = language === "so";

    const data = {
      id: content._id,
      slug: content.slug,

      /* =====================================================
         BASIC
      ===================================================== */

      title: isSomali
        ? content.titleSomali
        : content.titleEnglish,

      subtitle: isSomali
        ? content.subtitleSomali
        : content.subtitleEnglish,

      heroImage: content.heroImage,

      /* =====================================================
         INTRODUCTION
      ===================================================== */

      introductionTitle: isSomali
        ? content.introductionTitleSomali
        : content.introductionTitleEnglish,

      introduction: isSomali
        ? content.introductionSomali
        : content.introductionEnglish,

      /* =====================================================
         PEOPLE
      ===================================================== */

      peopleHeading: isSomali
        ? content.peopleHeadingSomali
        : content.peopleHeadingEnglish,

      people: (content.people || [])
        .filter((item) => item.status === "active")
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          id: item._id,

          title: isSomali
            ? item.titleSomali
            : item.titleEnglish,

          content: isSomali
            ? item.contentSomali
            : item.contentEnglish,

          image: item.image,

          order: item.order,
        })),

      /* =====================================================
         CULTURE
      ===================================================== */

      cultureHeading: isSomali
        ? content.cultureHeadingSomali
        : content.cultureHeadingEnglish,

      culture: (content.culture || [])
        .filter((item) => item.status === "active")
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          id: item._id,

          title: isSomali
            ? item.titleSomali
            : item.titleEnglish,

          content: isSomali
            ? item.contentSomali
            : item.contentEnglish,

          image: item.image,

          order: item.order,
        })),

      /* =====================================================
         GALLERY
      ===================================================== */

      galleryHeading: isSomali
        ? content.galleryHeadingSomali
        : content.galleryHeadingEnglish,

      gallery: (content.gallery || [])
        .filter((item) => item.status === "active")
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          id: item._id,

          title: isSomali
            ? item.titleSomali
            : item.titleEnglish,

          description: isSomali
            ? item.descriptionSomali
            : item.descriptionEnglish,

          image: item.image,

          order: item.order,
        })),

      /* =====================================================
         CTA
      ===================================================== */

      ctaTitle: isSomali
        ? content.ctaTitleSomali
        : content.ctaTitleEnglish,

      ctaText: isSomali
        ? content.ctaTextSomali
        : content.ctaTextEnglish,
    };

    return res.status(200).json({
      success: true,
      language,
      data,
    });
  } catch (error) {
    console.error(
      "Get People & Culture error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while loading People & Culture",
      error: error.message,
    });
  }
};


/* =========================================================
   GET ALL
   GET /api/people-culture/admin/all
========================================================= */

const getAllPeopleCulture = async (req, res) => {
  try {
    const content = await PeopleCulture.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error(
      "Get all People & Culture error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while loading People & Culture",
      error: error.message,
    });
  }
};


/* =========================================================
   GET BY ID
   GET /api/people-culture/admin/:id
========================================================= */

const getPeopleCultureById = async (req, res) => {
  try {
    const content =
      await PeopleCulture.findById(req.params.id).lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message:
          "People & Culture content not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error(
      "Get People & Culture by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* =========================================================
   CREATE
   POST /api/people-culture/admin
========================================================= */

const createPeopleCulture = async (req, res) => {
  try {
    const existing = await PeopleCulture.findOne({
      slug: "people-culture",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "People & Culture already exists. Please update the existing record.",
      });
    }

    const content = await PeopleCulture.create({
      ...req.body,
      slug: "people-culture",
    });

    return res.status(201).json({
      success: true,
      message:
        "People & Culture created successfully",
      data: content,
    });
  } catch (error) {
    console.error(
      "Create People & Culture error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating People & Culture",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE
   PUT /api/people-culture/admin/:id
========================================================= */

const updatePeopleCulture = async (req, res) => {
  try {
    const content =
      await PeopleCulture.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          slug: "people-culture",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!content) {
      return res.status(404).json({
        success: false,
        message:
          "People & Culture content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "People & Culture updated successfully",
      data: content,
    });
  } catch (error) {
    console.error(
      "Update People & Culture error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating People & Culture",
      error: error.message,
    });
  }
};


/* =========================================================
   DELETE
   DELETE /api/people-culture/admin/:id
========================================================= */

const deletePeopleCulture = async (req, res) => {
  try {
    const content =
      await PeopleCulture.findByIdAndDelete(
        req.params.id
      );

    if (!content) {
      return res.status(404).json({
        success: false,
        message:
          "People & Culture content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "People & Culture deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete People & Culture error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting People & Culture",
      error: error.message,
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getPeopleCulture,
  getAllPeopleCulture,
  getPeopleCultureById,
  createPeopleCulture,
  updatePeopleCulture,
  deletePeopleCulture,
};