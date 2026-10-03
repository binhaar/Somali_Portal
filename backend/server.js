const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const ministryRoutes = require("./routes/ministryRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const provinceRoutes = require("./routes/provinceRoutes");
const cabinetRoutes = require("./routes/cabinetRoutes");
const newsRoutes = require("./routes/newsRoutes");
const eventRoutes = require("./routes/eventRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const searchRoutes = require("./routes/searchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const settingRoutes = require("./routes/settingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const historyRoutes = require("./routes/historyRoutes");
const tourismRoutes = require("./routes/tourismRoutes");

// =====================================================
// MODELS
// =====================================================

const PeopleCulture = require("./models/PeopleCulture");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://somali-portal.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Not allowed by CORS: ${origin}`)
      );
    },

    credentials: true,
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// EXISTING API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/services",
  serviceRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/ministries",
  ministryRoutes
);

app.use(
  "/api/agencies",
  agencyRoutes
);

app.use(
  "/api/provinces",
  provinceRoutes
);

app.use(
  "/api/cabinet",
  cabinetRoutes
);

app.use(
  "/api/news",
  newsRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/emergency-contacts",
  emergencyContactRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/settings",
  settingRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

// =====================================================
// HISTORY
// =====================================================

app.use(
  "/api/history",
  historyRoutes
);

// =====================================================
// TOURISM
// =====================================================

console.log("Loading Tourism routes...");

app.use(
  "/api/tourism",
  tourismRoutes
);

console.log(
  "TOURISM ROUTES REGISTERED"
);

// =====================================================
// PEOPLE & CULTURE
// DIRECT CRUD API
// =====================================================

// -----------------------------------------------------
// PUBLIC GET
// GET /api/people-culture?lang=en
// GET /api/people-culture?lang=so
// -----------------------------------------------------

app.get(
  "/api/people-culture",
  async (req, res) => {
    try {
      const language =
        req.query.lang === "so"
          ? "so"
          : "en";

      const content =
        await PeopleCulture.findOne({
          slug: "people-culture",
          status: "active",
        });

      if (!content) {
        return res.status(404).json({
          success: false,
          message:
            "People & Culture content not found",
        });
      }

      const data = {
        id: content._id,

        title:
          language === "so"
            ? content.titleSomali
            : content.titleEnglish,

        subtitle:
          language === "so"
            ? content.subtitleSomali
            : content.subtitleEnglish,

        slug: content.slug,

        heroImage: content.heroImage,

        introductionTitle:
          language === "so"
            ? content.introductionTitleSomali
            : content.introductionTitleEnglish,

        introduction:
          language === "so"
            ? content.introductionSomali
            : content.introductionEnglish,

        peopleHeading:
          language === "so"
            ? content.peopleHeadingSomali
            : content.peopleHeadingEnglish,

        people: (content.people || [])
          .filter(
            (item) =>
              item.status === "active"
          )
          .sort(
            (a, b) =>
              a.order - b.order
          )
          .map((item) => ({
            id: item._id,

            title:
              language === "so"
                ? item.titleSomali
                : item.titleEnglish,

            content:
              language === "so"
                ? item.contentSomali
                : item.contentEnglish,

            image: item.image,

            order: item.order,

            status: item.status,
          })),

        cultureHeading:
          language === "so"
            ? content.cultureHeadingSomali
            : content.cultureHeadingEnglish,

        culture: (content.culture || [])
          .filter(
            (item) =>
              item.status === "active"
          )
          .sort(
            (a, b) =>
              a.order - b.order
          )
          .map((item) => ({
            id: item._id,

            title:
              language === "so"
                ? item.titleSomali
                : item.titleEnglish,

            content:
              language === "so"
                ? item.contentSomali
                : item.contentEnglish,

            image: item.image,

            order: item.order,

            status: item.status,
          })),

        galleryHeading:
          language === "so"
            ? content.galleryHeadingSomali
            : content.galleryHeadingEnglish,

        gallery: (content.gallery || [])
          .filter(
            (item) =>
              item.status === "active"
          )
          .sort(
            (a, b) =>
              a.order - b.order
          )
          .map((item) => ({
            id: item._id,

            title:
              language === "so"
                ? item.titleSomali
                : item.titleEnglish,

            description:
              language === "so"
                ? item.descriptionSomali
                : item.descriptionEnglish,

            image: item.image,

            order: item.order,

            status: item.status,
          })),

        ctaTitle:
          language === "so"
            ? content.ctaTitleSomali
            : content.ctaTitleEnglish,

        ctaText:
          language === "so"
            ? content.ctaTextSomali
            : content.ctaTextEnglish,
      };

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "GET PEOPLE & CULTURE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load People & Culture",
        error: error.message,
      });
    }
  }
);

// -----------------------------------------------------
// ADMIN GET ALL
// GET /api/people-culture/admin/all
// -----------------------------------------------------

app.get(
  "/api/people-culture/admin/all",
  async (req, res) => {
    try {
      const content =
        await PeopleCulture.find()
          .sort({
            updatedAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: content.length,
        data: content,
      });
    } catch (error) {
      console.error(
        "GET ALL PEOPLE & CULTURE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load People & Culture records",
        error: error.message,
      });
    }
  }
);

// -----------------------------------------------------
// ADMIN GET ONE
// GET /api/people-culture/admin/:id
// -----------------------------------------------------

app.get(
  "/api/people-culture/admin/:id",
  async (req, res) => {
    try {
      const content =
        await PeopleCulture.findById(
          req.params.id
        );

      if (!content) {
        return res.status(404).json({
          success: false,
          message:
            "People & Culture record not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      console.error(
        "GET PEOPLE & CULTURE BY ID ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load People & Culture record",
        error: error.message,
      });
    }
  }
);

// -----------------------------------------------------
// ADMIN CREATE
// POST /api/people-culture/admin
// -----------------------------------------------------

app.post(
  "/api/people-culture/admin",
  async (req, res) => {
    try {
      console.log(
        "CREATE PEOPLE & CULTURE REQUEST"
      );

      const existing =
        await PeopleCulture.findOne({
          slug: "people-culture",
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "People & Culture content already exists. Please update the existing record.",
        });
      }

      const data = {
        ...req.body,
        slug: "people-culture",
      };

      const content =
        await PeopleCulture.create(data);

      return res.status(201).json({
        success: true,
        message:
          "People & Culture content created successfully",
        data: content,
      });
    } catch (error) {
      console.error(
        "CREATE PEOPLE & CULTURE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create People & Culture content",
        error: error.message,
      });
    }
  }
);

// -----------------------------------------------------
// ADMIN UPDATE
// PUT /api/people-culture/admin/:id
// -----------------------------------------------------

app.put(
  "/api/people-culture/admin/:id",
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        slug: "people-culture",
      };

      const content =
        await PeopleCulture.findByIdAndUpdate(
          req.params.id,
          data,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!content) {
        return res.status(404).json({
          success: false,
          message:
            "People & Culture record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "People & Culture content updated successfully",
        data: content,
      });
    } catch (error) {
      console.error(
        "UPDATE PEOPLE & CULTURE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update People & Culture content",
        error: error.message,
      });
    }
  }
);

// -----------------------------------------------------
// ADMIN DELETE
// DELETE /api/people-culture/admin/:id
// -----------------------------------------------------

app.delete(
  "/api/people-culture/admin/:id",
  async (req, res) => {
    try {
      const content =
        await PeopleCulture.findByIdAndDelete(
          req.params.id
        );

      if (!content) {
        return res.status(404).json({
          success: false,
          message:
            "People & Culture record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "People & Culture content deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE PEOPLE & CULTURE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete People & Culture content",
        error: error.message,
      });
    }
  }
);

// =====================================================
// TEST ROUTES
// =====================================================

app.get(
  "/api/people-culture-test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "People & Culture route is working",
    });
  }
);

app.get(
  "/api/tourism-test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Tourism route is working",
    });
  }
);

// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Somalia Government Portal API is running",
    });
  }
);

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      "========================================"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `API: http://localhost:${PORT}/api`
    );

    console.log(
      `People & Culture API: http://localhost:${PORT}/api/people-culture`
    );

    console.log(
      `People & Culture Admin: http://localhost:${PORT}/api/people-culture/admin/all`
    );

    console.log(
      `Tourism API: http://localhost:${PORT}/api/tourism`
    );

    console.log(
      "========================================"
    );
  }
);