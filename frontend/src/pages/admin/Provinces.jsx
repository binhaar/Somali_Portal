import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Loader2,
  CheckCircle2,
  Map,
  MapPin,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function Provinces() {
  const [provinces, setProvinces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    capital_en: "",
    capital_so: "",
    is_active: true,
  });

  // --------------------------------------------------
  // LOAD PROVINCES
  // --------------------------------------------------

  const loadProvinces = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/provinces");

      const data =
        response.data?.provinces ||
        response.data?.data ||
        response.data ||
        [];

      setProvinces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load provinces error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load provinces."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvinces();
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
      capital_en: "",
      capital_so: "",
      is_active: true,
    });

    setEditingProvince(null);
  };

  // --------------------------------------------------
  // OPEN ADD MODAL
  // --------------------------------------------------

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT MODAL
  // --------------------------------------------------

  const openEditModal = (province) => {
    setEditingProvince(province);

    setForm({
      name_en: province.name_en || "",
      name_so: province.name_so || "",
      description_en:
        province.description_en || "",
      description_so:
        province.description_so || "",
      capital_en: province.capital_en || "",
      capital_so: province.capital_so || "",
      is_active:
        province.is_active !== false,
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
  // HANDLE FORM CHANGE
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
  // SAVE PROVINCE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name_en.trim()) {
      setError(
        "English province name is required."
      );
      return;
    }

    if (!form.name_so.trim()) {
      setError(
        "Somali province name is required."
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
        capital_en:
          form.capital_en.trim(),
        capital_so:
          form.capital_so.trim(),
        is_active: form.is_active,
      };

      if (editingProvince) {
        await api.put(
          `/provinces/${editingProvince._id}`,
          payload
        );

        setSuccess(
          "Province updated successfully."
        );
      } else {
        await api.post(
          "/provinces",
          payload
        );

        setSuccess(
          "Province created successfully."
        );
      }

      await loadProvinces();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(
        "Save province error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save province."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (province) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${province.name_en}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/provinces/${province._id}`
      );

      setSuccess(
        "Province deleted successfully."
      );

      await loadProvinces();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Delete province error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete province."
      );
    }
  };

  // --------------------------------------------------
  // TOGGLE STATUS
  // --------------------------------------------------

  const handleToggle = async (province) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/provinces/${province._id}/toggle`
      );

      setSuccess(
        province.is_active
          ? "Province deactivated."
          : "Province activated."
      );

      await loadProvinces();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(
        "Toggle province error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update province status."
      );
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredProvinces = useMemo(() => {
    const value =
      search.toLowerCase().trim();

    if (!value) {
      return provinces;
    }

    return provinces.filter((province) => {
      const text = [
        province.name_en,
        province.name_so,
        province.capital_en,
        province.capital_so,
        province.description_en,
        province.description_so,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [provinces, search]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const totalCount = provinces.length;

  const activeCount = provinces.filter(
    (province) => province.is_active
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

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Map size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Provinces
            </h1>

            <p className="text-sm text-slate-500">
              Manage administrative provinces
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
          Add Province
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

        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Provinces
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Map size={21} />
            </div>

          </div>

        </div>

        {/* ACTIVE */}

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

        {/* INACTIVE */}

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
            placeholder="Search provinces..."
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

          <table className="min-w-[900px] w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Province
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Somali Name
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Capital
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
                        Loading provinces...
                      </span>

                    </div>

                  </td>

                </tr>
              ) : filteredProvinces.length === 0 ? (
                <tr>

                  <td
                    colSpan="5"
                    className="px-5 py-12"
                  >

                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
                        <Map size={25} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No provinces found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or add a new province.
                      </p>

                    </div>

                  </td>

                </tr>
              ) : (
                filteredProvinces.map(
                  (province) => (
                    <tr
                      key={province._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* PROVINCE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                            <MapPin size={19} />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-800">
                              {province.name_en}
                            </p>

                            {province.description_en && (
                              <p className="mt-0.5 max-w-[270px] truncate text-xs text-slate-500">
                                {
                                  province.description_en
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* SOMALI */}

                      <td className="px-5 py-4">

                        <span className="font-medium text-slate-700">
                          {province.name_so}
                        </span>

                      </td>

                      {/* CAPITAL */}

                      <td className="px-5 py-4">

                        <div>

                          <p className="font-medium text-slate-700">
                            {province.capital_en ||
                              "Not provided"}
                          </p>

                          {province.capital_so && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {
                                province.capital_so
                              }
                            </p>
                          )}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {province.is_active ? (
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
                                province
                              )
                            }
                            title={
                              province.is_active
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
                                province
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
                                province
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

            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Map size={19} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingProvince
                      ? "Edit Province"
                      : "Add Province"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {editingProvince
                      ? "Update province information"
                      : "Create a new province"}
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
                      Province Name (English)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_en"
                      value={form.name_en}
                      onChange={handleChange}
                      placeholder="Banaadir"
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
                      Province Name (Somali)
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_so"
                      value={form.name_so}
                      onChange={handleChange}
                      placeholder="Banaadir"
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

                  {/* CAPITAL ENGLISH */}

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Capital (English)
                    </label>

                    <div className="relative">

                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="capital_en"
                        value={
                          form.capital_en
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Mogadishu"
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

                  {/* CAPITAL SOMALI */}

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Capital (Somali)
                    </label>

                    <div className="relative">

                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="capital_so"
                        value={
                          form.capital_so
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Muqdisho"
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

                  {/* DESCRIPTION ENGLISH */}

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
                      placeholder="Province description..."
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
                      value={
                        form.description_so
                      }
                      onChange={
                        handleChange
                      }
                      rows={3}
                      placeholder="Sharaxaadda gobolka..."
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

                  {/* STATUS */}

                  <div className="md:col-span-2">

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <div>

                        <p className="text-sm font-semibold text-slate-700">
                          Active Province
                        </p>

                        <p className="text-xs text-slate-500">
                          Show this province on the portal.
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
                      <CheckCircle2 size={17} />

                      {editingProvince
                        ? "Save Changes"
                        : "Save Province"}
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

export default Provinces;