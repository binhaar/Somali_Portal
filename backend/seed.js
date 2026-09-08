require("dotenv").config();

const connectDB = require("./config/db");

const Category = require("./models/Category");
const Ministry = require("./models/Ministry");
const Province = require("./models/Province");
const Agency = require("./models/Agency");
const CabinetMember = require("./models/CabinetMember");
const Service = require("./models/Service");
const EmergencyContact = require("./models/EmergencyContact");
const News = require("./models/News");
const Event = require("./models/Event");

const seedData = async () => {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    // ==========================================
    // 1. CATEGORIES
    // ==========================================

    const categoriesData = [
      {
        name_en: "Education",
        name_so: "Waxbarasho",
        description_en: "Government education services",
        description_so: "Adeegyada waxbarashada dowladda",
        icon: "education",
        is_active: true
      },
      {
        name_en: "Health",
        name_so: "Caafimaad",
        description_en: "Government health services",
        description_so: "Adeegyada caafimaadka dowladda",
        icon: "health",
        is_active: true
      },
      {
        name_en: "Business",
        name_so: "Ganacsi",
        description_en: "Business and registration services",
        description_so: "Adeegyada ganacsiga iyo diiwaangelinta",
        icon: "business",
        is_active: true
      },
      {
        name_en: "Migration",
        name_so: "Socdaalka",
        description_en: "Migration and immigration services",
        description_so: "Adeegyada socdaalka iyo socdaalka caalamiga ah",
        icon: "migration",
        is_active: true
      },
      {
        name_en: "Agriculture and Animal Resources",
        name_so: "Beeraha iyo Xoolaha",
        description_en: "Agriculture and livestock services",
        description_so: "Adeegyada beeraha iyo xoolaha",
        icon: "agriculture",
        is_active: true
      },
      {
        name_en: "Family",
        name_so: "Qoyska",
        description_en: "Family-related government services",
        description_so: "Adeegyada dowladda ee la xiriira qoyska",
        icon: "family",
        is_active: true
      },
      {
        name_en: "Environment",
        name_so: "Deegaanka",
        description_en: "Environmental government services",
        description_so: "Adeegyada deegaanka",
        icon: "environment",
        is_active: true
      },
      {
        name_en: "Sports and Entertainment",
        name_so: "Ciyaaraha iyo Madadaalada",
        description_en: "Sports and entertainment services",
        description_so: "Adeegyada ciyaaraha iyo madadaalada",
        icon: "sports",
        is_active: true
      }
    ];

    const categories = {};

    for (const data of categoriesData) {
      const category = await Category.findOneAndUpdate(
        { name_en: data.name_en },
        data,
        { new: true, upsert: true }
      );

      categories[data.name_en] = category;
    }

    console.log("Categories seeded.");

    // ==========================================
    // 2. MINISTRIES
    // ==========================================

    const ministriesData = [
      {
        name_en: "Ministry of Education, Culture and Higher Education",
        name_so: "Wasaaradda Waxbarashada, Dhaqanka iyo Tacliinta Sare",
        description_en: "Responsible for education, culture and higher education.",
        description_so: "Mas'uul ka ah waxbarashada, dhaqanka iyo tacliinta sare.",
        website_url: "",
        is_active: true
      },
      {
        name_en: "Ministry of Health",
        name_so: "Wasaaradda Caafimaadka",
        description_en: "Responsible for national health services and policies.",
        description_so: "Mas'uul ka ah adeegyada iyo siyaasadaha caafimaadka qaranka.",
        website_url: "",
        is_active: true
      },
      {
        name_en: "Ministry of Finance",
        name_so: "Wasaaradda Maaliyadda",
        description_en: "Responsible for national financial management.",
        description_so: "Mas'uul ka ah maamulka maaliyadda qaranka.",
        website_url: "",
        is_active: true
      },
      {
        name_en: "Ministry of Foreign Affairs and International Cooperation",
        name_so: "Wasaaradda Arrimaha Dibadda iyo Iskaashiga Caalamiga",
        description_en: "Responsible for foreign affairs and international cooperation.",
        description_so: "Mas'uul ka ah arrimaha dibadda iyo iskaashiga caalamiga ah.",
        website_url: "",
        is_active: true
      },
      {
        name_en: "Ministry of Internal Security",
        name_so: "Wasaaradda Amniga Gudaha",
        description_en: "Responsible for internal security affairs.",
        description_so: "Mas'uul ka ah arrimaha amniga gudaha.",
        website_url: "",
        is_active: true
      },
      {
        name_en: "Ministry of Transport and Civil Aviation",
        name_so: "Wasaaradda Gaadiidka iyo Duulista Rayidka",
        description_en: "Responsible for transportation and civil aviation.",
        description_so: "Mas'uul ka ah gaadiidka iyo duulista rayidka.",
        website_url: "",
        is_active: true
      }
    ];

    const ministries = {};

    for (const data of ministriesData) {
      const ministry = await Ministry.findOneAndUpdate(
        { name_en: data.name_en },
        data,
        { new: true, upsert: true }
      );

      ministries[data.name_en] = ministry;
    }

    console.log("Ministries seeded.");

    // ==========================================
    // 3. PROVINCES
    // ==========================================

    const provincesData = [
      {
        name_en: "Banadir",
        name_so: "Banaadir",
        capital_en: "Mogadishu",
        capital_so: "Muqdisho",
        description_en: "Federal capital region of Somalia.",
        description_so: "Gobolka caasimadda federaalka Soomaaliya.",
        is_active: true
      },
      {
        name_en: "Bari",
        name_so: "Bari",
        capital_en: "Bosaso",
        capital_so: "Boosaaso",
        is_active: true
      },
      {
        name_en: "Galguduud",
        name_so: "Galguduud",
        capital_en: "Dhusamareb",
        capital_so: "Dhuusamareeb",
        is_active: true
      },
      {
        name_en: "Hiraan",
        name_so: "Hiiraan",
        capital_en: "Beledweyne",
        capital_so: "Beledweyne",
        is_active: true
      },
      {
        name_en: "Lower Juba",
        name_so: "Jubbada Hoose",
        capital_en: "Kismayo",
        capital_so: "Kismaayo",
        is_active: true
      },
      {
        name_en: "Lower Shabelle",
        name_so: "Shabeellaha Hoose",
        capital_en: "Marka",
        capital_so: "Marka",
        is_active: true
      }
    ];

    for (const data of provincesData) {
      await Province.findOneAndUpdate(
        { name_en: data.name_en },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Provinces seeded.");

    // ==========================================
    // 4. AGENCIES
    // ==========================================

    const agenciesData = [
      {
        name_en: "National Identification and Registration Authority",
        name_so: "Hay'adda Aqoonsiga iyo Diiwaangelinta Qaranka",
        description_en: "Responsible for national identification and registration.",
        description_so: "Mas'uul ka ah aqoonsiga iyo diiwaangelinta qaranka.",
        ministry: ministries["Ministry of Internal Security"]._id,
        is_active: true
      },
      {
        name_en: "Immigration and Citizenship Agency",
        name_so: "Hay'adda Socdaalka iyo Jinsiyadda",
        description_en: "Responsible for immigration and citizenship services.",
        description_so: "Mas'uul ka ah adeegyada socdaalka iyo jinsiyadda.",
        ministry: ministries["Ministry of Internal Security"]._id,
        is_active: true
      },
      {
        name_en: "National Examination and Certification Authority",
        name_so: "Hay'adda Imtixaanaadka iyo Shahaadooyinka Qaranka",
        description_en: "Responsible for national examinations and certification.",
        description_so: "Mas'uul ka ah imtixaanaadka iyo shahaadooyinka qaranka.",
        ministry:
          ministries[
            "Ministry of Education, Culture and Higher Education"
          ]._id,
        is_active: true
      }
    ];

    for (const data of agenciesData) {
      await Agency.findOneAndUpdate(
        { name_en: data.name_en },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Agencies seeded.");

    // ==========================================
    // 5. CABINET
    // ==========================================

    const cabinetData = [
      {
        name_en: "Prime Minister",
        name_so: "Ra'iisul Wasaaraha",
        position_en: "Prime Minister of Somalia",
        position_so: "Ra'iisul Wasaaraha Soomaaliya",
        description_en: "Head of the Federal Government of Somalia.",
        description_so: "Madaxa Dowladda Federaalka Soomaaliya.",
        is_active: true
      },
      {
        name_en: "Minister of Education",
        name_so: "Wasiirka Waxbarashada",
        position_en: "Minister of Education, Culture and Higher Education",
        position_so: "Wasiirka Waxbarashada, Dhaqanka iyo Tacliinta Sare",
        ministry:
          ministries[
            "Ministry of Education, Culture and Higher Education"
          ]._id,
        is_active: true
      },
      {
        name_en: "Minister of Health",
        name_so: "Wasiirka Caafimaadka",
        position_en: "Minister of Health",
        position_so: "Wasiirka Caafimaadka",
        ministry: ministries["Ministry of Health"]._id,
        is_active: true
      }
    ];

    for (const data of cabinetData) {
      await CabinetMember.findOneAndUpdate(
        {
          name_en: data.name_en,
          position_en: data.position_en
        },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Cabinet members seeded.");

    // ==========================================
    // 6. SERVICES
    // ==========================================

    const servicesData = [
      {
        title_en: "High School Certificate",
        title_so: "Shahaadada Dugsiga Sare",
        description_en: "Access information about high school certification services.",
        description_so: "Hel macluumaad ku saabsan adeegyada shahaadada dugsiga sare.",
        category: categories["Education"]._id,
        ministry:
          ministries[
            "Ministry of Education, Culture and Higher Education"
          ]._id,
        icon: "certificate",
        external_url: "https://www.somalia.gov.so/",
        is_active: true
      },
      {
        title_en: "National ID Card",
        title_so: "Kaarka Aqoonsiga Qaranka",
        description_en: "Access national identification services.",
        description_so: "Hel adeegyada aqoonsiga qaranka.",
        category: categories["Migration"]._id,
        ministry: ministries["Ministry of Internal Security"]._id,
        icon: "id-card",
        external_url: "https://www.somalia.gov.so/",
        is_active: true
      },
      {
        title_en: "Health Services",
        title_so: "Adeegyada Caafimaadka",
        description_en: "Access government health service information.",
        description_so: "Hel macluumaadka adeegyada caafimaadka dowladda.",
        category: categories["Health"]._id,
        ministry: ministries["Ministry of Health"]._id,
        icon: "health",
        external_url: "https://www.somalia.gov.so/",
        is_active: true
      },
      {
        title_en: "Business Registration",
        title_so: "Diiwaangelinta Ganacsiga",
        description_en: "Information about business registration services.",
        description_so: "Macluumaad ku saabsan adeegyada diiwaangelinta ganacsiga.",
        category: categories["Business"]._id,
        ministry: ministries["Ministry of Finance"]._id,
        icon: "business",
        external_url: "https://www.somalia.gov.so/",
        is_active: true
      }
    ];

    for (const data of servicesData) {
      await Service.findOneAndUpdate(
        {
          title_en: data.title_en
        },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Services seeded.");

    // ==========================================
    // 7. EMERGENCY CONTACTS
    // ==========================================

    const emergencyData = [
      {
        name_en: "Police",
        name_so: "Booliska",
        description_en: "Contact the police for emergency assistance.",
        description_so: "La xiriir booliska marka ay jirto xaalad degdeg ah.",
        phone: "888",
        location_en: "Somalia",
        location_so: "Soomaaliya",
        icon: "police",
        is_active: true
      },
      {
        name_en: "Ambulance",
        name_so: "Ambalaas",
        description_en: "Emergency medical assistance.",
        description_so: "Gargaarka caafimaad ee degdegga ah.",
        phone: "999",
        location_en: "Somalia",
        location_so: "Soomaaliya",
        icon: "ambulance",
        is_active: true
      }
    ];

    for (const data of emergencyData) {
      await EmergencyContact.findOneAndUpdate(
        { name_en: data.name_en },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Emergency contacts seeded.");

    // ==========================================
    // 8. NEWS
    // ==========================================

    const newsData = [
      {
        title_en: "Government Portal Launch",
        title_so: "Daahfurka Portal-ka Dowladda",
        content_en:
          "The Somalia Government Portal provides citizens with access to government information and services.",
        content_so:
          "Portal-ka Dowladda Soomaaliya wuxuu muwaadiniinta siinayaa helitaanka macluumaadka iyo adeegyada dowladda.",
        category: "Government",
        author: "Government Portal",
        publishedAt: new Date(),
        is_published: true
      }
    ];

    for (const data of newsData) {
      await News.findOneAndUpdate(
        { title_en: data.title_en },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("News seeded.");

    // ==========================================
    // 9. EVENTS
    // ==========================================

    const eventsData = [
      {
        title_en: "National Government Event",
        title_so: "Munaasabadda Dowladda Qaranka",
        description_en: "Government public event.",
        description_so: "Munaasabad dadweyne oo dowladda ah.",
        location_en: "Mogadishu",
        location_so: "Muqdisho",
        startDate: new Date("2026-10-01"),
        organizer: "Federal Government of Somalia",
        external_url: "https://www.somalia.gov.so/",
        is_active: true
      }
    ];

    for (const data of eventsData) {
      await Event.findOneAndUpdate(
        { title_en: data.title_en },
        data,
        { new: true, upsert: true }
      );
    }

    console.log("Events seeded.");

    console.log("");
    console.log("======================================");
    console.log("DATABASE SEED COMPLETED SUCCESSFULLY");
    console.log("======================================");

    process.exit(0);
  } catch (error) {
    console.error("Database seed failed:", error.message);
    process.exit(1);
  }
};

seedData();