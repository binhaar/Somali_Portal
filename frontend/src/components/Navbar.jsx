import React, { useState } from "react";
import {
  ChevronDown,
  Globe2,
  LogIn,
  LogOut,
  Menu,
  UserRound,
  X,
  LayoutDashboard,
  Landmark,
  BriefcaseBusiness,
  FileText,
  Building2,
  MapPinned,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SOMALIA_LOGO =
  "https://somaliagov.netlify.app/logos/coat-of-arms.png";

export default function Navbar({
  language = "en",
  setLanguage,
  user,
  logout,
  scrollTo,
  t,
  getImageFallback,
}) {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isSomali = language === "so";

  const labels = {
    en: {
      home: "Home",
      nation: "The Nation",
      government: "Government",
      services: "Services",
      contact: "Contact",
      constitution: "Constitution",
      vision: "National Vision 2060",
      memberStates: "Member States",
      executive: "Executive Leadership",
      ministries: "Federal Ministries",
      agencies: "National Agencies",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
      language: "Language",
    },
    so: {
      home: "Bogga Hore",
      nation: "Qaranka",
      government: "Dowladda",
      services: "Adeegyada",
      contact: "Xiriir",
      constitution: "Dastuurka",
      vision: "Himilada Qaranka 2060",
      memberStates: "Dowlad Goboleedyada",
      executive: "Hoggaanka Dowladda",
      ministries: "Wasaaradaha Federaalka",
      agencies: "Hay'adaha Qaranka",
      login: "Gal",
      register: "Isdiiwaangeli",
      dashboard: "Dashboard",
      logout: "Ka bax",
      language: "Luqad",
    },
  };

  const l = labels[language] || labels.en;

  const closeMenus = () => {
    setOpenMenu(null);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const handleScroll = (id) => {
    closeMenus();

    if (typeof scrollTo === "function") {
      scrollTo(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleHome = () => {
    closeMenus();

    if (window.location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  const handleLanguage = (value) => {
    if (typeof setLanguage === "function") {
      setLanguage(value);
    }

    closeMenus();
  };

  const handleLogout = async () => {
    closeMenus();

    if (typeof logout === "function") {
      await logout();
    }

    navigate("/");
  };

  const nationItems = [
    {
      label: l.constitution,
      icon: FileText,
      action: () => handleScroll("about"),
    },
    {
      label: l.vision,
      icon: Landmark,
      action: () => handleScroll("about"),
    },
    {
      label: l.memberStates,
      icon: MapPinned,
      action: () => handleScroll("agencies"),
    },
  ];

  const governmentItems = [
    {
      label: l.executive,
      icon: Landmark,
      action: () => handleScroll("leadership"),
    },
    {
      label: l.ministries,
      icon: Building2,
      action: () => handleScroll("ministries"),
    },
    {
      label: l.agencies,
      icon: BriefcaseBusiness,
      action: () => handleScroll("agencies"),
    },
  ];

  const renderDropdown = (menuName, items) => {
    if (openMenu !== menuName) return null;

    return (
      <div
        className="
          absolute
          left-0
          top-full
          z-50
          mt-3
          w-72
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-2
          shadow-2xl
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-blue-50
                hover:text-[#0B3D91]
              "
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0B3D91]">
                <Icon size={17} />
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* LOGO */}
          <button
            type="button"
            onClick={handleHome}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D91] p-1.5 shadow-md">
              <img
                src={SOMALIA_LOGO}
                alt="Federal Government of Somalia"
                className="h-full w-full object-contain"
                onError={getImageFallback}
              />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-black leading-tight text-[#0B3D91]">
                Federal Government
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {isSomali ? "Jamhuuriyadda Federaalka Soomaaliya" : "of Somalia"}
              </p>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">

            {/* HOME */}
            <button
              type="button"
              onClick={handleHome}
              className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-blue-50
                hover:text-[#0B3D91]
              "
            >
              {l.home}
            </button>

            {/* NATION */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu === "nation" ? null : "nation"
                  )
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  transition
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                {l.nation}
                <ChevronDown
                  size={15}
                  className={
                    openMenu === "nation"
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              {renderDropdown("nation", nationItems)}
            </div>

            {/* GOVERNMENT */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu === "government"
                      ? null
                      : "government"
                  )
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  transition
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                {l.government}
                <ChevronDown
                  size={15}
                  className={
                    openMenu === "government"
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              {renderDropdown(
                "government",
                governmentItems
              )}
            </div>

            {/* SERVICES */}
            <button
              type="button"
              onClick={() => handleScroll("services")}
              className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-blue-50
                hover:text-[#0B3D91]
              "
            >
              {l.services}
            </button>

            {/* CONTACT */}
            <button
              type="button"
              onClick={() => handleScroll("contact")}
              className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-blue-50
                hover:text-[#0B3D91]
              "
            >
              {l.contact}
            </button>

          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden items-center gap-2 lg:flex">

            {/* LANGUAGE */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu === "language"
                      ? null
                      : "language"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  transition
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                <Globe2 size={17} />
                {language === "so"
                  ? "SO"
                  : language === "ar"
                  ? "AR"
                  : "EN"}
                <ChevronDown size={14} />
              </button>

              {openMenu === "language" && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-50
                    mt-3
                    w-32
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                    shadow-2xl
                  "
                >
                  {[
                    ["en", "English"],
                    ["so", "Somali"],
                    ["ar", "Arabic"],
                  ].map(([code, name]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleLanguage(code)}
                      className={`
                        w-full
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-semibold
                        transition
                        ${
                          language === code
                            ? "bg-blue-50 text-[#0B3D91]"
                            : "text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AUTH */}
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-[#0B3D91]
                    transition
                    hover:bg-blue-50
                  "
                >
                  <LogIn size={17} />
                  {l.login}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="
                    rounded-xl
                    bg-[#0B3D91]
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#082f70]
                    hover:shadow-md
                  "
                >
                  {l.register}
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(!userMenuOpen)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-2
                    transition
                    hover:bg-blue-50
                  "
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#0B3D91]">
                    <UserRound size={18} />
                  </span>

                  <span className="max-w-[130px] truncate text-sm font-bold text-slate-700">
                    {user.firstName ||
                      user.username ||
                      "User"}
                  </span>

                  <ChevronDown
                    size={14}
                    className={
                      userMenuOpen
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-3
                      w-56
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-2
                      shadow-2xl
                    "
                  >
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="text-sm font-black text-slate-900">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : user.username}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    {user.role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => {
                          closeMenus();
                          navigate("/admin/dashboard");
                        }}
                        className="
                          mt-2
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-sm
                          font-bold
                          text-slate-700
                          transition
                          hover:bg-blue-50
                          hover:text-[#0B3D91]
                        "
                      >
                        <LayoutDashboard size={17} />
                        {l.dashboard}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-sm
                        font-bold
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={17} />
                      {l.logout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              text-slate-700
              transition
              hover:bg-blue-50
              hover:text-[#0B3D91]
              lg:hidden
            "
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="border-t border-slate-100 pb-5 pt-4 lg:hidden">

            <div className="space-y-1">

              <button
                type="button"
                onClick={handleHome}
                className="
                  flex
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                {l.home}
              </button>

              {/* MOBILE NATION */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === "mobileNation"
                        ? null
                        : "mobileNation"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    hover:bg-blue-50
                    hover:text-[#0B3D91]
                  "
                >
                  {l.nation}
                  <ChevronDown
                    size={16}
                    className={
                      openMenu === "mobileNation"
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                {openMenu === "mobileNation" && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2">
                    {nationItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          font-semibold
                          text-slate-600
                          hover:bg-blue-50
                          hover:text-[#0B3D91]
                        "
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* MOBILE GOVERNMENT */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === "mobileGovernment"
                        ? null
                        : "mobileGovernment"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    hover:bg-blue-50
                    hover:text-[#0B3D91]
                  "
                >
                  {l.government}
                  <ChevronDown
                    size={16}
                    className={
                      openMenu === "mobileGovernment"
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                {openMenu === "mobileGovernment" && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2">
                    {governmentItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          font-semibold
                          text-slate-600
                          hover:bg-blue-50
                          hover:text-[#0B3D91]
                        "
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleScroll("services")}
                className="
                  flex
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                {l.services}
              </button>

              <button
                type="button"
                onClick={() => handleScroll("contact")}
                className="
                  flex
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-blue-50
                  hover:text-[#0B3D91]
                "
              >
                {l.contact}
              </button>

            </div>

            {/* MOBILE LANGUAGE */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2 px-4 text-xs font-black uppercase tracking-wider text-slate-400">
                {l.language}
              </p>

              <div className="grid grid-cols-3 gap-2 px-4">
                {[
                  ["en", "English"],
                  ["so", "Somali"],
                  ["ar", "Arabic"],
                ].map(([code, name]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLanguage(code)}
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-2.5
                      text-xs
                      font-bold
                      transition
                      ${
                        language === code
                          ? "border-[#0B3D91] bg-blue-50 text-[#0B3D91]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE AUTH */}
            <div className="mt-4 grid gap-2 px-4 sm:grid-cols-2">

              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      navigate("/login");
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-[#0B3D91]
                      hover:bg-blue-50
                    "
                  >
                    <LogIn size={17} />
                    {l.login}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      navigate("/register");
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#0B3D91]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      hover:bg-[#082f70]
                    "
                  >
                    {l.register}
                  </button>
                </>
              ) : (
                <>
                  {user.role === "ADMIN" && (
                    <button
                      type="button"
                      onClick={() => {
                        closeMenus();
                        navigate("/admin/dashboard");
                      }}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-50
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-[#0B3D91]
                      "
                    >
                      <LayoutDashboard size={17} />
                      {l.dashboard}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-red-100
                      bg-red-50
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-red-600
                    "
                  >
                    <LogOut size={17} />
                    {l.logout}
                  </button>
                </>
              )}

            </div>

          </div>
        )}

      </div>
    </header>
  );
}
