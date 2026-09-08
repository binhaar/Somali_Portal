import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Briefcase,
  Folder,
  FolderTree,
  Building2,
  Map,
  Shield,
  Newspaper,
  CalendarDays,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
  ChevronDown,
  Globe,
  UserCircle,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/useAuth";

function AdminLayout() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Services",
      path: "/admin/services",
      icon: Briefcase,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: Folder,
    },
    {
      label: "Ministries",
      path: "/admin/ministries",
      icon: Building2,
    },
    {
      label: "Agencies",
      path: "/admin/agencies",
      icon: FolderTree,
    },
    {
      label: "Provinces",
      path: "/admin/provinces",
      icon: Map,
    },
    {
      label: "Cabinet",
      path: "/admin/cabinet",
      icon: UsersRound,
    },
    {
      label: "News",
      path: "/admin/news",
      icon: Newspaper,
    },
    {
      label: "Events",
      path: "/admin/events",
      icon: CalendarDays,
    },
    {
      label: "Emergency Contacts",
      path: "/admin/emergency-contacts",
      icon: PhoneCall,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setProfileOpen(false);
      setMobileOpen(false);
      navigate("/", {
        replace: true,
      });
    }
  };

  // ==========================================
  // CLOSE MOBILE SIDEBAR
  // ==========================================

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // ==========================================
  // SIDEBAR
  // ==========================================

  const Sidebar = () => {
    return (
      <aside
        className="
          h-full
          w-72
          bg-slate-950
          text-white
          flex
          flex-col
        "
      >
        {/* =====================================
            LOGO
        ===================================== */}

        <div
          className="
            h-20
            px-6
            flex
            items-center
            border-b
            border-white/10
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-emerald-600
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <Shield
                size={23}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight">
                Somalia Portal
              </h1>

              <p className="text-xs text-slate-400 mt-0.5">
                Administration
              </p>
            </div>

          </div>
        </div>

        {/* =====================================
            ADMIN PROFILE MINI CARD
        ===================================== */}

        <div className="px-4 pt-5">

          <div
            className="
              rounded-xl
              bg-white/5
              border
              border-white/10
              p-3
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-emerald-600
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <UserCircle
                  size={22}
                />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold truncate">
                  {user?.firstName || "Administrator"}{" "}
                  {user?.lastName || ""}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "Administrator"}
                </p>

              </div>

            </div>

            <div className="mt-3">

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-full
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  bg-emerald-500/10
                  text-emerald-400
                  border
                  border-emerald-500/20
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-emerald-400
                  "
                />

                Administrator
              </span>

            </div>

          </div>

        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            py-5
            space-y-1
          "
        >

          <p
            className="
              px-3
              mb-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Main Menu
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `
                    group
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-emerald-600
                          text-white
                          shadow-lg
                          shadow-emerald-950/30
                        `
                        : `
                          text-slate-300
                          hover:bg-white/5
                          hover:text-white
                        `
                    }
                  `
                }
              >

                <Icon
                  size={19}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <span className="truncate">
                  {item.label}
                </span>

              </NavLink>
            );
          })}

        </nav>

        {/* =====================================
            SIDEBAR FOOTER
        ===================================== */}

        <div
          className="
            p-4
            border-t
            border-white/10
          "
        >

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-xl
              text-sm
              font-medium
              text-red-300
              hover:bg-red-500/10
              hover:text-red-200
              transition
            "
          >

            <LogOut
              size={19}
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    );
  };

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================
          DESKTOP SIDEBAR
      ====================================== */}

      <div
        className="
          hidden
          lg:block
          fixed
          inset-y-0
          left-0
          z-40
        "
      >
        <Sidebar />
      </div>

      {/* ======================================
          MOBILE SIDEBAR OVERLAY
      ====================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="
              absolute
              inset-0
              bg-slate-950/60
              backdrop-blur-sm
            "
          />

          <div
            className="
              relative
              h-full
              w-72
              max-w-[85vw]
              shadow-2xl
            "
          >

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                absolute
                top-4
                right-[-48px]
                w-10
                h-10
                rounded-xl
                bg-white
                text-slate-700
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <X size={20} />
            </button>

            <Sidebar />

          </div>

        </div>
      )}

      {/* ======================================
          PAGE AREA
      ====================================== */}

      <div className="lg:ml-72 min-h-screen">

        {/* ====================================
            TOP BAR
        ==================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            h-20
            bg-white
            border-b
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              h-full
              px-4
              sm:px-6
              lg:px-8
              flex
              items-center
              justify-between
            "
          >

            {/* LEFT */}

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(true)
                }
                className="
                  lg:hidden
                  w-10
                  h-10
                  rounded-xl
                  border
                  border-slate-200
                  flex
                  items-center
                  justify-center
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                <Menu size={21} />
              </button>

              <div className="hidden sm:block">

                <p className="text-xs text-slate-500">
                  Government Administration
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  Admin Portal
                </h2>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2 sm:gap-3">

              {/* LANGUAGE */}

              <button
                type="button"
                className="
                  hidden
                  md:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-100
                "
              >
                <Globe size={17} />

                <span>
                  English
                </span>

                <ChevronDown size={15} />
              </button>

              {/* VIEW SITE */}

              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-100
                "
              >
                <ExternalLink size={17} />

                <span>
                  View Site
                </span>
              </button>

              {/* NOTIFICATIONS */}

              <button
                type="button"
                className="
                  relative
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-slate-600
                  hover:bg-slate-100
                "
              >

                <Bell size={20} />

                <span
                  className="
                    absolute
                    top-2
                    right-2
                    w-2
                    h-2
                    rounded-full
                    bg-red-500
                    ring-2
                    ring-white
                  "
                />

              </button>

              {/* PROFILE */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (previous) => !previous
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    p-1.5
                    rounded-xl
                    hover:bg-slate-100
                    transition
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-emerald-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-sm
                    "
                  >
                    {(
                      user?.firstName?.[0] ||
                      "A"
                    ).toUpperCase()}
                  </div>

                  <div className="hidden md:block text-left">

                    <p className="text-sm font-semibold text-slate-800">
                      {user?.firstName || "Admin"}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Administrator
                    </p>

                  </div>

                  <ChevronDown
                    size={16}
                    className="hidden md:block text-slate-400"
                  />

                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-14
                      w-60
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      shadow-xl
                      p-2
                    "
                  >

                    <div
                      className="
                        px-3
                        py-3
                        border-b
                        border-slate-100
                        mb-1
                      "
                    >

                      <p className="text-sm font-bold text-slate-900">
                        {user?.firstName || "Administrator"}{" "}
                        {user?.lastName || ""}
                      </p>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {user?.email || ""}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin/settings");
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-sm
                        text-slate-700
                        hover:bg-slate-50
                      "
                    >

                      <Settings size={17} />

                      Settings

                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-sm
                        text-red-600
                        hover:bg-red-50
                      "
                    >

                      <LogOut size={17} />

                      Logout

                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

        </header>

        {/* ====================================
            CONTENT
        ==================================== */}

        <main className="p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;