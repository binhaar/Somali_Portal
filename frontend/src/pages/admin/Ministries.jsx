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

function Ministries() {
  const [ministries, setMinistries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    logo: "",
    website_url: "",
    is_active: true,
  });

  // --------------------------------------------------
  // LOAD MINISTRIES
  // --------------------------------------------------

  const loadMinistries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/ministries");

      const data =
        response.data?.ministries ||
        response.data?.data ||
        response.data ||
        [];

      setMinistries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load ministries error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load ministries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMinistries();
  }, []);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const resetForm = () => {
    setForm({
      name_en: "",
      name_so: "",
      description_en: "",
      description_so: "",
      logo: "",
      website_url: "",
      is_active: true,
    });

    setEditingMinistry(null);
  };

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (ministry) => {
    setEditingMinistry(ministry);

    setForm({
      name_en: ministry.name_en || "",
      name_so: ministry.name_so || "",
      description_en: ministry.description_en || "",
      description_so: ministry.description_so || "",
      logo: ministry.logo || "",
      website_url: ministry.website_url || "",
      is_active: ministry.is_active !== false,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------------
  // VALIDATE URL
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
  // SAVE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name_en.trim()) {
      setError("English ministry name is required.");
      return;
    }

    if (!form.name_so.trim()) {
      setError("Somali ministry name is required.");
      return;
    }

    if (
      form.website_url.trim() &&
      !isValidUrl(form.website_url.trim())
    ) {
      setError(
        "Website URL must start with http:// or https://."
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
        is_active: form.is_active,
      };

      if (editingMinistry) {
        await api.put(
          `/ministries/${editingMinistry._id}`,
          payload
        );

        setSuccess("Ministry updated successfully.");
      } else {
        await api.post("/ministries", payload);

        setSuccess("Ministry created successfully.");
      }

      await loadMinistries();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error("Save ministry error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save ministry."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (ministry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${ministry.name_en}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/ministries/${ministry._id}`
      );

      setSuccess("Ministry deleted successfully.");

      await loadMinistries();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error("Delete ministry error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete ministry."
      );
    }
  };

  // --------------------------------------------------
  // TOGGLE STATUS
  // --------------------------------------------------

  const handleToggle = async (ministry) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/ministries/${ministry._id}/toggle`
      );

      setSuccess(
        ministry.is_active
          ? "Ministry deactivated."
          : "Ministry activated."
      );

      await loadMinistries();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Toggle ministry error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update ministry status."
      );
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredMinistries = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return ministries;

    return ministries.filter((ministry) => {
      const text = [
        ministry.name_en,
        ministry.name_so,
        ministry.description_en,
        ministry.description_so,
        ministry.website_url,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [ministries, search]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const totalCount = ministries.length;

  const activeCount = ministries.filter(
    (item) => item.is_active
  ).length;

  const inactiveCount =
    totalCount - activeCount;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Landmark size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Ministries
              </h1>

              <p className="text-sm text-slate-500">
                Manage government ministries
              </p>
            </div>
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
          Add Ministry
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
                Total Ministries
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
            placeholder="Search ministries..."
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

          <table className="min-w-[850px] w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ministry
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Somali Name
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
                    colSpan="5"
                    className="px-5 py-12"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <Loader2
                        size={28}
                        className="animate-spin text-green-700"
                      />

                      <span className="text-sm">
                        Loading ministries...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredMinistries.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12"
                  >
                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
                        <Building2 size={25} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No ministries found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or add a new ministry.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredMinistries.map((ministry) => (
                  <tr
                    key={ministry._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* NAME */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50 text-green-700">

                          {ministry.logo ? (
                            <img
                              src={ministry.logo}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <Landmark size={19} />
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-slate-800">
                            {ministry.name_en}
                          </p>

                          {ministry.description_en && (
                            <p className="mt-0.5 max-w-[280px] truncate text-xs text-slate-500">
                              {ministry.description_en}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* SOMALI */}

                    <td className="px-5 py-4">

                      <span className="font-medium text-slate-700">
                        {ministry.name_so}
                      </span>

                    </td>

                    {/* WEBSITE */}

                    <td className="px-5 py-4">

                      {ministry.website_url ? (
                        <a
                          href={ministry.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
                        >
                          <Globe size={15} />

                          Website

                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not provided
                        </span>
                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      {ministry.is_active ? (
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
                            handleToggle(ministry)
                          }
                          title={
                            ministry.is_active
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
                          <Power size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(ministry)
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
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(ministry)
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
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
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

            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Landmark size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingMinistry
                      ? "Edit Ministry"
                      : "Add Ministry"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {editingMinistry
                      ? "Update ministry information"
                      : "Create a new government ministry"}
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

              {/* SCROLL BODY */}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">

                {/* MODAL ERROR */}

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
                      Ministry Name (English)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_en"
                      value={form.name_en}
                      onChange={handleChange}
                      placeholder="Ministry of Education"
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
                      Ministry Name (Somali)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_so"
                      value={form.name_so}
                      onChange={handleChange}
                      placeholder="Wasaaradda Waxbarashada"
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

                  {/* DESCRIPTION ENGLISH */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Description (English)
                    </label>

                    <textarea
                      name="description_en"
                      value={form.description_en}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ministry description..."
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

                  {/* DESCRIPTION SOMALI */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Description (Somali)
                    </label>

                    <textarea
                      name="description_so"
                      value={form.description_so}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Sharaxaadda wasaaradda..."
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
                        value={form.website_url}
                        onChange={handleChange}
                        placeholder="https://example.gov.so"
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

                  <div className="md:col-span-2">

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Status
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Active Ministry
                        </p>

                        <p className="text-xs text-slate-500">
                          Active ministries can be displayed on the public portal.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="h-5 w-5 accent-green-700"
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* FOOTER — ALWAYS VISIBLE */}

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
                      <CheckCircle2 size={17} />
                      {editingMinistry
                        ? "Save Changes"
                        : "Save Ministry"}
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

export default Ministries;