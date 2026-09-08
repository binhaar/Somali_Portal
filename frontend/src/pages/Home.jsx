import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Globe2,
  Menu,
  Search,
  ShieldCheck,
  MapPin,
  Phone,
  ExternalLink,
  Landmark,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
  X,
  User,
  LogOut,
  ChevronDown,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/useAuth";

/* =========================================================
   FALLBACK SERVICES
========================================================= */

const fallbackServices = [
  {
    _id: "national-id",
    title_en: "National ID Card",
    title_so: "Kaarka Aqoonsiga Qaranka",
    description_en:
      "Apply for and access national identification services.",
    description_so:
      "Hel adeegyada la xiriira aqoonsiga qaranka.",
    icon: "id",
    external_url: "https://www.somalia.gov.so/",
  },
  {
    _id: "certificate",
    title_en: "High School Certificate",
    title_so: "Shahaadada Dugsiga Sare",
    description_en:
      "Access secondary education certificate services.",
    description_so:
      "Hel adeegyada shahaadada dugsiga sare.",
    icon: "education",
    external_url: "https://www.somalia.gov.so/",
  },
  {
    _id: "business",
    title_en: "Business Registration",
    title_so: "Diiwaangelinta Ganacsiga",
    description_en:
      "Register and manage business-related services.",
    description_so:
      "Diiwaangeli oo maamul adeegyada ganacsiga.",
    icon: "business",
    external_url: "https://www.somalia.gov.so/",
  },
  {
    _id: "exam",
    title_en: "Check Exam Results",
    title_so: "Hubi Natiijada Imtixaanka",
    description_en:
      "Check official examination results.",
    description_so:
      "Hubi natiijooyinka imtixaannada rasmiga ah.",
    icon: "exam",
    external_url: "https://www.somalia.gov.so/",
  },
];

/* =========================================================
   FALLBACK EMERGENCY CONTACTS
========================================================= */

const fallbackHelp = [
  {
    name_en: "Police",
    name_so: "Booliska",
    phone: "991",
  },
  {
    name_en: "Fire Department",
    name_so: "Dab-damiska",
    phone: "552",
  },
  {
    name_en: "National Emergency",
    name_so: "Gargaarka Degdegga ah",
    phone: "449",
  },
];

/* =========================================================
   SOMALIA COAT OF ARMS
========================================================= */

const SOMALIA_LOGO =
  "https://somaliagov.netlify.app/logos/coat-of-arms.png";

/* =========================================================
   HELPERS
========================================================= */

function getList(result) {
  if (!result) return [];

  const data = result.value?.data;

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.services)) {
    return data.services;
  }

  if (Array.isArray(data?.ministries)) {
    return data.ministries;
  }

  if (Array.isArray(data?.agencies)) {
    return data.agencies;
  }

  if (Array.isArray(data?.events)) {
    return data.events;
  }

  if (Array.isArray(data?.contacts)) {
    return data.contacts;
  }

  return [];
}

function getText(item, type, language) {
  if (!item) return "";

  if (type === "service") {
    return language === "so"
      ? item.title_so || item.title_en
      : item.title_en || item.title_so;
  }

  if (type === "ministry") {
    return language === "so"
      ? item.name_so || item.name_en
      : item.name_en || item.name_so;
  }

  if (type === "agency") {
    return language === "so"
      ? item.name_so || item.name_en
      : item.name_en || item.name_so;
  }

  if (type === "event") {
    return language === "so"
      ? item.title_so || item.title_en
      : item.title_en || item.title_so;
  }

  return "";
}

/* =========================================================
   SERVICE ICON
========================================================= */

function IconForService({ icon }) {
  const value = String(icon || "").toLowerCase();

  if (
    value.includes("education") ||
    value.includes("exam")
  ) {
    return <GraduationCap size={25} />;
  }

  if (value.includes("business")) {
    return <BriefcaseBusiness size={25} />;
  }

  if (value.includes("id")) {
    return <ShieldCheck size={25} />;
  }

  return <FileText size={25} />;
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [language, setLanguage] = useState("en");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [services, setServices] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [events, setEvents] = useState([]);
  const [emergencyContacts, setEmergencyContacts] =
    useState([]);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      const results = await Promise.allSettled([
        api.get("/services"),
        api.get("/ministries"),
        api.get("/agencies"),
        api.get("/events"),
        api.get("/emergency-contacts"),
      ]);

      const serviceData = getList(results[0]);

      setServices(
        serviceData.length
          ? serviceData
          : fallbackServices
      );

      setMinistries(getList(results[1]));
      setAgencies(getList(results[2]));
      setEvents(getList(results[3]));

      const contacts = getList(results[4]);

      setEmergencyContacts(
        contacts.length
          ? contacts
          : fallbackHelp
      );
    };

    loadData();
  }, []);

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const t = {
    en: {
      home: "Home",
      services: "Services",
      government: "Government",
      executive: "Agencies",

      officialPortal:
        "Official Portal of the Federal Government",

      heroTitle:
        "Federal Republic of Somalia",

      heroSubtitle:
        "Peace, Progress, and Prosperity.",

      heroText:
        "Find information about government services, ministries, national agencies, and institutions of the Federal Republic of Somalia.",

      search:
        "Search for services, ministries, or documents...",

      popular:
        "Popular:",

      passport: "Passport",
      visa: "Visa",
      jobs: "Jobs",
      tender: "Tender",

      featured: "Featured Government Services",

      featuredText:
        "Access important government services from one place.",

      ministries:
        "Federal Ministries",

      ministriesText:
        "Explore the ministries of the Federal Government of Somalia.",

      events:
        "Important National Dates",

      agencies:
        "National Agencies",

      agenciesText:
        "Explore Somalia's national government agencies.",

      help:
        "Emergency Contacts",

      visit:
        "Visit",

      noResults:
        "No results found.",

      footerText:
        "Official information and digital government services of the Federal Republic of Somalia.",

      register:
        "Register",

      login:
        "Login",

      logout:
        "Logout",

      dashboard:
        "Dashboard",

      citizen:
        "Citizen",

      visitor:
        "Visitor",

      admin:
        "Administrator",

      account:
        "My Account",

      calendar:
        "Calendar",

      government:
        "Government",

      emergency:
        "Emergency",

      federalGovernment:
        "Federal Government",

      republic:
        "Republic of Somalia",
    },

    so: {
      home: "Bogga Hore",

      services:
        "Adeegyada",

      government:
        "Dowladda",

      executive:
        "Hay'adaha",

      officialPortal:
        "Bogga Rasmiga ah ee Dowladda Federaalka",

      heroTitle:
        "Jamhuuriyadda Federaalka Soomaaliya",

      heroSubtitle:
        "Nabad, Horumar iyo Barwaaqo.",

      heroText:
        "Ka hel macluumaad ku saabsan adeegyada dowladda, wasaaradaha, hay'adaha qaranka iyo xarumaha Dowladda Federaalka Soomaaliya.",

      search:
        "Raadi adeegyo, wasaarado ama dukumiintiyo...",

      popular:
        "Caanka ah:",

      passport:
        "Baasaboor",

      visa:
        "Fiiso",

      jobs:
        "Shaqooyin",

      tender:
        "Qandaraasyo",

      featured:
        "Adeegyada Muhiimka ah ee Dowladda",

      featuredText:
        "Hal meel ka hel adeegyada muhiimka ah ee dowladda.",

      ministries:
        "Wasaaradaha Dowladda Federaalka",

      ministriesText:
        "Baro wasaaradaha Dowladda Federaalka Soomaaliya.",

      events:
        "Maalmaha Muhiimka ah ee Qaranka",

      agencies:
        "Hay'adaha Qaranka",

      agenciesText:
        "Baro hay'adaha qaranka ee dowladda Soomaaliya.",

      help:
        "Xiriirrada Gurmadka Degdegga ah",

      visit:
        "Booqo",

      noResults:
        "Wax natiijo ah lama helin.",

      footerText:
        "Macluumaadka rasmiga ah iyo adeegyada dowladda ee Jamhuuriyadda Federaalka Soomaaliya.",

      register:
        "Isdiiwaangeli",

      login:
        "Gal",

      logout:
        "Ka Bax",

      dashboard:
        "Dashboard",

      citizen:
        "Muwaadin",

      visitor:
        "Booqde",

      admin:
        "Maamule",

      account:
        "Akoonkayga",

      calendar:
        "Jadwal",

      emergency:
        "Gurmad",

      federalGovernment:
        "Dowladda Federaalka",

      republic:
        "Jamhuuriyadda Soomaaliya",
    },
  }[language];

  /* =========================================================
     USER NAME
  ========================================================= */

  const getUserName = () => {
    if (!user) return "";

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      fullName ||
      user.username ||
      user.email ||
      "User"
    );
  };

  /* =========================================================
     USER ROLE
  ========================================================= */

  const getUserRole = () => {
    if (!user) return "";

    if (user.role === "ADMIN") {
      return t.admin;
    }

    if (user.role === "VISITOR") {
      return t.visitor;
    }

    return t.citizen;
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    setProfileMenu(false);
    setMobileMenu(false);

    await logout();

    navigate("/", {
      replace: true,
    });
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredResults = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return [];

    const result = [];

    services.forEach((item) => {
      const text =
        `${item.title_en || ""} ${
          item.title_so || ""
        }`.toLowerCase();

      if (text.includes(q)) {
        result.push({
          type: "service",
          item,
        });
      }
    });

    ministries.forEach((item) => {
      const text =
        `${item.name_en || ""} ${
          item.name_so || ""
        }`.toLowerCase();

      if (text.includes(q)) {
        result.push({
          type: "ministry",
          item,
        });
      }
    });

    agencies.forEach((item) => {
      const text =
        `${item.name_en || ""} ${
          item.name_so || ""
        }`.toLowerCase();

      if (text.includes(q)) {
        result.push({
          type: "agency",
          item,
        });
      }
    });

    return result.slice(0, 8);
  }, [
    search,
    services,
    ministries,
    agencies,
  ]);

  /* =========================================================
     SERVICE CLICK
  ========================================================= */

  const handleServiceClick = (service) => {
    if (!service?.external_url) return;

    try {
      const serviceUrl = new URL(
        service.external_url
      );

      if (
        serviceUrl.protocol !== "http:" &&
        serviceUrl.protocol !== "https:"
      ) {
        return;
      }

      if (isAuthenticated) {
        window.open(
          serviceUrl.href,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }

      sessionStorage.setItem(
        "pendingServiceUrl",
        serviceUrl.href
      );

      sessionStorage.setItem(
        "pendingServiceTitle",
        getText(
          service,
          "service",
          language
        )
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Invalid service URL:",
        error
      );
    }
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">

          {/* LOGO */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1687d4] p-1 shadow-sm">
              <img
                src={SOMALIA_LOGO}
                alt="Coat of Arms of Somalia"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-left">
              <div className="text-sm font-extrabold text-[#123b5d]">
                Federal Government
              </div>

              <div className="text-xs text-slate-500">
                Republic of Somalia
              </div>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-7 lg:flex">

            <a
              href="#home"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#1687d4]"
            >
              {t.home}
            </a>

            <a
              href="#services"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#1687d4]"
            >
              {t.services}
            </a>

            <a
              href="#ministries"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#1687d4]"
            >
              {t.government}
            </a>

            <a
              href="#agencies"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#1687d4]"
            >
              {t.executive}
            </a>

          </nav>

          {/* RIGHT SIDE */}

          <div className="hidden items-center gap-3 lg:flex">

            {/* LANGUAGE */}

            <button
              onClick={() =>
                setLanguage((prev) =>
                  prev === "en" ? "so" : "en"
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#1687d4] hover:text-[#1687d4]"
            >
              {language === "en"
                ? "SO"
                : "EN"}
            </button>

            {/* AUTHENTICATED USER */}

            {isAuthenticated && user ? (
              <div className="relative">

                <button
                  onClick={() =>
                    setProfileMenu(
                      (prev) => !prev
                    )
                  }
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-[#1687d4] hover:bg-[#f5fbff]"
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1687d4] text-white">
                    <User size={18} />
                  </div>

                  <div className="max-w-[150px] text-left">

                    <div className="truncate text-sm font-bold text-[#123b5d]">
                      {getUserName()}
                    </div>

                    <div className="text-xs text-slate-400">
                      {getUserRole()}
                    </div>

                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition ${
                      profileMenu
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* PROFILE DROPDOWN */}

                {profileMenu && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    <div className="border-b border-slate-100 bg-[#f5fbff] p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1687d4] text-white">
                          <User size={23} />
                        </div>

                        <div className="min-w-0">

                          <div className="truncate font-bold text-[#123b5d]">
                            {getUserName()}
                          </div>

                          <div className="mt-1 truncate text-xs text-slate-500">
                            {user.email}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-[#1687d4]">
                            {getUserRole()}
                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="p-2">

                      {user.role === "ADMIN" && (
                        <button
                          onClick={() => {
                            setProfileMenu(false);

                            navigate(
                              "/admin/dashboard"
                            );
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f5fbff] hover:text-[#1687d4]"
                        >
                          <ShieldCheck size={18} />

                          {t.dashboard}
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={18} />

                        {t.logout}
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ) : (
              <>
                <button
                  onClick={() =>
                    navigate("/login")
                  }
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#123b5d] transition hover:text-[#1687d4]"
                >
                  {t.login}
                </button>

                <button
                  onClick={() =>
                    navigate("/register")
                  }
                  className="rounded-lg bg-[#1687d4] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#096cad]"
                >
                  {t.register}
                </button>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}

          <button
            className="rounded-lg p-2 text-[#123b5d] lg:hidden"
            onClick={() =>
              setMobileMenu((prev) => !prev)
            }
          >
            {mobileMenu ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">

            <div className="flex flex-col gap-4">

              <a
                href="#home"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="font-semibold text-slate-700"
              >
                {t.home}
              </a>

              <a
                href="#services"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="font-semibold text-slate-700"
              >
                {t.services}
              </a>

              <a
                href="#ministries"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="font-semibold text-slate-700"
              >
                {t.government}
              </a>

              <a
                href="#agencies"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="font-semibold text-slate-700"
              >
                {t.executive}
              </a>

              {/* MOBILE LANGUAGE */}

              <button
                onClick={() =>
                  setLanguage((prev) =>
                    prev === "en"
                      ? "so"
                      : "en"
                  )
                }
                className="w-fit rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold"
              >
                {language === "en"
                  ? "SO"
                  : "EN"}
              </button>

              {/* MOBILE USER */}

              {isAuthenticated && user ? (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-[#f5fbff] p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1687d4] text-white">
                      <User size={20} />
                    </div>

                    <div className="min-w-0">

                      <div className="truncate font-bold text-[#123b5d]">
                        {getUserName()}
                      </div>

                      <div className="text-xs text-slate-500">
                        {user.email}
                      </div>

                      <div className="mt-1 text-xs font-bold text-[#1687d4]">
                        {getUserRole()}
                      </div>

                    </div>

                  </div>

                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => {
                        setMobileMenu(false);

                        navigate(
                          "/admin/dashboard"
                        );
                      }}
                      className="mt-4 flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#123b5d]"
                    >
                      <ShieldCheck size={18} />

                      {t.dashboard}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />

                    {t.logout}
                  </button>

                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      navigate("/login");
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-3 font-semibold"
                  >
                    {t.login}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      navigate("/register");
                    }}
                    className="rounded-lg bg-[#1687d4] px-4 py-3 font-semibold text-white"
                  >
                    {t.register}
                  </button>
                </>
              )}

            </div>

          </div>
        )}

      </header>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#eaf6ff] via-white to-[#d9efff]"
      >

        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#1687d4]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#1687d4]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* HERO LEFT */}

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1687d4]/20 bg-white px-4 py-2 text-sm font-bold text-[#1671b9] shadow-sm">

              <Globe2 size={17} />

              {t.officialPortal}

            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-[#123b5d] sm:text-5xl lg:text-6xl">

              {t.heroTitle}

            </h1>

            <p className="mt-5 text-xl font-bold text-[#1687d4]">
              {t.heroSubtitle}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {t.heroText}
            </p>

            {/* SEARCH */}

            <div className="relative mt-8 max-w-2xl">

              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-[#1687d4]/10">

                <div className="relative">

                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={21}
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder={t.search}
                    className="w-full rounded-xl border-0 bg-white px-14 py-4 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1687d4]/20"
                  />

                  <button
                    onClick={() => {}}
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xl bg-[#1687d4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#096cad] sm:block"
                  >
                    {language === "so"
                      ? "Raadi"
                      : "Search"}
                  </button>

                </div>

              </div>

              {/* SEARCH RESULTS */}

              {search && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">

                  {filteredResults.length ? (
                    filteredResults.map(
                      ({ type, item }) => (
                        <button
                          key={`${type}-${item._id}`}
                          onClick={() => {
                            if (
                              type ===
                              "service"
                            ) {
                              handleServiceClick(
                                item
                              );
                            }

                            setSearch("");
                          }}
                          className="flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left text-slate-900 transition last:border-0 hover:bg-[#f5fbff]"
                        >

                          <div>

                            <div className="font-semibold">
                              {getText(
                                item,
                                type,
                                language
                              )}
                            </div>

                            <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                              {type}
                            </div>

                          </div>

                          <ChevronRight
                            size={18}
                            className="text-[#1687d4]"
                          />

                        </button>
                      )
                    )
                  ) : (
                    <div className="px-5 py-5 text-slate-500">
                      {t.noResults}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* POPULAR */}

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">

              <span className="font-semibold text-slate-500">
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
                  onClick={() =>
                    setSearch(item)
                  }
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-[#1687d4] hover:text-[#1687d4]"
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          {/* HERO RIGHT — SOMALIA COAT OF ARMS */}

          <div className="relative flex min-h-[390px] items-center justify-center lg:min-h-[500px]">

            {/* BLUE CIRCLE */}

            <div className="absolute h-[310px] w-[310px] rounded-full bg-[#1687d4]/10 sm:h-[390px] sm:w-[390px]" />

            <div className="absolute h-[250px] w-[250px] rounded-full bg-white/80 shadow-xl ring-1 ring-[#1687d4]/10 sm:h-[320px] sm:w-[320px]" />

            {/* DECORATIVE STARS */}

            <Star
              size={24}
              className="absolute left-[12%] top-[18%] fill-[#1687d4] text-[#1687d4]"
            />

            <Star
              size={18}
              className="absolute right-[14%] top-[25%] fill-[#1687d4] text-[#1687d4]"
            />

            <Star
              size={16}
              className="absolute bottom-[22%] left-[20%] fill-[#1687d4] text-[#1687d4]"
            />

            {/* COAT OF ARMS */}

            <div className="relative z-10 flex h-[300px] w-[300px] items-center justify-center sm:h-[390px] sm:w-[390px]">

              <img
                src={SOMALIA_LOGO}
                alt="Coat of Arms of Somalia"
                className="w-[250px] object-contain drop-shadow-2xl sm:w-[330px]"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
      >

        <div className="mb-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#1687d4]">
            {t.services}
          </p>

          <h2 className="text-3xl font-black text-[#123b5d] md:text-4xl">
            {t.featured}
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            {t.featuredText}
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {(services.length
            ? services
            : fallbackServices
          )
            .slice(0, 8)
            .map((service) => (

              <button
                key={service._id}
                onClick={() =>
                  handleServiceClick(
                    service
                  )
                }
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1687d4]/30 hover:shadow-xl hover:shadow-[#1687d4]/10"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf6ff] text-[#1687d4] transition group-hover:bg-[#1687d4] group-hover:text-white">

                  <IconForService
                    icon={service.icon}
                  />

                </div>

                <h3 className="text-lg font-bold text-[#123b5d]">
                  {getText(
                    service,
                    "service",
                    language
                  )}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {language === "so"
                    ? service.description_so ||
                      service.description_en
                    : service.description_en ||
                      service.description_so}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#1687d4]">

                  {t.visit}

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />

                </div>

              </button>

            ))}

        </div>

      </section>

      {/* =====================================================
          MINISTRIES
      ===================================================== */}

      <section
        id="ministries"
        className="bg-[#f5faff] px-5 py-20 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#1687d4]">
              {t.government}
            </p>

            <h2 className="text-3xl font-black text-[#123b5d] md:text-4xl">
              {t.ministries}
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              {t.ministriesText}
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {ministries
              .slice(0, 6)
              .map((ministry) => (

                <div
                  key={ministry._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1687d4]/30 hover:shadow-lg"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf6ff] text-[#1687d4]">
                      <Building2 size={24} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold text-[#123b5d]">
                        {getText(
                          ministry,
                          "ministry",
                          language
                        )}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {language === "so"
                          ? ministry.description_so ||
                            ministry.description_en
                          : ministry.description_en ||
                            ministry.description_so}
                      </p>

                    </div>

                  </div>

                  {ministry.website_url && (
                    <a
                      href={
                        ministry.website_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1687d4] hover:text-[#096cad]"
                    >
                      {t.visit}

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}

                </div>

              ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          EVENTS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="mb-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#1687d4]">
            {t.calendar}
          </p>

          <h2 className="text-3xl font-black text-[#123b5d] md:text-4xl">
            {t.events}
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {events.slice(0, 6).map((event) => (

            <div
              key={event._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {event.image && (
                <img
                  src={event.image}
                  alt=""
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">

                <div className="flex items-center gap-2 text-sm font-semibold text-[#1687d4]">

                  <CalendarDays
                    size={17}
                  />

                  {event.startDate
                    ? new Date(
                        event.startDate
                      ).toLocaleDateString()
                    : ""}

                </div>

                <h3 className="mt-3 font-bold text-[#123b5d]">
                  {getText(
                    event,
                    "event",
                    language
                  )}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                  <MapPin size={16} />

                  {language === "so"
                    ? event.location_so ||
                      event.location_en
                    : event.location_en ||
                      event.location_so}

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
          NATIONAL AGENCIES
      ===================================================== */}

      <section
        id="agencies"
        className="bg-[#123b5d] px-5 py-20 text-white lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#75c8f5]">
              {t.federalGovernment}
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {t.agencies}
            </h2>

            <p className="mt-3 max-w-2xl text-white/60">
              {t.agenciesText}
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {agencies
              .slice(0, 6)
              .map((agency) => (

                <div
                  key={agency._id}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:bg-white/15"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Landmark size={23} />
                  </div>

                  <h3 className="mt-5 font-bold">
                    {getText(
                      agency,
                      "agency",
                      language
                    )}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {language === "so"
                      ? agency.description_so ||
                        agency.description_en
                      : agency.description_en ||
                        agency.description_so}
                  </p>

                  {agency.website_url && (
                    <a
                      href={
                        agency.website_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#75c8f5]"
                    >
                      {t.visit}

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}

                </div>

              ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          EMERGENCY
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="mb-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">
            {t.emergency}
          </p>

          <h2 className="text-3xl font-black text-[#123b5d] md:text-4xl">
            {t.help}
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {(emergencyContacts.length
            ? emergencyContacts
            : fallbackHelp
          )
            .slice(0, 3)
            .map((contact) => (

              <a
                key={
                  contact._id ||
                  contact.phone
                }
                href={`tel:${contact.phone}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-200 hover:shadow-lg"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Phone size={23} />
                  </div>

                  <div>

                    <h3 className="font-bold text-[#123b5d]">
                      {language === "so"
                        ? contact.name_so ||
                          contact.name_en
                        : contact.name_en ||
                          contact.name_so}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {t.emergency}
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-red-600">
                  {contact.phone}
                </span>

              </a>

            ))}

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#071c2c] px-5 py-12 text-white lg:px-8">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1687d4] p-1">

                <img
                  src={SOMALIA_LOGO}
                  alt="Coat of Arms of Somalia"
                  className="h-full w-full object-contain"
                />

              </div>

              <div>

                <div className="font-bold">
                  Federal Government of Somalia
                </div>

                <div className="text-sm text-white/50">
                  Republic of Somalia
                </div>

              </div>

            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
              {t.footerText}
            </p>

          </div>

          {/* SERVICES */}

          <div>

            <h3 className="font-bold">
              {t.services}
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/50">

              <a
                href="#services"
                className="transition hover:text-white"
              >
                {t.featured}
              </a>

              <a
                href="#ministries"
                className="transition hover:text-white"
              >
                {t.ministries}
              </a>

              <a
                href="#agencies"
                className="transition hover:text-white"
              >
                {t.agencies}
              </a>

            </div>

          </div>

          {/* ACCOUNT */}

          <div>

            <h3 className="font-bold">
              {isAuthenticated
                ? t.account
                : "Account"}
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/50">

              {isAuthenticated ? (
                <>
                  <div>
                    {getUserName()}
                  </div>

                  <div>
                    {user?.email}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left font-bold text-red-400"
                  >
                    <LogOut size={16} />

                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      navigate("/login")
                    }
                    className="text-left transition hover:text-white"
                  >
                    {t.login}
                  </button>

                  <button
                    onClick={() =>
                      navigate("/register")
                    }
                    className="text-left transition hover:text-white"
                  >
                    {t.register}
                  </button>
                </>
              )}

            </div>

          </div>

        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/40">

          © {new Date().getFullYear()} Federal Government of Somalia.

        </div>

      </footer>

    </div>
  );
}