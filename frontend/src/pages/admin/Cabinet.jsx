import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  X,
  RefreshCw,
  UsersRound,
  CheckCircle2,
  XCircle,
  Camera,
  ExternalLink,
  Building2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function Cabinet() {
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [form, setForm] = useState({
    name_en: "",
    name_so: "",
    position_en: "",
    position_so: "",
    description_en: "",
    description_so: "",
    photo: "",
    ministry: "",
    is_active: true,
  });

  // ==========================================
  // FETCH CABINET MEMBERS
  // ==========================================

  const fetchMembers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/cabinet/all");

      const data = response?.data;

      const list =
        data?.cabinetMembers ||
        data?.members ||
        data?.data ||
        [];

      setMembers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load cabinet members:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load cabinet members.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // FETCH MINISTRIES
  // ==========================================

  const fetchMinistries = useCallback(async () => {
    try {
      const response = await api.get("/ministries");

      const data = response?.data;

      const list =
        data?.ministries ||
        data?.data ||
        [];

      setMinistries(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load ministries:", err);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchMembers();
    fetchMinistries();
  }, [fetchMembers, fetchMinistries]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      name_en: "",
      name_so: "",
      position_en: "",
      position_so: "",
      description_en: "",
      description_so: "",
      photo: "",
      ministry: "",
      is_active: true,
    });

    setEditingMember(null);
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (member) => {
    setEditingMember(member);

    setForm({
      name_en: member?.name_en || "",
      name_so: member?.name_so || "",
      position_en: member?.position_en || "",
      position_so: member?.position_so || "",
      description_en: member?.description_en || "",
      description_so: member?.description_so || "",
      photo: member?.photo || "",
      ministry:
        member?.ministry?._id ||
        member?.ministry ||
        "",
      is_active:
        typeof member?.is_active === "boolean"
          ? member.is_active
          : true,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name_en.trim()) {
      setError("English name is required.");
      return;
    }

    if (!form.name_so.trim()) {
      setError("Somali name is required.");
      return;
    }

    if (!form.position_en.trim()) {
      setError("English position is required.");
      return;
    }

    if (!form.position_so.trim()) {
      setError("Somali position is required.");
      return;
    }

    if (!form.ministry) {
      setError("Please select a ministry.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name_en: form.name_en.trim(),
        name_so: form.name_so.trim(),
        position_en: form.position_en.trim(),
        position_so: form.position_so.trim(),
        description_en: form.description_en.trim(),
        description_so: form.description_so.trim(),
        photo: form.photo.trim(),
        ministry: form.ministry,
        is_active: form.is_active,
      };

      if (editingMember) {
        await api.put(
          `/cabinet/${editingMember._id}`,
          payload
        );

        setSuccess("Cabinet member updated successfully.");
      } else {
        await api.post("/cabinet", payload);

        setSuccess("Cabinet member created successfully.");
      }

      setShowModal(false);
      resetForm();

      await fetchMembers(true);
    } catch (err) {
      console.error("Cabinet save error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save cabinet member.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        member?.name_en || "this cabinet member"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(member._id);
      setError("");
      setSuccess("");

      await api.delete(`/cabinet/${member._id}`);

      setSuccess("Cabinet member deleted successfully.");

      await fetchMembers(true);
    } catch (err) {
      console.error("Delete cabinet member error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete cabinet member.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleToggle = async (member) => {
    try {
      setTogglingId(member._id);
      setError("");
      setSuccess("");

      await api.patch(
        `/cabinet/${member._id}/toggle`
      );

      setSuccess(
        `Cabinet member ${
          member.is_active ? "deactivated" : "activated"
        } successfully.`
      );

      await fetchMembers(true);
    } catch (err) {
      console.error("Toggle cabinet member error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to change cabinet member status.";

      setError(message);
    } finally {
      setTogglingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter((member) => {
      const values = [
        member?.name_en,
        member?.name_so,
        member?.position_en,
        member?.position_so,
        member?.ministry?.name_en,
        member?.ministry?.name_so,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [members, search]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.is_active
  ).length;

  const inactiveMembers =
    totalMembers - activeMembers;

  // ==========================================
  // MINISTRY NAME
  // ==========================================

  const getMinistryName = (member) => {
    if (!member?.ministry) {
      return "—";
    }

    if (typeof member.ministry === "object") {
      return (
        member.ministry.name_en ||
        member.ministry.name_so ||
        "—"
      );
    }

    const ministry = ministries.find(
      (item) => item._id === member.ministry
    );

    return (
      ministry?.name_en ||
      ministry?.name_so ||
      "—"
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading cabinet members...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UsersRound size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Cabinet
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage government cabinet members
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => fetchMembers(true)}
            disabled={refreshing}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              text-sm
              font-semibold
              hover:bg-slate-50
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-emerald-600
              text-white
              text-sm
              font-semibold
              shadow-sm
              hover:bg-emerald-700
            "
          >
            <Plus size={18} />

            Add Cabinet Member
          </button>

        </div>
      </div>

      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="font-semibold text-sm">
              Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="font-semibold text-sm">
              Success
            </p>

            <p className="text-sm mt-1">
              {success}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Members
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalMembers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersRound size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {activeMembers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Inactive
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                {inactiveMembers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* ==========================================
          TABLE CARD
      ========================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE HEADER */}

        <div className="p-5 border-b border-slate-200">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Cabinet Members
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredMembers.length} member
                {filteredMembers.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search cabinet members..."
                className="
                  w-full
                  pl-10
                  pr-4
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  text-sm
                  text-slate-900
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-500/20
                  focus:border-emerald-500
                "
              />

            </div>

          </div>

        </div>

        {/* TABLE */}

        {filteredMembers.length === 0 ? (

          <div className="py-16 px-6 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <UsersRound size={26} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No cabinet members found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "No cabinet members have been added yet."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                <Plus size={17} />
                Add Cabinet Member
              </button>
            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Position
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Ministry
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredMembers.map((member) => (

                  <tr
                    key={member._id}
                    className="hover:bg-slate-50/70 transition"
                  >

                    {/* MEMBER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        {member.photo ? (

                          <img
                            src={member.photo}
                            alt={member.name_en}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <UsersRound size={20} />
                          </div>

                        )}

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900 truncate">
                            {member.name_en || "—"}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {member.name_so || "—"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* POSITION */}

                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-slate-800">
                        {member.position_en || "—"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {member.position_so || "—"}
                      </p>

                    </td>

                    {/* MINISTRY */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Building2 size={16} />
                        </div>

                        <span className="text-sm text-slate-700">
                          {getMinistryName(member)}
                        </span>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      {member.is_active ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Inactive
                        </span>

                      )}

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {member.photo && (
                          <a
                            href={member.photo}
                            target="_blank"
                            rel="noreferrer"
                            title="Open photo"
                            className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-center"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(member)
                          }
                          title="Edit"
                          className="w-9 h-9 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggle(member)
                          }
                          disabled={
                            togglingId === member._id
                          }
                          title={
                            member.is_active
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={`
                            w-9
                            h-9
                            rounded-lg
                            border
                            flex
                            items-center
                            justify-center
                            disabled:opacity-50
                            ${
                              member.is_active
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }
                          `}
                        >
                          {togglingId ===
                          member._id ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Power size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(member)
                          }
                          disabled={
                            deletingId === member._id
                          }
                          title="Delete"
                          className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center disabled:opacity-50"
                        >
                          {deletingId ===
                          member._id ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingMember
                    ? "Edit Cabinet Member"
                    : "Add Cabinet Member"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingMember
                    ? "Update cabinet member information."
                    : "Add a new government cabinet member."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto"
            >

              <div className="p-6 space-y-6">

                {/* NAMES */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Member Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Name (English)
                      </label>

                      <input
                        type="text"
                        name="name_en"
                        value={form.name_en}
                        onChange={handleChange}
                        placeholder="e.g. Ahmed Mohamed"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Name (Somali)
                      </label>

                      <input
                        type="text"
                        name="name_so"
                        value={form.name_so}
                        onChange={handleChange}
                        placeholder="Magaca Af-Soomaaliga"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                  </div>

                </div>

                {/* POSITIONS */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Position
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Position (English)
                      </label>

                      <input
                        type="text"
                        name="position_en"
                        value={form.position_en}
                        onChange={handleChange}
                        placeholder="e.g. Minister of Finance"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Position (Somali)
                      </label>

                      <input
                        type="text"
                        name="position_so"
                        value={form.position_so}
                        onChange={handleChange}
                        placeholder="Jagada Af-Soomaaliga"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                  </div>

                </div>

                {/* MINISTRY */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ministry
                  </label>

                  <select
                    name="ministry"
                    value={form.ministry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >

                    <option value="">
                      Select Ministry
                    </option>

                    {ministries.map((ministry) => (

                      <option
                        key={ministry._id}
                        value={ministry._id}
                      >
                        {ministry.name_en ||
                          ministry.name_so}
                      </option>

                    ))}

                  </select>

                </div>

                {/* DESCRIPTIONS */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Description
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description (English)
                      </label>

                      <textarea
                        name="description_en"
                        value={form.description_en}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter English description..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description (Somali)
                      </label>

                      <textarea
                        name="description_so"
                        value={form.description_so}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Geli sharaxaadda Af-Soomaaliga..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                  </div>

                </div>

                {/* PHOTO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Photo URL
                  </label>

                  <div className="relative">

                    <Camera
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="photo"
                      value={form.photo}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />

                  </div>

                  {form.photo && (
                    <div className="mt-3 flex items-center gap-3">

                      <img
                        src={form.photo}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <span className="text-xs text-slate-500">
                        Photo preview
                      </span>

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 accent-emerald-600"
                    />

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        Active Cabinet Member
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Active members can be displayed on
                        the public portal.
                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >

                  {saving && (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingMember
                    ? "Update Member"
                    : "Create Member"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cabinet;