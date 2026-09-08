import React, { useCallback, useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderTree,
  Globe2,
  Map,
  Newspaper,
  PhoneCall,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
  UsersRound,
  Briefcase,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";

function AdminDashboard() {
  // =========================================================
  // STATE
  // =========================================================

  const [statistics, setStatistics] = useState(null);

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const [statsResponse, recentResponse] =
        await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/recent"),
        ]);

      // =====================================================
      // STATISTICS
      // Backend response:
      //
      // {
      //   message: "...",
      //   statistics: {...}
      // }
      // =====================================================

      const stats =
        statsResponse?.data?.statistics || {};

      setStatistics(stats);

      // =====================================================
      // RECENT DATA
      //
      // Backend response:
      //
      // {
      //   message: "...",
      //   data: {
      //      recentUsers,
      //      recentServices,
      //      recentNews,
      //      recentEvents
      //   }
      // }
      // =====================================================

      const recent =
        recentResponse?.data?.data || {};

      setRecentUsers(
        Array.isArray(recent.recentUsers)
          ? recent.recentUsers
          : []
      );

      setRecentServices(
        Array.isArray(recent.recentServices)
          ? recent.recentServices
          : []
      );

      setRecentNews(
        Array.isArray(recent.recentNews)
          ? recent.recentNews
          : []
      );

      setRecentEvents(
        Array.isArray(recent.recentEvents)
          ? recent.recentEvents
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard data.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  // =========================================================
  // SAFE STATISTICS
  // =========================================================

  const users = statistics?.users || {};

  const services = statistics?.services || {};

  const categories =
    statistics?.categories || {};

  const ministries =
    statistics?.ministries || {};

  const agencies =
    statistics?.agencies || {};

  const provinces =
    statistics?.provinces || {};

  const cabinet =
    statistics?.cabinet || {};

  const news = statistics?.news || {};

  const events = statistics?.events || {};

  const emergencyContacts =
    statistics?.emergencyContacts || {};

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "N/A";
    }
  };

  // =========================================================
  // STAT CARD COMPONENT
  // =========================================================

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
  }) => {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-5
          shadow-sm
          hover:shadow-md
          transition
        "
      >
        <div className="flex items-start justify-between">

          <div className="min-w-0">

            <p
              className="
                text-sm
                font-medium
                text-slate-500
              "
            >
              {title}
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              {loading
                ? "..."
                : Number(value || 0).toLocaleString()}
            </h3>

            {subtitle && (
              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {subtitle}
              </p>
            )}

          </div>

          <div
            className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              ${iconBg}
              ${iconColor}
            `}
          >
            <Icon size={23} />
          </div>

        </div>
      </div>
    );
  };

  // =========================================================
  // MINI STATUS
  // =========================================================

  const StatusItem = ({
    label,
    active,
    total,
  }) => {
    return (
      <div
        className="
          flex
          items-center
          justify-between
          py-3
          border-b
          border-slate-100
          last:border-b-0
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-slate-100
              flex
              items-center
              justify-center
            "
          >
            <Activity
              size={17}
              className="text-slate-600"
            />
          </div>

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-slate-800
              "
            >
              {label}
            </p>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              {active || 0} active of{" "}
              {total || 0}
            </p>

          </div>

        </div>

        <span
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-emerald-600
          "
        >
          <span
            className="
              w-2
              h-2
              rounded-full
              bg-emerald-500
            "
          />

          Active
        </span>

      </div>
    );
  };

  // =========================================================
  // EMPTY STATE
  // =========================================================

  const EmptyState = ({
    message,
  }) => {
    return (
      <div
        className="
          py-10
          text-center
          text-sm
          text-slate-500
        "
      >
        {message}
      </div>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div>

            <div
              className="
                h-7
                w-56
                bg-slate-200
                rounded-lg
                animate-pulse
              "
            />

            <div
              className="
                mt-2
                h-4
                w-80
                max-w-full
                bg-slate-200
                rounded
                animate-pulse
              "
            />

          </div>

          <div
            className="
              h-10
              w-28
              bg-slate-200
              rounded-xl
              animate-pulse
            "
          />

        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-32
                bg-white
                border
                border-slate-200
                rounded-2xl
                animate-pulse
              "
            />
          ))}
        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !statistics) {
    return (
      <div className="space-y-6">

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-slate-900
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Manage and monitor the Somalia
            Government Portal.
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-red-200
            rounded-2xl
            p-8
            text-center
          "
        >

          <div
            className="
              mx-auto
              w-14
              h-14
              rounded-full
              bg-red-50
              text-red-600
              flex
              items-center
              justify-center
            "
          >
            <AlertCircle size={28} />
          </div>

          <h2
            className="
              mt-4
              text-lg
              font-bold
              text-slate-900
            "
          >
            Unable to load dashboard
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              max-w-lg
              mx-auto
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-emerald-600
              text-white
              text-sm
              font-semibold
              hover:bg-emerald-700
              transition
            "
          >
            <RefreshCw size={17} />

            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        <div>

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={25}
              className="text-emerald-600"
            />

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Admin Dashboard
            </h1>

          </div>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Monitor and manage the Somalia
            Government Portal.
          </p>

        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-slate-900
            text-white
            text-sm
            font-semibold
            hover:bg-slate-800
            disabled:opacity-60
            transition
          "
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* =====================================================
          ERROR NOTICE
      ===================================================== */}

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            bg-amber-50
            border
            border-amber-200
            rounded-xl
            p-4
          "
        >

          <AlertCircle
            size={20}
            className="
              text-amber-600
              shrink-0
              mt-0.5
            "
          />

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-amber-800
              "
            >
              Dashboard warning
            </p>

            <p
              className="
                text-xs
                text-amber-700
                mt-1
              "
            >
              {error}
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          PRIMARY STATISTICS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <StatCard
          title="Total Users"
          value={users.total}
          subtitle={`${users.citizens || 0} citizens • ${
            users.visitors || 0
          } visitors`}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Total Services"
          value={services.total}
          subtitle={`${services.active || 0} active`}
          icon={Briefcase}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Ministries"
          value={ministries.total}
          subtitle={`${ministries.active || 0} active`}
          icon={Building2}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />

        <StatCard
          title="Agencies"
          value={agencies.total}
          subtitle={`${agencies.active || 0} active`}
          icon={FolderTree}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />

      </div>

      {/* =====================================================
          SECONDARY STATISTICS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <StatCard
          title="Categories"
          value={categories.total}
          subtitle={`${categories.active || 0} active`}
          icon={FolderTree}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
        />

        <StatCard
          title="Provinces"
          value={provinces.total}
          subtitle={`${provinces.active || 0} active`}
          icon={Map}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="Cabinet Members"
          value={cabinet.total}
          subtitle={`${cabinet.active || 0} active`}
          icon={UsersRound}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
        />

        <StatCard
          title="Emergency Contacts"
          value={emergencyContacts.total}
          subtitle={`${emergencyContacts.active || 0} active`}
          icon={PhoneCall}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />

      </div>

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* ===================================================
            PORTAL OVERVIEW
        =================================================== */}

        <div
          className="
            xl:col-span-2
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Portal Overview
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Current content and system status
              </p>

            </div>

            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-emerald-50
                text-emerald-600
                flex
                items-center
                justify-center
              "
            >
              <Globe2 size={19} />
            </div>

          </div>

          <div className="px-5">

            <StatusItem
              label="Services"
              active={services.active}
              total={services.total}
            />

            <StatusItem
              label="Categories"
              active={categories.active}
              total={categories.total}
            />

            <StatusItem
              label="Ministries"
              active={ministries.active}
              total={ministries.total}
            />

            <StatusItem
              label="Agencies"
              active={agencies.active}
              total={agencies.total}
            />

            <StatusItem
              label="Provinces"
              active={provinces.active}
              total={provinces.total}
            />

            <StatusItem
              label="Cabinet"
              active={cabinet.active}
              total={cabinet.total}
            />

            <StatusItem
              label="Events"
              active={events.active}
              total={events.total}
            />

            <StatusItem
              label="Emergency Contacts"
              active={emergencyContacts.active}
              total={emergencyContacts.total}
            />

          </div>

        </div>

        {/* ===================================================
            USER OVERVIEW
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                  "
                >
                  User Overview
                </h2>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                  "
                >
                  Registered portal accounts
                </p>

              </div>

              <Users
                size={20}
                className="text-blue-600"
              />

            </div>

          </div>

          <div className="p-5 space-y-4">

            <div
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-xl
                bg-blue-50
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-blue-700
                  "
                >
                  Citizens
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-blue-900
                  "
                >
                  {users.citizens || 0}
                </p>

              </div>

              <Users
                size={25}
                className="text-blue-600"
              />

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-xl
                bg-violet-50
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-violet-700
                  "
                >
                  Visitors
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-violet-900
                  "
                >
                  {users.visitors || 0}
                </p>

              </div>

              <Globe2
                size={25}
                className="text-violet-600"
              />

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-xl
                bg-emerald-50
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-emerald-700
                  "
                >
                  Administrators
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-emerald-900
                  "
                >
                  {users.admins || 0}
                </p>

              </div>

              <ShieldCheck
                size={25}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          NEWS / EVENTS / SERVICES SUMMARY
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-emerald-50
                text-emerald-600
                flex
                items-center
                justify-center
              "
            >
              <Newspaper size={21} />
            </div>

            <TrendingUp
              size={18}
              className="text-emerald-500"
            />

          </div>

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Published News
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {news.published || 0}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {news.total || 0} total news items
          </p>

        </div>

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <CalendarDays size={21} />
            </div>

            <Clock3
              size={18}
              className="text-blue-500"
            />

          </div>

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Active Events
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {events.active || 0}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {events.total || 0} total events
          </p>

        </div>

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-violet-50
                text-violet-600
                flex
                items-center
                justify-center
              "
            >
              <Briefcase size={21} />
            </div>

            <CheckCircle2
              size={18}
              className="text-violet-500"
            />

          </div>

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Active Services
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {services.active || 0}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {services.total || 0} total services
          </p>

        </div>

      </div>

      {/* =====================================================
          RECENT DATA
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* ===================================================
            RECENT USERS
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Recent Users
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Latest registered accounts
              </p>

            </div>

            <Users
              size={19}
              className="text-blue-600"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {recentUsers.length === 0 ? (
              <EmptyState message="No users found." />
            ) : (
              recentUsers.map((item) => (
                <div
                  key={item._id}
                  className="
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-sm
                        shrink-0
                      "
                    >
                      {(
                        item.firstName?.[0] ||
                        item.username?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-800
                          truncate
                        "
                      >
                        {item.firstName || ""}{" "}
                        {item.lastName || ""}
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          truncate
                        "
                      >
                        {item.email || item.username}
                      </p>

                    </div>

                  </div>

                  <div className="text-right shrink-0">

                    <span
                      className="
                        inline-flex
                        px-2.5
                        py-1
                        rounded-full
                        bg-emerald-50
                        text-emerald-700
                        text-[10px]
                        font-bold
                        uppercase
                      "
                    >
                      {item.role || "USER"}
                    </span>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-slate-400
                      "
                    >
                      {formatDate(item.createdAt)}
                    </p>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

        {/* ===================================================
            RECENT SERVICES
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Recent Services
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Recently added government services
              </p>

            </div>

            <Briefcase
              size={19}
              className="text-emerald-600"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {recentServices.length === 0 ? (
              <EmptyState message="No services found." />
            ) : (
              recentServices.map((item) => (
                <div
                  key={item._id}
                  className="
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-emerald-50
                        text-emerald-600
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Briefcase size={18} />
                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-800
                          truncate
                        "
                      >
                        {item.title_en ||
                          item.title_so ||
                          "Service"}
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          truncate
                        "
                      >
                        {item.ministry?.name_en ||
                          item.ministry?.name_so ||
                          "Government Service"}
                      </p>

                    </div>

                  </div>

                  <div className="text-right shrink-0">

                    <span
                      className={`
                        inline-flex
                        px-2.5
                        py-1
                        rounded-full
                        text-[10px]
                        font-bold
                        uppercase
                        ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {item.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

        {/* ===================================================
            RECENT NEWS
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Recent News
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Latest portal news
              </p>

            </div>

            <Newspaper
              size={19}
              className="text-violet-600"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {recentNews.length === 0 ? (
              <EmptyState message="No news found." />
            ) : (
              recentNews.map((item) => (
                <div
                  key={item._id}
                  className="
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div className="min-w-0">

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        truncate
                      "
                    >
                      {item.title_en ||
                        item.title_so ||
                        "News"}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      {formatDate(
                        item.publishedAt ||
                          item.createdAt
                      )}
                    </p>

                  </div>

                  <span
                    className={`
                      shrink-0
                      px-2.5
                      py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      ${
                        item.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {item.is_published
                      ? "Published"
                      : "Draft"}
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

        {/* ===================================================
            RECENT EVENTS
        =================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Recent Events
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Latest government events
              </p>

            </div>

            <CalendarDays
              size={19}
              className="text-orange-600"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {recentEvents.length === 0 ? (
              <EmptyState message="No events found." />
            ) : (
              recentEvents.map((item) => (
                <div
                  key={item._id}
                  className="
                    px-5
                    py-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-orange-50
                        text-orange-600
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <CalendarDays size={18} />
                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-800
                          truncate
                        "
                      >
                        {item.title_en ||
                          item.title_so ||
                          "Event"}
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          truncate
                        "
                      >
                        {item.location_en ||
                          item.location_so ||
                          "Location not specified"}
                      </p>

                    </div>

                  </div>

                  <div className="text-right shrink-0">

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-700
                      "
                    >
                      {formatDate(item.startDate)}
                    </p>

                    <span
                      className={`
                        mt-1
                        inline-flex
                        px-2
                        py-0.5
                        rounded-full
                        text-[10px]
                        font-bold
                        ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {item.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div
        className="
          bg-slate-950
          rounded-2xl
          p-5
          sm:p-6
          text-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-500/20
                flex
                items-center
                justify-center
              "
            >
              <Server
                size={23}
                className="text-emerald-400"
              />
            </div>

            <div>

              <h2
                className="
                  text-base
                  font-bold
                "
              >
                System Status
              </h2>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1
                "
              >
                Somalia Government Portal services
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-500/20
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-emerald-400
                "
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-emerald-300
                "
              >
                API Online
              </span>

            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-500/20
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-emerald-400
                "
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-emerald-300
                "
              >
                Database Connected
              </span>

            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-500/20
              "
            >

              <CheckCircle2
                size={14}
                className="text-emerald-400"
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-emerald-300
                "
              >
                Portal Active
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;