import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../../services/api";

function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [form, setForm] = useState({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    phone: "",
    alternative_phone: "",
    email: "",
    location_en: "",
    location_so: "",
    website_url: "",
    icon: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH CONTACTS
  // =========================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/emergency-contacts/admin/all"
      );

      const data = response?.data;

      const list =
        data?.contacts ||
        data?.data ||
        [];

      setContacts(
        Array.isArray(list) ? list : []
      );
    } catch (error) {
      console.error(
        "FETCH EMERGENCY CONTACTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      name_en: "",
      name_so: "",
      description_en: "",
      description_so: "",
      phone: "",
      alternative_phone: "",
      email: "",
      location_en: "",
      location_so: "",
      website_url: "",
      icon: "",
    });

    setEditingContact(null);
  };

  // =========================
  // CREATE MODAL
  // =========================

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // EDIT MODAL
  // =========================

  const openEditModal = (contact) => {
    setEditingContact(contact);

    setForm({
      name_en: contact.name_en || "",
      name_so: contact.name_so || "",
      description_en:
        contact.description_en || "",
      description_so:
        contact.description_so || "",
      phone: contact.phone || "",
      alternative_phone:
        contact.alternative_phone || "",
      email: contact.email || "",
      location_en:
        contact.location_en || "",
      location_so:
        contact.location_so || "",
      website_url:
        contact.website_url || "",
      icon: contact.icon || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.name_en.trim()) {
        throw new Error(
          "English name is required."
        );
      }

      if (!form.name_so.trim()) {
        throw new Error(
          "Somali name is required."
        );
      }

      if (!form.phone.trim()) {
        throw new Error(
          "Phone number is required."
        );
      }

      const payload = {
        name_en: form.name_en.trim(),
        name_so: form.name_so.trim(),

        description_en:
          form.description_en.trim(),

        description_so:
          form.description_so.trim(),

        phone: form.phone.trim(),

        alternative_phone:
          form.alternative_phone.trim(),

        email: form.email.trim(),

        location_en:
          form.location_en.trim(),

        location_so:
          form.location_so.trim(),

        website_url:
          form.website_url.trim(),

        icon: form.icon.trim(),
      };

      if (editingContact) {
        const response = await api.put(
          `/emergency-contacts/${editingContact._id}`,
          payload
        );

        const updatedContact =
          response?.data?.contact;

        if (updatedContact) {
          setContacts((prev) =>
            prev.map((item) =>
              item._id === editingContact._id
                ? updatedContact
                : item
            )
          );
        }

        setSuccess(
          "Emergency contact updated successfully."
        );
      } else {
        const response = await api.post(
          "/emergency-contacts",
          payload
        );

        const newContact =
          response?.data?.contact;

        if (newContact) {
          setContacts((prev) => [
            newContact,
            ...prev,
          ]);
        }

        setSuccess(
          "Emergency contact created successfully."
        );
      }

      setShowModal(false);
      resetForm();

      await fetchContacts();
    } catch (error) {
      console.error(
        "SAVE EMERGENCY CONTACT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save emergency contact."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggle = async (contact) => {
    try {
      setError("");

      const response = await api.patch(
        `/emergency-contacts/${contact._id}/toggle`
      );

      const updatedContact =
        response?.data?.contact;

      if (updatedContact) {
        setContacts((prev) =>
          prev.map((item) =>
            item._id === contact._id
              ? updatedContact
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "TOGGLE EMERGENCY CONTACT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change contact status."
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (contact) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${contact.name_en}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/emergency-contacts/${contact._id}`
      );

      setContacts((prev) =>
        prev.filter(
          (item) => item._id !== contact._id
        )
      );

      setSuccess(
        "Emergency contact deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE EMERGENCY CONTACT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete emergency contact."
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredContacts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return [
        contact.name_en,
        contact.name_so,
        contact.description_en,
        contact.description_so,
        contact.phone,
        contact.alternative_phone,
        contact.email,
        contact.location_en,
        contact.location_so,
      ]
        .filter(Boolean)
        .some((value) =>
          value
            .toLowerCase()
            .includes(query)
        );
    });
  }, [contacts, search]);

  // =========================
  // STATISTICS
  // =========================

  const totalContacts = contacts.length;

  const activeContacts = contacts.filter(
    (contact) => contact.is_active
  ).length;

  const inactiveContacts =
    totalContacts - activeContacts;

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <PhoneCall size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Emergency Contacts
            </h1>

            <p className="text-sm text-slate-500">
              Manage emergency phone numbers and
              public safety contacts.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={fetchContacts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <Plus size={18} />

            Add Contact
          </button>

        </div>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X size={17} />
          </button>

        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
            className="rounded-lg p-1 hover:bg-green-100"
          >
            <X size={17} />
          </button>

        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Contacts
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalContacts}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <PhoneCall size={23} />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Active
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                {activeContacts}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={23} />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-700">
                {inactiveContacts}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <EyeOff size={23} />
            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search contacts by name, phone, email or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <RefreshCw
                        size={30}
                        className="animate-spin text-red-600"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading emergency contacts...
                      </p>

                    </div>

                  </td>

                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <AlertTriangle
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-semibold text-slate-700">
                      No emergency contacts found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add an emergency contact to
                      get started.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredContacts.map(
                  (contact) => (

                    <tr
                      key={contact._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* CONTACT */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">

                            <PhoneCall size={20} />

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[230px] truncate font-semibold text-slate-900">
                              {contact.name_en}
                            </p>

                            <p className="mt-1 max-w-[230px] truncate text-xs text-slate-500">
                              {contact.name_so}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-6 py-5">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2">

                            <Phone
                              size={15}
                              className="text-red-500"
                            />

                            <a
                              href={`tel:${contact.phone}`}
                              className="font-semibold text-slate-800 hover:text-red-600"
                            >
                              {contact.phone}
                            </a>

                          </div>

                          {contact.alternative_phone && (
                            <p className="pl-5 text-xs text-slate-400">
                              Alt:{" "}
                              {contact.alternative_phone}
                            </p>
                          )}

                        </div>

                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-5">

                        <div className="flex items-start gap-2">

                          <MapPin
                            size={16}
                            className="mt-0.5 text-slate-400"
                          />

                          <div>

                            <p className="max-w-[180px] truncate text-sm text-slate-700">
                              {contact.location_en ||
                                "—"}
                            </p>

                            {contact.location_so && (
                              <p className="max-w-[180px] truncate text-xs text-slate-400">
                                {contact.location_so}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-5">

                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex max-w-[190px] items-center gap-2 truncate text-sm text-slate-700 hover:text-red-600"
                          >

                            <Mail
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="truncate">
                              {contact.email}
                            </span>

                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            handleToggle(contact)
                          }
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                            contact.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >

                          {contact.is_active ? (
                            <>
                              <Eye size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} />
                              Inactive
                            </>
                          )}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-2">

                          {contact.website_url && (
                            <a
                              href={contact.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open website"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                              <ExternalLink
                                size={17}
                              />
                            </a>
                          )}

                          <button
                            onClick={() =>
                              openEditModal(
                                contact
                              )
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                contact
                              )
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4">

          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingContact
                    ? "Edit Emergency Contact"
                    : "Add Emergency Contact"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage emergency contact information
                  in English and Somali.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={21} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {/* NAME */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Contact Name
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      English Name *
                    </label>

                    <input
                      type="text"
                      name="name_en"
                      value={form.name_en}
                      onChange={handleChange}
                      placeholder="e.g. Police Emergency"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Somali Name *
                    </label>

                    <input
                      type="text"
                      name="name_so"
                      value={form.name_so}
                      onChange={handleChange}
                      placeholder="Tusaale: Booliska"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>

              </div>

              {/* PHONE */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Phone Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Primary Phone *
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 888"
                        required
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Alternative Phone
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="alternative_phone"
                        value={
                          form.alternative_phone
                        }
                        onChange={handleChange}
                        placeholder="Alternative number"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Description
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      English Description
                    </label>

                    <textarea
                      name="description_en"
                      value={
                        form.description_en
                      }
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe the emergency service..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Somali Description
                    </label>

                    <textarea
                      name="description_so"
                      value={
                        form.description_so
                      }
                      onChange={handleChange}
                      rows="4"
                      placeholder="Sharax adeegga degdegga ah..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>

              </div>

              {/* LOCATION */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Location
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location - English
                    </label>

                    <input
                      type="text"
                      name="location_en"
                      value={
                        form.location_en
                      }
                      onChange={handleChange}
                      placeholder="e.g. Mogadishu"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location - Somali
                    </label>

                    <input
                      type="text"
                      name="location_so"
                      value={
                        form.location_so
                      }
                      onChange={handleChange}
                      placeholder="Tusaale: Muqdisho"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>

              </div>

              {/* OTHER */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contact@example.gov"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Icon
                    </label>

                    <input
                      type="text"
                      name="icon"
                      value={form.icon}
                      onChange={handleChange}
                      placeholder="phone, ambulance, police..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Website URL
                    </label>

                    <div className="relative">

                      <ExternalLink
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="url"
                        name="website_url"
                        value={
                          form.website_url
                        }
                        onChange={handleChange}
                        placeholder="https://example.gov.so"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />

                      {editingContact
                        ? "Update Contact"
                        : "Create Contact"}
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

export default EmergencyContacts;