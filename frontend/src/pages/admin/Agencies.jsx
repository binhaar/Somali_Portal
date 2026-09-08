import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Loader2,
  ExternalLink,
  Building2,
  Globe,
  CheckCircle2,
  Landmark,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [ministries, setMinistries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    logo: "",
    website_url: "",
    ministry: "",
    is_active: true,
  });

  // --------------------------------------------------
  // LOAD AGENCIES + MINISTRIES
  // --------------------------------------------------

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [agencyResponse, ministryResponse] =
        await Promise.all([
          api.get("/agencies"),
          api.get("/ministries"),
        ]);

      const agencyData =
        agencyResponse.data?.agencies ||
        agencyResponse.data?.data ||
        agencyResponse.data ||
        [];

      const ministryData =
        ministryResponse.data?.ministries ||
        ministryResponse.data?.data ||
        ministryResponse.data ||
        [];

      setAgencies(
        Array.isArray(agencyData)
          ? agencyData
          : []
      );

      setMinistries(
        Array.isArray(ministryData)
          ? ministryData
          : []
      );
    } catch (err) {
      console.error("Load agencies error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load agencies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setForm({
      name_en: "",
      name_so: "",
      description_en: "",
      description_so: "",
      logo: "",
      website_url: "",
      ministry: "",
      is_active: true,
    });

    setEditingAgency(null);
  };

  // --------------------------------------------------
  // OPEN ADD
  // --------------------------------------------------

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const openEditModal = (agency) => {
    setEditingAgency(agency);

    const ministryId =
      typeof agency.ministry === "object"
        ? agency.ministry?._id
        : agency.ministry;

    setForm({
      name_en: agency.name_en || "",
      name_so: agency.name_so || "",
      description_en:
        agency.description_en || "",
      description_so:
        agency.description_so || "",
      logo: agency.logo || "",
      website_url:
        agency.website_url || "",
      ministry: ministryId || "",
      is_active:
        agency.is_active !== false,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // --------------------------------------------------
  // CLOSE MODAL
  // --------------------------------------------------

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
    setError("");
  };

  // --------------------------------------------------
  // CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // URL VALIDATION
  // --------------------------------------------------

  const isValidUrl = (value) => {
    if (!value) return true;

    try {
      const url = new URL(value);

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  // --------------------------------------------------
  // SAVE AGENCY
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name_en.trim()) {
      setError(
        "English agency name is required."
      );
      return;
    }

    if (!form.name_so.trim()) {
      setError(
        "Somali agency name is required."
      );
      return;
    }

    if (!form.ministry) {
      setError(
        "Please select a ministry."
      );
      return;
    }

    if (
      form.website_url.trim() &&
      !isValidUrl(
        form.website_url.trim()
      )
    ) {
      setError(
        "Website URL must start with http:// or https://."
      );
      return;
    }

    if (
      form.logo.trim() &&
      !isValidUrl(form.logo.trim())
    ) {
      setError(
        "Logo URL must start with http:// or https://."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name_en: form.name_en.trim(),
        name_so: form.name_so.trim(),
        description_en:
          form.description_en.trim(),
        description_so:
          form.description_so.trim(),
        logo: form.logo.trim(),
        website_url:
          form.website_url.trim(),
        ministry: form.ministry,
        is_active: form.is_active,
      };

      if (editingAgency) {
        await api.put(
          `/agencies/${editingAgency._id}`,
          payload
        );

        setSuccess(
          "Agency updated successfully."
        );
      } else {
        await api.post(
          "/agencies",
          payload
        );

        setSuccess(
          "Agency created successfully."
        );
      }

      await loadData();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(
        "Save agency error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save agency."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (agency) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${agency.name_en}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/agencies/${agency._id}`
      );

      setSuccess(
        "Agency deleted successfully."
      );

      await loadData();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Delete agency error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete agency."
      );
    }
  };

  // --------------------------------------------------
  // TOGGLE
  // --------------------------------------------------

  const handleToggle = async (agency) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/agencies/${agency._id}/toggle`
      );

      setSuccess(
        agency.is_active
          ? "Agency deactivated."
          : "Agency activated."
      );

      await loadData();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(
        "Toggle agency error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update agency status."
      );
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredAgencies = useMemo(() => {
    const value =
      search.toLowerCase().trim();

    if (!value) {
      return agencies;
    }

    return agencies.filter((agency) => {
      const ministryName =
        typeof agency.ministry === "object"
          ? `${agency.ministry?.name_en || ""} ${
              agency.ministry?.name_so || ""
            }`
          : "";

      const text = [
        agency.name_en,
        agency.name_so,
        agency.description_en,
        agency.description_so,
        agency.website_url,
        ministryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [agencies, search]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const totalCount = agencies.length;

  const activeCount = agencies.filter(
    (item) => item.is_active
  ).length;

  const inactiveCount =
    totalCount - activeCount;

  // --------------------------------------------------
  // GET MINISTRY NAME
  // --------------------------------------------------

  const getMinistryName = (agency) => {
    if (
      agency.ministry &&
      typeof agency.ministry === "object"
    ) {
      return (
        agency.ministry.name_en ||
        agency.ministry.name_so ||
        "Unknown Ministry"
      );
    }

    const ministry = ministries.find(
      (item) =>
        item._id === agency.ministry
    );

    return (
      ministry?.name_en ||
      "Unknown Ministry"
    );
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Building2 size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Agencies
            </h1>

            <p className="text-sm text-slate-500">
              Manage government agencies
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-700
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-green-800
            active:scale-[0.98]
          "
        >
          <Plus size={18} />
          Add Agency
        </button>

      </div>

      {/* SUCCESS */}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* ERROR */}

      {error && !showModal && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Agencies
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Building2 size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {activeCount}
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <CheckCircle2 size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Inactive
              </p>

              <p className="mt-1 text-2xl font-bold text-amber-600">
                {inactiveCount}
              </p>
            </div>

            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <Power size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* SEARCH */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search agencies..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-green-600
              focus:bg-white
              focus:ring-2
              focus:ring-green-100
            "
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[950px] w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Agency
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Somali Name
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ministry
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Website
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">

                      <Loader2
                        size={28}
                        className="animate-spin text-green-700"
                      />

                      <span className="text-sm">
                        Loading agencies...
                      </span>

                    </div>
                  </td>
                </tr>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12"
                  >
                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
                        <Building2 size={25} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No agencies found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or add a new agency.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgencies.map(
                  (agency) => (
                    <tr
                      key={agency._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* AGENCY */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50 text-green-700">

                            {agency.logo ? (
                              <img
                                src={agency.logo}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={(
                                  e
                                ) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <Building2
                                size={19}
                              />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-800">
                              {agency.name_en}
                            </p>

                            {agency.description_en && (
                              <p className="mt-0.5 max-w-[260px] truncate text-xs text-slate-500">
                                {
                                  agency.description_en
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* SOMALI */}

                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-700">
                          {agency.name_so}
                        </span>
                      </td>

                      {/* MINISTRY */}

                      <td className="px-5 py-4">

                        <div className="inline-flex items-center gap-2 text-sm text-slate-600">

                          <Landmark
                            size={15}
                            className="text-green-700"
                          />

                          {getMinistryName(
                            agency
                          )}

                        </div>

                      </td>

                      {/* WEBSITE */}

                      <td className="px-5 py-4">

                        {agency.website_url ? (
                          <a
                            href={
                              agency.website_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
                          >
                            <Globe
                              size={15}
                            />

                            Website

                            <ExternalLink
                              size={13}
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not provided
                          </span>
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {agency.is_active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

                            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />

                            Active

                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">

                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                            Inactive

                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                agency
                              )
                            }
                            title={
                              agency.is_active
                                ? "Deactivate"
                                : "Activate"
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-500
                              transition
                              hover:border-green-200
                              hover:bg-green-50
                              hover:text-green-700
                            "
                          >
                            <Power
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                agency
                              )
                            }
                            title="Edit"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-500
                              transition
                              hover:border-blue-200
                              hover:bg-blue-50
                              hover:text-blue-700
                            "
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                agency
                              )
                            }
                            title="Delete"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-500
                              transition
                              hover:border-red-200
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-3
            backdrop-blur-sm
            md:p-6
          "
        >

          <div
            className="
              flex
              max-h-[85vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Building2 size={19} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingAgency
                      ? "Edit Agency"
                      : "Add Agency"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {editingAgency
                      ? "Update agency information"
                      : "Create a new government agency"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >

              {/* SCROLL AREA */}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">

                {error && (
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>

                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* ENGLISH NAME */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Agency Name (English)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_en"
                      value={form.name_en}
                      onChange={handleChange}
                      placeholder="National Agency"
                      required
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3.5
                        text-sm
                        outline-none
                        transition
                        focus:border-green-600
                        focus:bg-white
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* SOMALI NAME */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Agency Name (Somali)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_so"
                      value={form.name_so}
                      onChange={handleChange}
                      placeholder="Hay'adda Qaranka"
                      required
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3.5
                        text-sm
                        outline-none
                        transition
                        focus:border-green-600
                        focus:bg-white
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* MINISTRY */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Ministry
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      name="ministry"
                      value={form.ministry}
                      onChange={handleChange}
                      required
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3.5
                        text-sm
                        outline-none
                        transition
                        focus:border-green-600
                        focus:bg-white
                        focus:ring-2
                        focus:ring-green-100
                      "
                    >

                      <option value="">
                        Select Ministry
                      </option>

                      {ministries
                        .filter(
                          (ministry) =>
                            ministry.is_active !==
                            false
                        )
                        .map(
                          (ministry) => (
                            <option
                              key={
                                ministry._id
                              }
                              value={
                                ministry._id
                              }
                            >
                              {
                                ministry.name_en
                              }
                            </option>
                          )
                        )}

                    </select>
                  </div>

                  {/* WEBSITE */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Website URL
                    </label>

                    <div className="relative">

                      <Globe
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="url"
                        name="website_url"
                        value={
                          form.website_url
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://agency.gov.so"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          pl-10
                          pr-3.5
                          text-sm
                          outline-none
                          transition
                          focus:border-green-600
                          focus:bg-white
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>
                  </div>

                  {/* DESCRIPTION EN */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Description (English)
                    </label>

                    <textarea
                      name="description_en"
                      value={
                        form.description_en
                      }
                      onChange={
                        handleChange
                      }
                      rows={3}
                      placeholder="Agency description..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3.5
                        py-2.5
                        text-sm
                        outline-none
                        transition
                        focus:border-green-600
                        focus:bg-white
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* DESCRIPTION SO */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Description (Somali)
                    </label>

                    <textarea
                      name="description_so"
                      value={
                        form.description_so
                      }
                      onChange={
                        handleChange
                      }
                      rows={3}
                      placeholder="Sharaxaadda hay'adda..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3.5
                        py-2.5
                        text-sm
                        outline-none
                        transition
                        focus:border-green-600
                        focus:bg-white
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* LOGO */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Logo URL
                    </label>

                    <div className="relative">

                      <ImageIcon
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="url"
                        name="logo"
                        value={form.logo}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          pl-10
                          pr-3.5
                          text-sm
                          outline-none
                          transition
                          focus:border-green-600
                          focus:bg-white
                          focus:ring-2
                          focus:ring-green-100
                        "
                      />

                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="flex items-end">

                    <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Active Agency
                        </p>

                        <p className="text-xs text-slate-500">
                          Show this agency on the portal.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="is_active"
                        checked={
                          form.is_active
                        }
                        onChange={
                          handleChange
                        }
                        className="h-5 w-5 accent-green-700"
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3 md:px-6">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-700
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-green-800
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={17}
                      />

                      {editingAgency
                        ? "Save Changes"
                        : "Save Agency"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Agencies;