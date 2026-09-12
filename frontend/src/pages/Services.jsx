import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Search,
  BriefcaseBusiness,
  HeartPulse,
  GraduationCap,
  CreditCard,
  FileText,
  Landmark,
  Car,
  Plane,
  Building2,
  Users,
  ShieldCheck,
  Baby,
  Home as HomeIcon,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";

// =========================================================
// ICON MAP
// Same icons used by Admin Services
// =========================================================

const iconMap = {
  business: BriefcaseBusiness,
  health: HeartPulse,
  certificate: GraduationCap,
  education: GraduationCap,
  "id-card": CreditCard,
  document: FileText,
  finance: Landmark,
  car: Car,
  transport: Car,
  passport: Plane,
  building: Building2,
  users: Users,
  family: Users,
  security: ShieldCheck,
  child: Baby,
  housing: HomeIcon,
};

// =========================================================
// GET SERVICE ICON
// =========================================================

const getServiceIcon = (iconName) => {
  const key = String(iconName || "")
    .toLowerCase()
    .trim();

  return iconMap[key] || FileText;
};

// =========================================================
// SERVICES PAGE
// =========================================================

const Services = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD SERVICES
  // =========================================================

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services");

      const data =
        response.data?.services ??
        response.data?.data ??
        response.data ??
        [];

      setServices(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Load public services error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load government services."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadServices();
  }, []);

  // =========================================================
  // SERVICE TITLE
  // =========================================================

  const getServiceTitle = (service) => {
    return (
      service.title_en ||
      service.name_en ||
      service.title ||
      service.name ||
      "Government Service"
    );
  };

  // =========================================================
  // SOMALI TITLE
  // =========================================================

  const getSomaliTitle = (service) => {
    return (
      service.title_so ||
      service.name_so ||
      ""
    );
  };

  // =========================================================
  // DESCRIPTION
  // =========================================================

  const getServiceDescription = (service) => {
    return (
      service.description_en ||
      service.description_so ||
      service.description ||
      "Access this government service through the Somalia Government Portal."
    );
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const getCategoryName = (service) => {
    if (!service.category) {
      return "";
    }

    if (typeof service.category === "string") {
      return service.category;
    }

    return (
      service.category.name_en ||
      service.category.name_so ||
      service.category.name ||
      ""
    );
  };

  // =========================================================
  // MINISTRY
  // =========================================================

  const getMinistryName = (service) => {
    if (!service.ministry) {
      return "";
    }

    if (typeof service.ministry === "string") {
      return service.ministry;
    }

    return (
      service.ministry.name_en ||
      service.ministry.name_so ||
      service.ministry.name ||
      ""
    );
  };

  // =========================================================
  // EXTERNAL URL
  // =========================================================

  const getServiceUrl = (service) => {
    return (
      service.external_url ||
      service.externalUrl ||
      service.url ||
      service.link ||
      null
    );
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredServices =
    services.filter((service) => {
      const value =
        searchTerm.toLowerCase().trim();

      if (!value) {
        return true;
      }

      const title =
        getServiceTitle(service)
          .toLowerCase();

      const somaliTitle =
        getSomaliTitle(service)
          .toLowerCase();

      const description =
        getServiceDescription(service)
          .toLowerCase();

      const category =
        getCategoryName(service)
          .toLowerCase();

      const ministry =
        getMinistryName(service)
          .toLowerCase();

      return (
        title.includes(value) ||
        somaliTitle.includes(value) ||
        description.includes(value) ||
        category.includes(value) ||
        ministry.includes(value)
      );
    });

  // =========================================================
  // SERVICE CLICK
  // =========================================================
  //
  // User can see all services.
  //
  // Login is required only when selecting a service.
  // =========================================================

  const handleServiceClick = async (service) => {
    try {
      // Check authentication
      await api.get("/auth/me");

      // =====================================================
      // USER IS LOGGED IN
      // =====================================================

      const serviceUrl =
        getServiceUrl(service);

      if (serviceUrl) {
        try {
          const url = new URL(serviceUrl);

          if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
          ) {
            alert(
              "Invalid service URL."
            );

            return;
          }

          window.open(
            url.href,
            "_blank",
            "noopener,noreferrer"
          );

          return;
        } catch {
          alert(
            "Invalid service URL."
          );

          return;
        }
      }

      alert(
        "This service is currently unavailable online."
      );
    } catch (err) {
      // =====================================================
      // USER NOT LOGGED IN
      // =====================================================

      if (
        err.response?.status === 401
      ) {
        const serviceId =
          service._id ||
          service.id;

        // Save selected service
        localStorage.setItem(
          "pendingService",
          JSON.stringify(service)
        );

        if (serviceId) {
          localStorage.setItem(
            "pendingServiceId",
            String(serviceId)
          );
        }

        // Go to login
        navigate("/login", {
          state: {
            from: "/services",
            serviceId,
            service,
          },
        });

        return;
      }

      console.error(
        "Authentication check failed:",
        err
      );

      alert(
        "Something went wrong. Please try again."
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* HEADER */}

        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">

          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-7 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <HomeIcon size={18} />
              Back to Home
            </button>

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Government Services
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              Find and access government services
              available through the Somalia Government
              Portal.
            </p>

          </div>

        </section>

        {/* LOADING */}

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <Loader2
              size={42}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-gray-500">
              Loading services...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">

        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">

          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-7 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <HomeIcon size={18} />
              Back to Home
            </button>

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Government Services
            </h1>

          </div>

        </section>

        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center px-6">

          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <AlertCircle
              size={50}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to Load Services
            </h2>

            <p className="mt-3 text-gray-500">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={loadServices}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <HomeIcon size={18} />
                Home
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          {/* BACK HOME */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <HomeIcon size={18} />
            Back to Home
          </button>

          <div className="max-w-3xl">

            <div className="mb-4 flex items-center gap-2 text-blue-200">

              <BriefcaseBusiness size={24} />

              <span className="font-semibold">
                Government Services
              </span>

            </div>

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Government Services
            </h1>

            <p className="mt-4 text-lg leading-8 text-blue-100">
              Find and access government services
              available through the Somalia Government
              Portal.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              All Government Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredServices.length}{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}{" "}
              available
            </p>

          </div>

          {/* HOME */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <HomeIcon size={18} />
            Home
          </button>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-10">

          <div className="relative max-w-2xl">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search government services..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* =================================================
            SERVICE CARDS
        ================================================= */}

        {filteredServices.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <FileText
              size={48}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-5 text-xl font-bold text-gray-800">
              No Services Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try searching with a different keyword.
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredServices.map(
              (service) => {

                const serviceId =
                  service._id ||
                  service.id;

                const Icon =
                  getServiceIcon(
                    service.icon
                  );

                const category =
                  getCategoryName(
                    service
                  );

                const ministry =
                  getMinistryName(
                    service
                  );

                const serviceUrl =
                  getServiceUrl(
                    service
                  );

                return (

                  <div
                    key={serviceId}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">

                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-md ring-1 ring-blue-100">

                        <Icon
                          size={42}
                          strokeWidth={1.8}
                        />

                      </div>

                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="flex flex-1 flex-col p-6">

                      {/* CATEGORY */}

                      {category && (
                        <div className="mb-3">

                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {category}
                          </span>

                        </div>
                      )}

                      {/* TITLE */}

                      <h3 className="text-xl font-bold text-gray-900">
                        {getServiceTitle(
                          service
                        )}
                      </h3>

                      {/* SOMALI */}

                      {getSomaliTitle(
                        service
                      ) && (
                        <p className="mt-1 text-sm font-medium text-blue-700">
                          {getSomaliTitle(
                            service
                          )}
                        </p>
                      )}

                      {/* DESCRIPTION */}

                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                        {getServiceDescription(
                          service
                        )}
                      </p>

                      {/* MINISTRY */}

                      {ministry && (

                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">

                          <Building2
                            size={15}
                            className="text-gray-400"
                          />

                          <span>
                            {ministry}
                          </span>

                        </div>

                      )}

                      {/* =================================================
                          VIEW SERVICE
                      ================================================= */}

                      <button
                        type="button"
                        onClick={() =>
                          handleServiceClick(
                            service
                          )
                        }
                        className="mt-6 flex w-full items-center justify-between rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                      >

                        <span>
                          View Service
                        </span>

                        {serviceUrl ? (
                          <ExternalLink
                            size={18}
                          />
                        ) : (
                          <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        )}

                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </main>

    </div>
  );
};

export default Services;