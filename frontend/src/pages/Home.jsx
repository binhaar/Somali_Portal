import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  Phone,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

/* =========================================================
   SOMALIA LOGO
========================================================= */

const SOMALIA_LOGO =
  "https://somaliagov.netlify.app/logos/coat-of-arms.png";

/* =========================================================
   LEADERS
========================================================= */

const LEADERS = [
  {
    name: "H.E. Hassan Sheikh Mohamud",
    nameSo: "Mudane Xasan Sheekh Maxamuud",
    role: "President of the Federal Republic of Somalia",
    roleSo: "Madaxweynaha Jamhuuriyadda Federaalka Soomaaliya",
    shortRole: "President",
    shortRoleSo: "Madaxweynaha",
    image: "/leaders/president.jpg",
    profileUrl: "https://villasomalia.gov.so/the-president/",
    websiteUrl: "https://villasomalia.gov.so/",
    websiteName: "Villa Somalia",
  },

  {
    name: "H.E. Hamza Abdi Barre",
    nameSo: "Mudane Xamse Cabdi Barre",
    role: "Prime Minister of the Federal Government of Somalia",
    roleSo: "Ra'iisul Wasaaraha Xukuumadda Federaalka Soomaaliya",
    shortRole: "Prime Minister",
    shortRoleSo: "Ra'iisul Wasaaraha",
    image: "/leaders/prime-minister.jpg",
    profileUrl: "https://opm.gov.so/en/prime-ministers/prime-minister",
    websiteUrl: "https://opm.gov.so/",
    websiteName: "Office of the Prime Minister",
  },

  {
    name: "H.E. Abdulkadir Mohamed Nur (Jamac)",
    nameSo: "Mudane Cabdiqaadir Maxamed Nuur (Jaamac)",
    role: "Speaker of the House of the People",
    roleSo: "Guddoomiyaha Golaha Shacabka",
    shortRole: "Speaker of House of the People",
    shortRoleSo: "Guddoomiyaha Golaha Shacabka",
    image: "/leaders/speaker-house.jpg",
    profileUrl: "https://parliament.gov.so/",
    websiteUrl: "https://parliament.gov.so/",
    websiteName: "House of the People",
  },

  {
    name: "H.E. Abdi Hashi Abdullahi",
    nameSo: "Mudane Cabdi Xaashi Cabdullaahi",
    role: "Speaker of the Upper House",
    roleSo: "Guddoomiyaha Aqalka Sare",
    shortRole: "Speaker of Upper House",
    shortRoleSo: "Guddoomiyaha Aqalka Sare",
    image: "/leaders/speaker-senate.jpg",
    profileUrl: "https://senate.gov.so/speaker/?lang=en",
    websiteUrl: "https://senate.gov.so/",
    websiteName: "Federal Parliament – Upper House",
  },
];

/* =========================================================
   IMAGE FALLBACK
========================================================= */

const getImageFallback = (event) => {
  if (!event?.currentTarget) return;

  event.currentTarget.onerror = null;
  event.currentTarget.src = SOMALIA_LOGO;
};

/* =========================================================
   API ARRAY HELPER
========================================================= */

const extractList = (response, key) => {
  const payload = response?.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (key && Array.isArray(payload?.[key])) {
    return payload[key];
  }

  return [];
};

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const navigate = useNavigate();

  const auth = useContext(AuthContext) || {};

  const user = auth.user;
  const logout = auth.logout;

  /* =======================================================
     STATE
  ======================================================= */

  const [language, setLanguage] = useState("en");

  const [search, setSearch] = useState("");

  const [services, setServices] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [events, setEvents] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const t = {
    en: {
      home: "Home",
      services: "Services",
      ministries: "Ministries",
      agencies: "Agencies",
      events: "Events",
      about: "About",

      official:
        "Official Portal of the Federal Government",

      federal:
        "Federal Republic of Somalia",

      slogan:
        "Peace, Progress, and Prosperity.",

      search:
        "Search for services, ministries, agencies, or documents...",

      popular:
        "Popular:",

      passport:
        "Passport",

      visa:
        "Visa",

      jobs:
        "Jobs",

      tender:
        "Tender",

      leadership:
        "Executive Leadership",

      leadershipDesc:
        "Meet the leaders of the Federal Republic of Somalia.",

      viewProfile:
        "View Profile",

      onlineServices:
        "Online Government Services",

      onlineServicesDesc:
        "Access essential government services quickly and securely.",

      viewAllServices:
        "View All Services",

      importantDates:
        "Important National Dates",

      importantDatesDesc:
        "Stay informed about important national events and occasions.",

      federalMinistries:
        "Federal Ministries",

      federalMinistriesDesc:
        "Explore the ministries responsible for delivering national priorities.",

      nationalAgencies:
        "National Agencies",

      nationalAgenciesDesc:
        "Find key government agencies and institutions.",

      emergency:
        "Emergency Contacts",

      emergencyDesc:
        "Important numbers for emergency and public services.",

      latestEvents:
        "Latest Government Events",

      latestEventsDesc:
        "Stay updated with important events and activities.",

      searchResults:
        "Search Results",

      noResults:
        "No results found.",

      login:
        "Login",

      register:
        "Register",

      dashboard:
        "Dashboard",

      logout:
        "Logout",

      footerDescription:
        "The official digital gateway to the Federal Government of Somalia.",

      quickLinks:
        "Quick Links",

      government:
        "Government",

      support:
        "Support",

      privacy:
        "Privacy Policy",

      terms:
        "Terms of Service",

      rights:
        "All rights reserved.",

      federalLeadership:
        "Federal Leadership",

      federalGovernment:
        "Federal Government",

      onlineService:
        "Online Service",

      learnMore:
        "Learn More",

      exploreServices:
        "Explore Services",

      nationalCalendar:
        "National Calendar",

      nationalInstitutions:
        "National Institutions",

      publicSafety:
        "Public Safety",

      latestUpdates:
        "Latest Updates",

      governmentServices:
        "Government Services",

      contact:
        "Contact",

      vision:
        "National Vision",

      visionDescription:
        "Building a peaceful, stable, prosperous and inclusive Somalia.",

      constitution:
        "Constitution",

      constitutionDescription:
        "Learn about the constitutional framework of Somalia.",

      parliament:
        "Parliament",

      parliamentDescription:
        "Explore the Federal Parliament of Somalia.",
    },

    so: {
      home:
        "Bogga Hore",

      services:
        "Adeegyada",

      ministries:
        "Wasaaradaha",

      agencies:
        "Hay'adaha",

      events:
        "Dhacdooyinka",

      about:
        "Ku Saabsan",

      official:
        "Bogga Rasmiga ah ee Dowladda Federaalka",

      federal:
        "Jamhuuriyadda Federaalka Soomaaliya",

      slogan:
        "Nabad, Horumar iyo Barwaaqo.",

      search:
        "Ka raadi adeegyo, wasaarado, hay'ado ama dukumiintiyo...",

      popular:
        "Raadinta caanka ah:",

      passport:
        "Baasaboor",

      visa:
        "Fiiso",

      jobs:
        "Shaqooyin",

      tender:
        "Qandaraas",

      leadership:
        "Hoggaanka Sare",

      leadershipDesc:
        "La kulan hoggaanka Jamhuuriyadda Federaalka Soomaaliya.",

      viewProfile:
        "Arag Macluumaadka",

      onlineServices:
        "Adeegyada Dowladda ee Online-ka",

      onlineServicesDesc:
        "Si fudud oo ammaan ah uga hel adeegyada muhiimka ah ee dowladda.",

      viewAllServices:
        "Arag Dhammaan Adeegyada",

      importantDates:
        "Taariikhaha Muhiimka ah",

      importantDatesDesc:
        "La soco dhacdooyinka iyo maalmaha muhiimka ah ee qaranka.",

      federalMinistries:
        "Wasaaradaha Federaalka",

      federalMinistriesDesc:
        "Baro wasaaradaha ka shaqeeya mudnaanta iyo horumarka qaranka.",

      nationalAgencies:
        "Hay'adaha Qaranka",

      nationalAgenciesDesc:
        "Hel hay'adaha iyo xarumaha muhiimka ah ee dowladda.",

      emergency:
        "Lambarada Gurmadka",

      emergencyDesc:
        "Lambarada muhiimka ah ee adeegyada gurmadka iyo bulshada.",

      latestEvents:
        "Dhacdooyinka Dowladda",

      latestEventsDesc:
        "La soco munaasabadaha iyo hawlaha muhiimka ah ee dowladda.",

      searchResults:
        "Natiijooyinka Raadinta",

      noResults:
        "Wax natiijo ah lama helin.",

      login:
        "Gal",

      register:
        "Isdiiwaangeli",

      dashboard:
        "Dashboard",

      logout:
        "Ka bax",

      footerDescription:
        "Albaabka rasmiga ah ee dijitaalka ah ee Dowladda Federaalka Soomaaliya.",

      quickLinks:
        "Xiriirro Degdeg ah",

      government:
        "Dowladda",

      support:
        "Taageero",

      privacy:
        "Siyaasadda Asturnaanta",

      terms:
        "Shuruudaha Adeegga",

      rights:
        "Dhammaan xuquuqdu way dhowran yihiin.",

      federalLeadership:
        "Hoggaanka Federaalka",

      federalGovernment:
        "Dowladda Federaalka",

      onlineService:
        "Adeeg Online ah",

      learnMore:
        "Wax badan ka ogow",

      exploreServices:
        "Baadh Adeegyada",

      nationalCalendar:
        "Jadwalka Qaranka",

      nationalInstitutions:
        "Hay'adaha Qaranka",

      publicSafety:
        "Badbaadada Bulshada",

      latestUpdates:
        "Wararkii Ugu Dambeeyay",

      governmentServices:
        "Adeegyada Dowladda",

      contact:
        "Xiriir",

      vision:
        "Himilada Qaranka",

      visionDescription:
        "Dhisidda Soomaaliya nabad ah, xasilloon, barwaaqo leh oo loo dhan yahay.",

      constitution:
        "Dastuurka",

      constitutionDescription:
        "Baro nidaamka dastuuriga ah ee Soomaaliya.",

      parliament:
        "Baarlamaanka",

      parliamentDescription:
        "Baro Baarlamaanka Federaalka Soomaaliya.",
    },
  }[language];

  /* =======================================================
     LOAD HOME DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const results = await Promise.allSettled([
          api.get("/services"),
          api.get("/ministries"),
          api.get("/agencies"),
          api.get("/events"),
          api.get("/emergency-contacts"),
        ]);

        if (!mounted) return;

        const [
          servicesRes,
          ministriesRes,
          agenciesRes,
          eventsRes,
          emergencyRes,
        ] = results;

        /* SERVICES */

        if (servicesRes.status === "fulfilled") {
          setServices(
            extractList(
              servicesRes.value,
              "services"
            )
          );
        } else {
          console.error(
            "Services API error:",
            servicesRes.reason
          );
        }

        /* MINISTRIES */

        if (ministriesRes.status === "fulfilled") {
          setMinistries(
            extractList(
              ministriesRes.value,
              "ministries"
            )
          );
        } else {
          console.error(
            "Ministries API error:",
            ministriesRes.reason
          );
        }

        /* AGENCIES */

        if (agenciesRes.status === "fulfilled") {
          setAgencies(
            extractList(
              agenciesRes.value,
              "agencies"
            )
          );
        } else {
          console.error(
            "Agencies API error:",
            agenciesRes.reason
          );
        }

        /* EVENTS */

        if (eventsRes.status === "fulfilled") {
          setEvents(
            extractList(
              eventsRes.value,
              "events"
            )
          );
        } else {
          console.error(
            "Events API error:",
            eventsRes.reason
          );
        }

        /* EMERGENCY */

        if (emergencyRes.status === "fulfilled") {
          setEmergencyContacts(
            extractList(
              emergencyRes.value,
              "contacts"
            )
          );
        } else {
          console.error(
            "Emergency contacts API error:",
            emergencyRes.reason
          );
        }
      } catch (error) {
        console.error(
          "Home data loading error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const normalizedSearch =
    search.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    const matchItem = (item) => {
      const text = [
        item?.name,
        item?.title,

        item?.name_en,
        item?.name_so,

        item?.nameEn,
        item?.nameSo,

        item?.title_en,
        item?.title_so,

        item?.titleEn,
        item?.titleSo,

        item?.description,
        item?.description_en,
        item?.description_so,

        item?.descriptionEn,
        item?.descriptionSo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedSearch);
    };

    const serviceResults = services
      .filter(matchItem)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        type: "service",
      }));

    const ministryResults = ministries
      .filter(matchItem)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        type: "ministry",
      }));

    const agencyResults = agencies
      .filter(matchItem)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        type: "agency",
      }));

    return [
      ...serviceResults,
      ...ministryResults,
      ...agencyResults,
    ];
  }, [
    normalizedSearch,
    services,
    ministries,
    agencies,
  ]);

  /* =======================================================
     GET NAME
  ======================================================= */

  const getName = (item) => {
    if (!item) return "";

    if (language === "so") {
      return (
        item.name_so ||
        item.nameSo ||
        item.somaliName ||
        item.somali_name ||
        item.title_so ||
        item.titleSo ||
        item.title_somali ||
        item.service_so ||
        item.serviceSo ||
        item.service_name_so ||
        item.serviceNameSo ||
        item.name ||
        item.title ||
        item.service ||
        ""
      );
    }

    return (
      item.name_en ||
      item.nameEn ||
      item.englishName ||
      item.english_name ||
      item.title_en ||
      item.titleEn ||
      item.title_english ||
      item.service_en ||
      item.serviceEn ||
      item.service_name_en ||
      item.serviceNameEn ||
      item.name ||
      item.title ||
      item.service ||
      ""
    );
  };

  /* =======================================================
     GET DESCRIPTION
  ======================================================= */

  const getDescription = (item) => {
    if (!item) return "";

    if (language === "so") {
      return (
        item.description_so ||
        item.descriptionSo ||
        item.somaliDescription ||
        item.somali_description ||
        item.desc_so ||
        item.description ||
        ""
      );
    }

    return (
      item.description_en ||
      item.descriptionEn ||
      item.englishDescription ||
      item.english_description ||
      item.desc_en ||
      item.description ||
      ""
    );
  };

  /* =======================================================
     GET ID
  ======================================================= */

  const getId = (item) => {
    return item?._id || item?.id;
  };

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollTo = (id) => {
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     SERVICE CLICK
  ======================================================= */

  const handleServiceClick = (service) => {
    const externalUrl =
      service?.external_url ||
      service?.externalUrl ||
      service?.url ||
      service?.link;

    if (!user) {
      sessionStorage.setItem(
        "pendingService",
        JSON.stringify(service)
      );

      navigate("/login");

      return;
    }

    if (externalUrl) {
      window.open(
        externalUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    const id = getId(service);

    if (id) {
      navigate(`/services/${id}`);
    }
  };

  /* =======================================================
     POPULAR SEARCH
  ======================================================= */

  const popularSearch = (value) => {
    setSearch(value);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     LEADER HELPERS
  ======================================================= */

  const getLeaderName = (leader) => {
    return language === "so"
      ? leader.nameSo
      : leader.name;
  };

  const getLeaderRole = (leader) => {
    return language === "so"
      ? leader.roleSo
      : leader.role;
  };

  const getLeaderShortRole = (leader) => {
    return language === "so"
      ? leader.shortRoleSo
      : leader.shortRole;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        language={language}
        setLanguage={setLanguage}
        user={user}
        logout={logout}
        scrollTo={scrollTo}
        t={t}
        getImageFallback={getImageFallback}
      />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#0B3D91] via-[#1261B5] to-[#27A9E8]"
      >
        {/* Background decoration */}

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28">

          {/* HERO LEFT */}

          <div className="text-white">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <ShieldCheck size={17} />

              {t.official}
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t.federal}
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-blue-50 sm:text-xl">
              {t.slogan}
            </p>

            {/* SEARCH */}

            <div className="relative mt-9 max-w-2xl">

              <Search
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t.search}
                className="h-16 w-full rounded-2xl border border-white/30 bg-white pl-14 pr-5 text-base font-medium text-slate-900 shadow-2xl outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
              />

              {/* SEARCH RESULTS */}

              {normalizedSearch && (
                <div className="absolute left-0 right-0 top-[72px] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">

                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.searchResults}
                  </div>

                  {searchResults.length > 0 ? (
                    searchResults.map(
                      (result, index) => (
                        <button
                          key={
                            getId(result) ||
                            index
                          }
                          type="button"
                          onClick={() => {
                            setSearch("");

                            if (
                              result.type ===
                              "service"
                            ) {
                              handleServiceClick(
                                result
                              );
                            } else if (
                              result.type ===
                              "ministry"
                            ) {
                              scrollTo(
                                "ministries"
                              );
                            } else {
                              scrollTo(
                                "agencies"
                              );
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B3D91]">

                            {result.type ===
                            "service" ? (
                              <FileText size={18} />
                            ) : result.type ===
                              "ministry" ? (
                              <Building2 size={18} />
                            ) : (
                              <Landmark size={18} />
                            )}

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-semibold">
                              {getName(result)}
                            </p>

                            <p className="text-xs capitalize text-slate-500">
                              {result.type}
                            </p>

                          </div>

                          <ChevronRight
                            size={17}
                            className="text-slate-400"
                          />
                        </button>
                      )
                    )
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-slate-500">
                      {t.noResults}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* POPULAR SEARCH */}

            <div className="mt-6 flex flex-wrap items-center gap-2">

              <span className="mr-1 text-sm font-semibold text-blue-50">
                {t.popular}
              </span>

              {[
                t.passport,
                t.visa,
                t.jobs,
                t.tender,
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    popularSearch(item)
                  }
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white hover:text-[#0B3D91]"
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          {/* HERO RIGHT */}

          <div className="flex justify-center lg:justify-end">

            <div className="relative">

              <div className="absolute inset-0 scale-110 rounded-full bg-white/20 blur-3xl" />

              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-2xl backdrop-blur-md sm:h-80 sm:w-80">

                <div className="flex h-60 w-60 items-center justify-center rounded-full bg-white p-8 shadow-xl sm:h-[17rem] sm:w-[17rem]">

                  <img
                    src={SOMALIA_LOGO}
                    alt="Coat of Arms of Somalia"
                    className="h-full w-full object-contain"
                    onError={
                      getImageFallback
                    }
                  />

                </div>

              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-bold text-[#0B3D91] shadow-xl">
                {t.federal}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          EXECUTIVE LEADERSHIP
      ====================================================== */}

      <section
        id="leadership"
        className="bg-white py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">
              <Landmark size={24} />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
              {t.federalLeadership}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.leadership}
            </h2>

            <p className="mt-4 text-slate-500">
              {t.leadershipDesc}
            </p>

          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

            {LEADERS.map(
              (leader, index) => (
                <div
                  key={leader.name}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div className="relative h-80 overflow-hidden bg-gradient-to-b from-blue-50 to-slate-100">

                    <img
                      src={leader.image}
                      alt={getLeaderName(
                        leader
                      )}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      onError={
                        getImageFallback
                      }
                    />

                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm font-black text-[#0B3D91] shadow-lg">
                      0{index + 1}
                    </div>

                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <span className="text-lg">
                        🇸🇴
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-5 right-5">

                      <span className="inline-flex max-w-full rounded-full bg-[#0B3D91] px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {getLeaderShortRole(
                          leader
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="p-5">

                    <h3 className="min-h-[56px] text-lg font-black leading-snug text-slate-900">
                      {getLeaderName(
                        leader
                      )}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                      {getLeaderRole(leader)}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                      <Globe2 size={16} className="shrink-0 text-[#0B3D91]" />
                      <span className="truncate text-xs font-bold text-slate-600">
                        {leader.websiteName}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href={leader.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#0B3D91] hover:bg-blue-50 hover:text-[#0B3D91]">
                        <FileText size={15} />
                        {language === "so" ? "Macluumaad" : "View Profile"}
                      </a>
                      <a href={leader.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D91] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#082f70]">
                        <ExternalLink size={15} />
                        {language === "so" ? "Website-ka" : "Official Site"}
                      </a>
                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section
        id="services"
        className="bg-slate-50 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
                {t.governmentServices}
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {t.onlineServices}
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500">
                {t.onlineServicesDesc}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/services")
              }
              className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0B3D91] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#082F70] sm:self-auto"
            >
              {t.viewAllServices}

              <ArrowRight size={17} />
            </button>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {loading ? (
              Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-3xl bg-white shadow-sm"
                />
              ))
            ) : services.length > 0 ? (
              services
                .slice(0, 8)
                .map(
                  (service, index) => (
                    <button
                      key={
                        getId(service) ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleServiceClick(
                          service
                        )
                      }
                      className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91] transition group-hover:bg-[#0B3D91] group-hover:text-white">

                          {index % 4 === 0 ? (
                            <FileText size={22} />
                          ) : index % 4 === 1 ? (
                            <BriefcaseBusiness
                              size={22}
                            />
                          ) : index % 4 === 2 ? (
                            <GraduationCap
                              size={22}
                            />
                          ) : (
                            <Globe2 size={22} />
                          )}

                        </div>

                        <ArrowRight
                          size={18}
                          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0B3D91]"
                        />

                      </div>

                      <h3 className="mt-5 line-clamp-2 text-lg font-black text-slate-900">
                        {getName(service)}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {getDescription(
                          service
                        )}
                      </p>

                      {service.external_url ||
                      service.externalUrl ||
                      service.url ||
                      service.link ? (
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0B3D91]">

                          <ExternalLink
                            size={13}
                          />

                          {t.onlineService}

                        </div>
                      ) : null}

                    </button>
                  )
                )
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <FileText
                  className="mx-auto text-slate-300"
                  size={40}
                />

                <p className="mt-4 font-semibold text-slate-500">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          IMPORTANT NATIONAL DATES
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
              {t.nationalCalendar}
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              {t.importantDates}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              {t.importantDatesDesc}
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {events.length > 0 ? (
              events.slice(0, 6).map(
                (event, index) => (
                  <div
                    key={
                      getId(event) ||
                      index
                    }
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex gap-4">

                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">

                        <CalendarDays
                          size={21}
                        />

                        <span className="mt-1 text-[10px] font-black uppercase">
                          {event.month ||
                            "DATE"}
                        </span>

                      </div>

                      <div className="min-w-0">

                        <h3 className="font-black text-slate-900">
                          {getName(event)}
                        </h3>

                        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-500">
                          {getDescription(
                            event
                          )}
                        </p>

                        {event.startDate && (
                          <p className="mt-3 text-xs font-bold text-[#0B3D91]">
                            {new Date(
                              event.startDate
                            ).toLocaleDateString()}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )
            ) : (
              <div className="col-span-full rounded-3xl bg-slate-50 p-12 text-center">

                <CalendarDays
                  className="mx-auto text-slate-300"
                  size={42}
                />

                <p className="mt-4 text-slate-500">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          MINISTRIES
      ====================================================== */}

      <section
        id="ministries"
        className="bg-slate-50 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
                {t.federalGovernment}
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                {t.federalMinistries}
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500">
                {t.federalMinistriesDesc}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/ministries")
              }
              className="flex items-center gap-2 text-sm font-bold text-[#0B3D91] hover:text-[#082F70]"
            >
              {t.viewAllServices}

              <ChevronRight size={17} />
            </button>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {ministries.length > 0 ? (
              ministries
                .slice(0, 9)
                .map(
                  (ministry, index) => (
                    <button
                      type="button"
                      key={
                        getId(ministry) ||
                        index
                      }
                      onClick={() =>
                        navigate(
                          `/ministries/${getId(
                            ministry
                          )}`
                        )
                      }
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-lg"
                    >

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91] transition group-hover:bg-[#0B3D91] group-hover:text-white">
                        <Building2 size={21} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate font-bold text-slate-900">
                          {getName(ministry)}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {getDescription(
                            ministry
                          )}
                        </p>

                      </div>

                      <ChevronRight
                        size={18}
                        className="shrink-0 text-slate-300 group-hover:text-[#0B3D91]"
                      />

                    </button>
                  )
                )
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <Building2
                  className="mx-auto text-slate-300"
                  size={42}
                />

                <p className="mt-4 text-slate-500">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          AGENCIES
      ====================================================== */}

      <section
        id="agencies"
        className="bg-white py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
              {t.nationalInstitutions}
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              {t.nationalAgencies}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              {t.nationalAgenciesDesc}
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {agencies.length > 0 ? (
              agencies
                .slice(0, 8)
                .map(
                  (agency, index) => (
                    <div
                      key={
                        getId(agency) ||
                        index
                      }
                      className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91] transition group-hover:bg-[#0B3D91] group-hover:text-white">
                        <Landmark size={24} />
                      </div>

                      <h3 className="mt-5 font-black text-slate-900">
                        {getName(agency)}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {getDescription(
                          agency
                        )}
                      </p>

                    </div>
                  )
                )
            ) : (
              <div className="col-span-full rounded-3xl bg-slate-50 p-12 text-center">

                <Landmark
                  className="mx-auto text-slate-300"
                  size={42}
                />

                <p className="mt-4 text-slate-500">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          EMERGENCY CONTACTS
      ====================================================== */}

      <section
        id="emergency"
        className="bg-gradient-to-br from-[#0B3D91] to-[#1261B5] py-20"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 text-center text-white">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              {t.publicSafety}
            </p>

            <h2 className="text-3xl font-black sm:text-4xl">
              {t.emergency}
            </h2>

            <p className="mx-auto max-w-2xl text-blue-100">
              {t.emergencyDesc}
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {emergencyContacts.length >
            0 ? (
              emergencyContacts
                .slice(0, 8)
                .map(
                  (contact, index) => {
                    const phone =
                      contact.phone ||
                      contact.phone_number ||
                      contact.phoneNumber ||
                      contact.number ||
                      "";

                    return (
                      <a
                        key={
                          getId(contact) ||
                          index
                        }
                        href={`tel:${phone}`}
                        className="group rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-slate-900"
                      >

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white group-hover:bg-blue-50 group-hover:text-[#0B3D91]">
                            <Phone size={22} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-black">
                              {getName(contact)}
                            </h3>

                            <p className="mt-1 text-sm font-bold opacity-80">
                              {phone ||
                                "N/A"}
                            </p>

                          </div>

                        </div>

                      </a>
                    );
                  }
                )
            ) : (
              <div className="col-span-full rounded-3xl border border-white/20 bg-white/10 p-10 text-center text-white">

                <Phone
                  className="mx-auto"
                  size={40}
                />

                <p className="mt-4">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          EVENTS
      ====================================================== */}

      <section
        id="events"
        className="bg-slate-50 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
              {t.latestUpdates}
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              {t.latestEvents}
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              {t.latestEventsDesc}
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {events.length > 0 ? (
              events
                .slice(0, 6)
                .map(
                  (event, index) => (
                    <article
                      key={
                        getId(event) ||
                        index
                      }
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* EVENT IMAGE */}

                      {event.image ||
                      event.imageUrl ||
                      event.image_url ? (
                        <div className="h-52 overflow-hidden">

                          <img
                            src={
                              event.image ||
                              event.imageUrl ||
                              event.image_url
                            }
                            alt={getName(event)}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={
                              getImageFallback
                            }
                          />

                        </div>
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">

                          <CalendarDays
                            size={52}
                            className="text-blue-300"
                          />

                        </div>
                      )}

                      <div className="p-6">

                        <div className="flex items-center gap-2 text-xs font-bold text-[#0B3D91]">

                          <CalendarDays
                            size={14}
                          />

                          {event.startDate
                            ? new Date(
                                event.startDate
                              ).toLocaleDateString()
                            : "Government Event"}

                        </div>

                        <h3 className="mt-3 text-xl font-black text-slate-900">
                          {getName(event)}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {getDescription(
                            event
                          )}
                        </p>

                        {event.external_url ||
                        event.externalUrl ||
                        event.url ||
                        event.link ? (
                          <button
                            type="button"
                            className="mt-5 flex items-center gap-2 text-sm font-bold text-[#0B3D91]"
                            onClick={() =>
                              window.open(
                                event.external_url ||
                                  event.externalUrl ||
                                  event.url ||
                                  event.link,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            {t.learnMore}

                            <ArrowRight
                              size={15}
                            />
                          </button>
                        ) : null}

                      </div>

                    </article>
                  )
                )
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <CalendarDays
                  className="mx-auto text-slate-300"
                  size={45}
                />

                <p className="mt-4 text-slate-500">
                  {t.noResults}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          ABOUT / CTA
      ====================================================== */}

      <section
        id="about"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B3D91] via-[#1261B5] to-[#0878C9] px-7 py-12 text-white shadow-2xl sm:px-12 lg:px-16 lg:py-16">

            {/* Decorative circles */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">

                    <img
                      src={SOMALIA_LOGO}
                      alt="Somalia"
                      className="h-11 w-11 object-contain"
                      onError={
                        getImageFallback
                      }
                    />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                      {t.federal}
                    </p>

                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                      Digital Government Portal
                    </h2>

                  </div>

                </div>

                <p className="mt-6 max-w-2xl leading-7 text-blue-50/90">
                  {t.footerDescription}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                    🇸🇴 Somalia
                  </div>

                  <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                    <ShieldCheck
                      size={15}
                      className="mr-1 inline"
                    />
                    Secure
                  </div>

                  <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                    Digital Services
                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  scrollTo("services")
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-[#0B3D91] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                {t.exploreServices}

                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">

                  <img
                    src={SOMALIA_LOGO}
                    alt="Somalia"
                    className="h-11 w-11 object-contain"
                    onError={
                      getImageFallback
                    }
                  />

                </div>

                <div>

                  <p className="font-black text-[#0B3D91]">
                    FEDERAL REPUBLIC
                  </p>

                  <p className="text-xs font-semibold tracking-[0.15em] text-slate-500">
                    OF SOMALIA
                  </p>

                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                {t.footerDescription}
              </p>

            </div>

            {/* QUICK LINKS */}

            <div>

              <h3 className="font-black text-slate-900">
                {t.quickLinks}
              </h3>

              <div className="mt-4 space-y-3">

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("services")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.services}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("ministries")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.ministries}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("agencies")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.agencies}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("events")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.events}
                </button>

              </div>

            </div>

            {/* GOVERNMENT */}

            <div>

              <h3 className="font-black text-slate-900">
                {t.government}
              </h3>

              <div className="mt-4 space-y-3">

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("leadership")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.leadership}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("ministries")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.federalMinistries}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("agencies")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.nationalAgencies}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("emergency")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.emergency}
                </button>

              </div>

            </div>

            {/* SUPPORT */}

            <div>

              <h3 className="font-black text-slate-900">
                {t.support}
              </h3>

              <div className="mt-4 space-y-3">

                <button
                  type="button"
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.privacy}
                </button>

                <button
                  type="button"
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.terms}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollTo("emergency")
                  }
                  className="block text-sm text-slate-500 hover:text-[#0B3D91]"
                >
                  {t.contact}
                </button>

                {!user && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/register")
                    }
                    className="block text-sm font-bold text-[#0B3D91]"
                  >
                    {t.register}
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* COPYRIGHT */}

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()}{" "}
              Federal Republic of Somalia.{" "}
              {t.rights}
            </p>

            <div className="flex items-center gap-2">

              <Star
                size={15}
                className="fill-current text-blue-500"
              />

              <span>
                {language === "so"
                  ? "Nabad, Horumar iyo Barwaaqo"
                  : "Peace, Progress, and Prosperity"}
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}