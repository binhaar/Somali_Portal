const Service = require("../models/Service");
const Ministry = require("../models/Ministry");
const Agency = require("../models/Agency");
const Province = require("../models/Province");
const CabinetMember = require("../models/CabinetMember");
const News = require("../models/News");
const Event = require("../models/Event");


// GLOBAL SEARCH
const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    const searchTerm = q.trim();

    const regex = new RegExp(searchTerm, "i");

    const [
      services,
      ministries,
      agencies,
      provinces,
      cabinet,
      news,
      events
    ] = await Promise.all([
      Service.find({
        is_active: true,
        $or: [
          { title_en: regex },
          { title_so: regex },
          { description_en: regex },
          { description_so: regex },
          { category: regex }
        ]
      }).limit(10),

      Ministry.find({
        is_active: true,
        $or: [
          { name_en: regex },
          { name_so: regex },
          { description_en: regex },
          { description_so: regex }
        ]
      }).limit(10),

      Agency.find({
        is_active: true,
        $or: [
          { name_en: regex },
          { name_so: regex },
          { description_en: regex },
          { description_so: regex }
        ]
      })
        .populate("ministry", "name_en name_so")
        .limit(10),

      Province.find({
        is_active: true,
        $or: [
          { name_en: regex },
          { name_so: regex },
          { description_en: regex },
          { description_so: regex },
          { capital_en: regex },
          { capital_so: regex }
        ]
      }).limit(10),

      CabinetMember.find({
        is_active: true,
        $or: [
          { name_en: regex },
          { name_so: regex },
          { position_en: regex },
          { position_so: regex },
          { description_en: regex },
          { description_so: regex }
        ]
      })
        .populate("ministry", "name_en name_so")
        .limit(10),

      News.find({
        is_published: true,
        $or: [
          { title_en: regex },
          { title_so: regex },
          { content_en: regex },
          { content_so: regex },
          { category: regex },
          { author: regex }
        ]
      })
        .sort({ publishedAt: -1 })
        .limit(10),

      Event.find({
        is_active: true,
        $or: [
          { title_en: regex },
          { title_so: regex },
          { description_en: regex },
          { description_so: regex },
          { location_en: regex },
          { location_so: regex },
          { organizer: regex }
        ]
      })
        .sort({ startDate: 1 })
        .limit(10)
    ]);


    const totalResults =
      services.length +
      ministries.length +
      agencies.length +
      provinces.length +
      cabinet.length +
      news.length +
      events.length;


    res.status(200).json({
      query: searchTerm,

      totalResults,

      results: {
        services,
        ministries,
        agencies,
        provinces,
        cabinet,
        news,
        events
      }
    });

  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error.message);

    res.status(500).json({
      message: "Server error while searching",
      error: error.message
    });
  }
};


module.exports = {
  globalSearch
};