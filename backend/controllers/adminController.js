const User = require("../models/User");
const Service = require("../models/Service");
const Category = require("../models/Category");
const Ministry = require("../models/Ministry");
const Agency = require("../models/Agency");
const Province = require("../models/Province");
const CabinetMember = require("../models/CabinetMember");
const News = require("../models/News");
const Event = require("../models/Event");
const EmergencyContact = require("../models/EmergencyContact");

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCitizens,
      totalVisitors,
      totalAdmins,

      totalServices,
      activeServices,

      totalCategories,
      activeCategories,

      totalMinistries,
      activeMinistries,

      totalAgencies,
      activeAgencies,

      totalProvinces,
      activeProvinces,

      totalCabinetMembers,
      activeCabinetMembers,

      totalNews,
      publishedNews,

      totalEvents,
      activeEvents,

      totalEmergencyContacts,
      activeEmergencyContacts
    ] = await Promise.all([
      // USERS
      User.countDocuments(),
      User.countDocuments({ accountType: "CITIZEN" }),
      User.countDocuments({ accountType: "VISITOR" }),
      User.countDocuments({ role: "ADMIN" }),

      // SERVICES
      Service.countDocuments(),
      Service.countDocuments({ is_active: true }),

      // CATEGORIES
      Category.countDocuments(),
      Category.countDocuments({ is_active: true }),

      // MINISTRIES
      Ministry.countDocuments(),
      Ministry.countDocuments({ is_active: true }),

      // AGENCIES
      Agency.countDocuments(),
      Agency.countDocuments({ is_active: true }),

      // PROVINCES
      Province.countDocuments(),
      Province.countDocuments({ is_active: true }),

      // CABINET
      CabinetMember.countDocuments(),
      CabinetMember.countDocuments({ is_active: true }),

      // NEWS
      News.countDocuments(),
      News.countDocuments({ is_published: true }),

      // EVENTS
      Event.countDocuments(),
      Event.countDocuments({ is_active: true }),

      // EMERGENCY CONTACTS
      EmergencyContact.countDocuments(),
      EmergencyContact.countDocuments({ is_active: true })
    ]);

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      statistics: {
        users: {
          total: totalUsers,
          citizens: totalCitizens,
          visitors: totalVisitors,
          admins: totalAdmins
        },

        services: {
          total: totalServices,
          active: activeServices,
          inactive: totalServices - activeServices
        },

        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories
        },

        ministries: {
          total: totalMinistries,
          active: activeMinistries,
          inactive: totalMinistries - activeMinistries
        },

        agencies: {
          total: totalAgencies,
          active: activeAgencies,
          inactive: totalAgencies - activeAgencies
        },

        provinces: {
          total: totalProvinces,
          active: activeProvinces,
          inactive: totalProvinces - activeProvinces
        },

        cabinet: {
          total: totalCabinetMembers,
          active: activeCabinetMembers,
          inactive: totalCabinetMembers - activeCabinetMembers
        },

        news: {
          total: totalNews,
          published: publishedNews,
          unpublished: totalNews - publishedNews
        },

        events: {
          total: totalEvents,
          active: activeEvents,
          inactive: totalEvents - activeEvents
        },

        emergencyContacts: {
          total: totalEmergencyContacts,
          active: activeEmergencyContacts,
          inactive: totalEmergencyContacts - activeEmergencyContacts
        }
      }
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// ==========================================
// GET RECENT DASHBOARD DATA
// ==========================================
const getRecentDashboardData = async (req, res) => {
  try {
    const [
      recentUsers,
      recentServices,
      recentNews,
      recentEvents
    ] = await Promise.all([
      // RECENT USERS
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),

      // RECENT SERVICES
      Service.find()
        .populate(
          "category",
          "name_en name_so"
        )
        .populate(
          "ministry",
          "name_en name_so"
        )
        .sort({ createdAt: -1 })
        .limit(5),

      // RECENT NEWS
      News.find()
        .sort({ createdAt: -1 })
        .limit(5),

      // RECENT EVENTS
      Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      message: "Recent dashboard data fetched successfully",

      data: {
        recentUsers,
        recentServices,
        recentNews,
        recentEvents
      }
    });
  } catch (error) {
    console.error("Recent dashboard data error:", error);

    res.status(500).json({
      message: "Failed to fetch recent dashboard data",
      error: error.message
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getDashboardStats,
  getRecentDashboardData
};