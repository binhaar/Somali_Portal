import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Loader2,
  ExternalLink,
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
  Home,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// ICONS
// ============================================================

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
  housing: Home,
};

const getServiceIcon = (iconName) => {
  const key = String(iconName || "")
    .toLowerCase()
    .trim();

  return iconMap[key] || FileText;
};

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  title_en: "",
  title_so: "",
  description_en: "",
  description_so: "",
  category: "",
  ministry: "",
  icon: "business",
  external_url: "",
  is_active: true,
};

// ============================================================
// SERVICES COMPONENT
// ============================================================

function Services() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ministries, setMinistries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    ...emptyForm,
  });

  // ==========================================================
  // LOAD SERVICES
  // ==========================================================

  const loadServices = async () => {
    try {
      const response = await api.get("/services/admin/all");

      const data =
        response.data?.services ??
        response.data?.data ??
        response.data ??
        [];

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load services error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load services."
      );
    }
  };

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");

      const data =
        response.data?.categories ??
        response.data?.data ??
        response.data ??
        [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load categories error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    }
  };

  // ==========================================================
  // LOAD MINISTRIES
  // ==========================================================

  const loadMinistries = async () => {
    try {
      const response = await api.get("/ministries");

      const data =
        response.data?.ministries ??
        response.data?.data ??
        response.data ??
        [];

      setMinistries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load ministries error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load ministries."
      );
    }
  };

  // ==========================================================
  // LOAD ALL DATA
  // ==========================================================

  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadServices(),
        loadCategories(),
        loadMinistries(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================================
  // BODY SCROLL CONTROL
  // ==========================================================

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // ==========================================================
  // HANDLE FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================================
  // OPEN ADD MODAL
  // ==========================================================

  const handleAddService = () => {
    setEditingService(null);

    setForm({
      ...emptyForm,
    });

    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const handleEditService = (service) => {
    setEditingService(service);

    setForm({
      title_en: service.title_en || "",
      title_so: service.title_so || "",
      description_en:
        service.description_en || "",
      description_so:
        service.description_so || "",

      category:
        service.category?._id ||
        service.category ||
        "",

      ministry:
        service.ministry?._id ||
        service.ministry ||
        "",

      icon:
        service.icon || "business",

      external_url:
        service.external_url || "",

      is_active:
        service.is_active ?? true,
    });

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingService(null);

    setForm({
      ...emptyForm,
    });
  };

  // ==========================================================
  // SUBMIT FORM
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------------

    if (!form.title_en.trim()) {
      alert("English service name is required.");
      return;
    }

    if (!form.title_so.trim()) {
      alert("Somali service name is required.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    if (!form.ministry) {
      alert("Please select a ministry.");
      return;
    }

    if (!form.external_url.trim()) {
      alert("Service URL is required.");
      return;
    }

    // --------------------------------------------------------
    // URL VALIDATION
    // --------------------------------------------------------

    try {
      const url = new URL(
        form.external_url.trim()
      );

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        alert(
          "Service URL must start with http:// or https://"
        );

        return;
      }
    } catch {
      alert("Please enter a valid service URL.");
      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      title_en: form.title_en.trim(),
      title_so: form.title_so.trim(),

      description_en:
        form.description_en.trim(),

      description_so:
        form.description_so.trim(),

      category: form.category,
      ministry: form.ministry,

      icon: form.icon,

      external_url:
        form.external_url.trim(),

      is_active: form.is_active,
    };

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    try {
      setSaving(true);

      if (editingService) {
        await api.put(
          `/services/${editingService._id}`,
          payload
        );

        alert(
          "Service updated successfully."
        );
      } else {
        await api.post(
          "/services",
          payload
        );

        alert(
          "Service created successfully."
        );
      }

      setShowModal(false);
      setEditingService(null);

      setForm({
        ...emptyForm,
      });

      await loadServices();
    } catch (error) {
      console.error(
        "Save service error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/services/${id}`
      );

      alert(
        "Service deleted successfully."
      );

      await loadServices();
    } catch (error) {
      console.error(
        "Delete service error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete service."
      );
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const handleToggle = async (id) => {
    try {
      await api.patch(
        `/services/${id}/toggle`
      );

      await loadServices();
    } catch (error) {
      console.error(
        "Toggle service error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change service status."
      );
    }
  };

  // ==========================================================
  // OPEN SERVICE
  // ==========================================================

  const handleOpenService = (url) => {
    if (!url) {
      return;
    }

    try {
      const serviceUrl = new URL(url);

      if (
        serviceUrl.protocol !== "http:" &&
        serviceUrl.protocol !== "https:"
      ) {
        return;
      }

      window.open(
        serviceUrl.href,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      alert("Invalid service URL.");
    }
  };

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredServices =
    services.filter((service) => {
      const value =
        search.toLowerCase().trim();

      if (!value) {
        return true;
      }

      return (
        service.title_en
          ?.toLowerCase()
          .includes(value) ||

        service.title_so
          ?.toLowerCase()
          .includes(value) ||

        service.description_en
          ?.toLowerCase()
          .includes(value) ||

        service.description_so
          ?.toLowerCase()
          .includes(value) ||

        service.category?.name_en
          ?.toLowerCase()
          .includes(value) ||

        service.category?.name_so
          ?.toLowerCase()
          .includes(value) ||

        service.ministry?.name_en
          ?.toLowerCase()
          .includes(value) ||

        service.ministry?.name_so
          ?.toLowerCase()
          .includes(value)
      );
    });

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalServices =
    services.length;

  const activeServices =
    services.filter(
      (service) =>
        service.is_active
    ).length;

  const inactiveServices =
    services.filter(
      (service) =>
        !service.is_active
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        "
      >

        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Government Services
          </h1>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Manage government services
            available to citizens.
          </p>
        </div>

        {/* ADD SERVICE */}

        <button
          type="button"
          onClick={handleAddService}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            h-11
            px-5
            rounded-xl
            bg-green-700
            hover:bg-green-800
            text-white
            text-sm
            font-semibold
            shadow-sm
            transition
          "
        >
          <Plus size={19} />

          Add Service
        </button>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-5
        "
      >

        {/* TOTAL */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Total Services
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-900
              mt-1
            "
          >
            {totalServices}
          </p>
        </div>

        {/* ACTIVE */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Active
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-green-700
              mt-1
            "
          >
            {activeServices}
          </p>
        </div>

        {/* INACTIVE */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Inactive
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-red-600
              mt-1
            "
          >
            {inactiveServices}
          </p>
        </div>

      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-xl
          p-3
          mb-5
        "
      >

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search services..."
            className="
              w-full
              h-11
              pl-10
              pr-4
              rounded-lg
              border
              border-slate-200
              bg-white
              text-sm
              outline-none
              focus:border-green-600
              focus:ring-2
              focus:ring-green-50
            "
          />

        </div>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-xl
          overflow-hidden
        "
      >

        {loading ? (
          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <Loader2
              size={32}
              className="
                animate-spin
                text-green-700
              "
            />

            <p
              className="
                text-sm
                text-slate-500
                mt-3
              "
            >
              Loading services...
            </p>

          </div>
        ) : filteredServices.length === 0 ? (
          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <FileText
              size={40}
              className="
                text-slate-300
              "
            />

            <p
              className="
                text-sm
                font-semibold
                text-slate-600
                mt-3
              "
            >
              No services found
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead
                className="
                  bg-slate-50
                  border-b
                  border-slate-200
                "
              >

                <tr>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Service
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Ministry
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      text-right
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredServices.map(
                  (service) => {
                    const Icon =
                      getServiceIcon(
                        service.icon
                      );

                    return (
                      <tr
                        key={
                          service._id
                        }
                        className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50
                          transition
                        "
                      >

                        {/* SERVICE */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-[240px]
                            "
                          >

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-green-50
                                text-green-700
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >
                              <Icon
                                size={20}
                              />
                            </div>

                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  font-semibold
                                  text-slate-900
                                  truncate
                                "
                              >
                                {
                                  service.title_en
                                }
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                  mt-1
                                  truncate
                                "
                              >
                                {
                                  service.title_so
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {
                            service.category
                              ?.name_en || "—"
                          }
                        </td>

                        {/* MINISTRY */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {
                            service.ministry
                              ?.name_en || "—"
                          }
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              text-sm
                              font-semibold
                              ${
                                service.is_active
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            `}
                          >

                            <span
                              className={`
                                w-2
                                h-2
                                rounded-full
                                ${
                                  service.is_active
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
                              `}
                            />

                            {service.is_active
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              justify-end
                              gap-2
                            "
                          >

                            {/* OPEN */}

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenService(
                                  service.external_url
                                )
                              }
                              title="Open service"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-slate-100
                                hover:bg-slate-200
                                text-slate-700
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >
                              <ExternalLink
                                size={16}
                              />
                            </button>

                            {/* TOGGLE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggle(
                                  service._id
                                )
                              }
                              title="Toggle status"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-green-50
                                hover:bg-green-100
                                text-green-700
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >
                              <Power
                                size={16}
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditService(
                                  service
                                )
                              }
                              title="Edit service"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-blue-50
                                hover:bg-blue-100
                                text-blue-700
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  service._id
                                )
                              }
                              title="Delete service"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-red-50
                                hover:bg-red-100
                                text-red-600
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="
            fixed
            top-[94px]
            left-0
            right-0
            bottom-0
            z-[99999]
            bg-slate-950/60
            backdrop-blur-sm
            flex
            items-start
            justify-center
            overflow-y-auto
            px-3
            sm:px-5
            py-5
          "
        >

          {/* ==================================================
              MODAL CARD
          ================================================== */}

          <div
            className="
              w-full
              max-w-[780px]
              h-[calc(100vh-135px)]
              min-h-[540px]
              max-h-[680px]
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
              flex
              flex-col
              border
              border-slate-200
            "
          >

            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div
              className="
                shrink-0
                h-[72px]
                px-5
                border-b
                border-slate-200
                bg-white
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    text-green-700
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  {editingService ? (
                    <Pencil size={19} />
                  ) : (
                    <Plus size={20} />
                  )}

                </div>

                <div className="min-w-0">

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                      truncate
                    "
                  >
                    {editingService
                      ? "Edit Government Service"
                      : "Add Government Service"}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >
                    {editingService
                      ? "Update service information"
                      : "Create a new government service"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  hover:bg-slate-100
                  hover:text-slate-900
                  transition
                  disabled:opacity-40
                  shrink-0
                "
              >
                <X size={21} />
              </button>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="
                flex
                flex-col
                flex-1
                min-h-0
              "
            >

              {/* ==================================================
                  SCROLLING BODY
              ================================================== */}

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  px-5
                  py-5
                "
              >

                {/* ==============================================
                    NAME
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                    mb-4
                  "
                >

                  {/* ENGLISH */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Service Name — English
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title_en"
                      value={form.title_en}
                      onChange={handleChange}
                      placeholder="Business Registration"
                      autoComplete="off"
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                  {/* SOMALI */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Service Name — Somali
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title_so"
                      value={form.title_so}
                      onChange={handleChange}
                      placeholder="Diiwaangelinta Ganacsiga"
                      autoComplete="off"
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                </div>

                {/* ==============================================
                    CATEGORY + MINISTRY
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                    mb-4
                  "
                >

                  {/* CATEGORY */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Category
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        text-slate-900
                        outline-none
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    >

                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category._id}
                            value={category._id}
                          >
                            {category.name_en}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* MINISTRY */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Ministry
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <select
                      name="ministry"
                      value={form.ministry}
                      onChange={handleChange}
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        text-slate-900
                        outline-none
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    >

                      <option value="">
                        Select ministry
                      </option>

                      {ministries.map(
                        (ministry) => (
                          <option
                            key={ministry._id}
                            value={ministry._id}
                          >
                            {ministry.name_en}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {/* ==============================================
                    URL
                ============================================== */}

                <div className="mb-4">

                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                      mb-1.5
                    "
                  >
                    Service URL
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <LinkIcon
                      size={17}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="url"
                      name="external_url"
                      value={form.external_url}
                      onChange={handleChange}
                      placeholder="https://service.gov.so"
                      autoComplete="off"
                      className="
                        w-full
                        h-11
                        pl-10
                        pr-3
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                  <p
                    className="
                      text-[11px]
                      text-slate-400
                      mt-1
                    "
                  >
                    Example: https://service.gov.so
                  </p>

                </div>

                {/* ==============================================
                    DESCRIPTIONS
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                    mb-4
                  "
                >

                  {/* ENGLISH */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Description — English
                    </label>

                    <textarea
                      name="description_en"
                      value={
                        form.description_en
                      }
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe the service..."
                      className="
                        w-full
                        px-3
                        py-2.5
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        resize-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                  {/* SOMALI */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Description — Somali
                    </label>

                    <textarea
                      name="description_so"
                      value={
                        form.description_so
                      }
                      onChange={handleChange}
                      rows={3}
                      placeholder="Sharax adeeggan..."
                      className="
                        w-full
                        px-3
                        py-2.5
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        resize-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                </div>

                {/* ==============================================
                    ICON + STATUS
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  {/* ICON */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Service Icon
                    </label>

                    <div
                      className="
                        flex
                        gap-2
                      "
                    >

                      <select
                        name="icon"
                        value={form.icon}
                        onChange={handleChange}
                        className="
                          flex-1
                          min-w-0
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          text-sm
                          text-slate-900
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-50
                        "
                      >

                        <option value="business">
                          Business
                        </option>

                        <option value="health">
                          Health
                        </option>

                        <option value="education">
                          Education
                        </option>

                        <option value="id-card">
                          ID Card
                        </option>

                        <option value="passport">
                          Passport
                        </option>

                        <option value="finance">
                          Finance
                        </option>

                        <option value="car">
                          Transport
                        </option>

                        <option value="building">
                          Building
                        </option>

                        <option value="users">
                          Users
                        </option>

                        <option value="security">
                          Security
                        </option>

                        <option value="child">
                          Child
                        </option>

                        <option value="housing">
                          Housing
                        </option>

                        <option value="document">
                          Document
                        </option>

                      </select>

                      {/* ICON PREVIEW */}

                      <div
                        className="
                          w-11
                          h-11
                          shrink-0
                          rounded-lg
                          border
                          border-green-200
                          bg-green-50
                          text-green-700
                          flex
                          items-center
                          justify-center
                        "
                      >

                        {(() => {
                          const PreviewIcon =
                            getServiceIcon(
                              form.icon
                            );

                          return (
                            <PreviewIcon
                              size={21}
                            />
                          );
                        })()}

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Status
                    </label>

                    <label
                      className="
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        flex
                        items-center
                        justify-between
                        cursor-pointer
                        hover:bg-slate-50
                        transition
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <div
                          className={`
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            ${
                              form.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          <Power size={16} />
                        </div>

                        <div>

                          <p
                            className="
                              text-xs
                              font-semibold
                              text-slate-800
                            "
                          >
                            {form.is_active
                              ? "Active"
                              : "Inactive"}
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-slate-400
                            "
                          >
                            {form.is_active
                              ? "Visible to citizens"
                              : "Hidden from citizens"}
                          </p>

                        </div>

                      </div>

                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="
                          w-4
                          h-4
                          accent-green-700
                        "
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div
                className="
                  shrink-0
                  h-[68px]
                  px-5
                  border-t
                  border-slate-200
                  bg-white
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <p
                  className="
                    hidden
                    sm:block
                    text-[11px]
                    text-slate-400
                  "
                >
                  <span className="text-red-500">
                    *
                  </span>{" "}
                  Required fields
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    ml-auto
                  "
                >

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="
                      h-10
                      px-5
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      text-sm
                      font-semibold
                      text-slate-700
                      hover:bg-slate-50
                      transition
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  {/* SAVE */}

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      h-10
                      min-w-[145px]
                      px-5
                      rounded-lg
                      bg-green-700
                      hover:bg-green-800
                      text-white
                      text-sm
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-sm
                      transition
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >

                    {saving ? (
                      <>
                        <Loader2
                          size={17}
                          className="
                            animate-spin
                          "
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={17}
                        />

                        {editingService
                          ? "Save Changes"
                          : "Save Service"}
                      </>
                    )}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Services;