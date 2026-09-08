const Setting = require("../models/Setting");


// =========================
// GET SETTINGS
// =========================

const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        portal_name_en: "Somalia Government Portal",
        portal_name_so: "Bogga Dowladda Soomaaliya",
        portal_description_en:
          "Official Somalia Government Portal",
        portal_description_so:
          "Bogga rasmiga ah ee Dowladda Soomaaliya",
        default_language: "so",
        maintenance_mode: false,
        registration_enabled: true,
        public_services_enabled: true,
        notifications_enabled: true,
      });
    }

    res.status(200).json({
      message: "Settings fetched successfully",
      settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error.message);

    res.status(500).json({
      message: "Server error while fetching settings",
      error: error.message,
    });
  }
};


// =========================
// UPDATE SETTINGS
// =========================

const updateSettings = async (req, res) => {
  try {
    const {
      portal_name_en,
      portal_name_so,
      portal_description_en,
      portal_description_so,
      logo_url,
      favicon_url,
      official_website,
      phone,
      email,
      address_en,
      address_so,
      facebook_url,
      twitter_url,
      youtube_url,
      instagram_url,
      default_language,
      maintenance_mode,
      registration_enabled,
      public_services_enabled,
      notifications_enabled,
    } = req.body;

    if (!portal_name_en || !portal_name_so) {
      return res.status(400).json({
        message:
          "English and Somali portal names are required",
      });
    }

    if (
      default_language &&
      !["en", "so"].includes(default_language)
    ) {
      return res.status(400).json({
        message: "Invalid default language",
      });
    }

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    settings.portal_name_en =
      portal_name_en.trim();

    settings.portal_name_so =
      portal_name_so.trim();

    settings.portal_description_en =
      portal_description_en?.trim() || "";

    settings.portal_description_so =
      portal_description_so?.trim() || "";

    settings.logo_url =
      logo_url?.trim() || "";

    settings.favicon_url =
      favicon_url?.trim() || "";

    settings.official_website =
      official_website?.trim() || "";

    settings.phone =
      phone?.trim() || "";

    settings.email =
      email?.trim().toLowerCase() || "";

    settings.address_en =
      address_en?.trim() || "";

    settings.address_so =
      address_so?.trim() || "";

    settings.facebook_url =
      facebook_url?.trim() || "";

    settings.twitter_url =
      twitter_url?.trim() || "";

    settings.youtube_url =
      youtube_url?.trim() || "";

    settings.instagram_url =
      instagram_url?.trim() || "";

    settings.default_language =
      default_language || "so";

    settings.maintenance_mode =
      maintenance_mode ?? false;

    settings.registration_enabled =
      registration_enabled ?? true;

    settings.public_services_enabled =
      public_services_enabled ?? true;

    settings.notifications_enabled =
      notifications_enabled ?? true;

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Server error while updating settings",
      error: error.message,
    });
  }
};


// =========================
// TOGGLE MAINTENANCE MODE
// =========================

const toggleMaintenanceMode = async (
  req,
  res
) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        portal_name_en:
          "Somalia Government Portal",
        portal_name_so:
          "Bogga Dowladda Soomaaliya",
      });
    }

    settings.maintenance_mode =
      !settings.maintenance_mode;

    await settings.save();

    res.status(200).json({
      message: settings.maintenance_mode
        ? "Maintenance mode enabled"
        : "Maintenance mode disabled",
      settings,
    });
  } catch (error) {
    console.error(
      "TOGGLE MAINTENANCE ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while changing maintenance mode",
      error: error.message,
    });
  }
};


// =========================
// TOGGLE REGISTRATION
// =========================

const toggleRegistration = async (
  req,
  res
) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        portal_name_en:
          "Somalia Government Portal",
        portal_name_so:
          "Bogga Dowladda Soomaaliya",
      });
    }

    settings.registration_enabled =
      !settings.registration_enabled;

    await settings.save();

    res.status(200).json({
      message:
        "Registration setting updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "TOGGLE REGISTRATION ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while changing registration setting",
      error: error.message,
    });
  }
};


// =========================
// TOGGLE PUBLIC SERVICES
// =========================

const togglePublicServices = async (
  req,
  res
) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        portal_name_en:
          "Somalia Government Portal",
        portal_name_so:
          "Bogga Dowladda Soomaaliya",
      });
    }

    settings.public_services_enabled =
      !settings.public_services_enabled;

    await settings.save();

    res.status(200).json({
      message:
        "Public services setting updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "TOGGLE PUBLIC SERVICES ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while changing public services setting",
      error: error.message,
    });
  }
};


module.exports = {
  getSettings,
  updateSettings,
  toggleMaintenanceMode,
  toggleRegistration,
  togglePublicServices,
};