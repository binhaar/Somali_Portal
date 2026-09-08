import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title_en: "",
    title_so: "",
    description_en: "",
    description_so: "",
    location_en: "",
    location_so: "",
    image: "",
    startDate: "",
    endDate: "",
    organizer: "",
    external_url: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH EVENTS
  // =========================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events/admin/all");

      const data = response?.data;

      const list = data?.events || data?.data || [];

      setEvents(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =========================
  // FORM HANDLER
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
      title_en: "",
      title_so: "",
      description_en: "",
      description_so: "",
      location_en: "",
      location_so: "",
      image: "",
      startDate: "",
      endDate: "",
      organizer: "",
      external_url: "",
    });

    setEditingEvent(null);
  };

  // =========================
  // OPEN CREATE MODAL
  // =========================

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (event) => {
    setEditingEvent(event);

    setForm({
      title_en: event.title_en || "",
      title_so: event.title_so || "",
      description_en: event.description_en || "",
      description_so: event.description_so || "",
      location_en: event.location_en || "",
      location_so: event.location_so || "",
      image: event.image || "",
      startDate: formatDateTimeLocal(event.startDate),
      endDate: formatDateTimeLocal(event.endDate),
      organizer: event.organizer || "",
      external_url: event.external_url || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDateTimeLocal = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
      if (!form.title_en.trim()) {
        throw new Error("English title is required.");
      }

      if (!form.title_so.trim()) {
        throw new Error("Somali title is required.");
      }

      if (!form.startDate) {
        throw new Error("Start date is required.");
      }

      if (
        form.endDate &&
        new Date(form.endDate) < new Date(form.startDate)
      ) {
        throw new Error(
          "End date cannot be earlier than start date."
        );
      }

      const payload = {
        title_en: form.title_en.trim(),
        title_so: form.title_so.trim(),
        description_en: form.description_en.trim(),
        description_so: form.description_so.trim(),
        location_en: form.location_en.trim(),
        location_so: form.location_so.trim(),
        image: form.image.trim(),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        organizer: form.organizer.trim(),
        external_url: form.external_url.trim(),
      };

      if (editingEvent) {
        const response = await api.put(
          `/events/${editingEvent._id}`,
          payload
        );

        const updatedEvent = response?.data?.event;

        setEvents((prev) =>
          prev.map((item) =>
            item._id === editingEvent._id
              ? updatedEvent || { ...item, ...payload }
              : item
          )
        );

        setSuccess("Event updated successfully.");
      } else {
        const response = await api.post(
          "/events",
          payload
        );

        const newEvent = response?.data?.event;

        if (newEvent) {
          setEvents((prev) => [newEvent, ...prev]);
        }

        setSuccess("Event created successfully.");
      }

      setShowModal(false);
      resetForm();

      await fetchEvents();
    } catch (error) {
      console.error("SAVE EVENT ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save event."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggle = async (event) => {
    try {
      setError("");

      const response = await api.patch(
        `/events/${event._id}/toggle`
      );

      const updatedEvent = response?.data?.event;

      if (updatedEvent) {
        setEvents((prev) =>
          prev.map((item) =>
            item._id === event._id
              ? updatedEvent
              : item
          )
        );
      }
    } catch (error) {
      console.error("TOGGLE EVENT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to change event status."
      );
    }
  };

  // =========================
  // DELETE EVENT
  // =========================

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title_en}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/events/${event._id}`);

      setEvents((prev) =>
        prev.filter((item) => item._id !== event._id)
      );

      setSuccess("Event deleted successfully.");
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete event."
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) => {
      return [
        event.title_en,
        event.title_so,
        event.description_en,
        event.description_so,
        event.location_en,
        event.location_so,
        event.organizer,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        );
    });
  }, [events, search]);

  // =========================
  // STATISTICS
  // =========================

  const totalEvents = events.length;

  const activeEvents = events.filter(
    (event) => event.is_active
  ).length;

  const inactiveEvents =
    totalEvents - activeEvents;

  // =========================
  // DATE DISPLAY
  // =========================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <CalendarDays size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Events
              </h1>

              <p className="text-sm text-slate-500">
                Manage government events and public activities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={fetchEvents}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <Plus size={18} />

            Add Event
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

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Events
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalEvents}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={23} />
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
                {activeEvents}
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
                {inactiveEvents}
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
            placeholder="Search events by title, location or organizer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
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
                  Event
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Organizer
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
                        className="animate-spin text-green-700"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading events...
                      </p>

                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <CalendarDays
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-semibold text-slate-700">
                      No events found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Create your first event to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (

                  <tr
                    key={event._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* EVENT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title_en}
                            className="h-12 w-12 rounded-xl object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                            <CalendarDays size={21} />
                          </div>
                        )}

                        <div className="min-w-0">

                          <p className="max-w-[280px] truncate font-semibold text-slate-900">
                            {event.title_en}
                          </p>

                          <p className="mt-1 max-w-[280px] truncate text-xs text-slate-500">
                            {event.title_so}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="px-6 py-5">

                      <div className="flex items-start gap-2">

                        <CalendarDays
                          size={16}
                          className="mt-0.5 text-green-600"
                        />

                        <div>

                          <p className="text-sm font-medium text-slate-800">
                            {formatDate(event.startDate)}
                          </p>

                          {formatTime(event.startDate) && (
                            <p className="text-xs text-slate-500">
                              {formatTime(event.startDate)}
                            </p>
                          )}

                          {event.endDate && (
                            <p className="mt-1 text-xs text-slate-400">
                              Until {formatDate(event.endDate)}
                            </p>
                          )}

                        </div>

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
                            {event.location_en || "—"}
                          </p>

                          {event.location_so && (
                            <p className="max-w-[180px] truncate text-xs text-slate-400">
                              {event.location_so}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* ORGANIZER */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <Users
                          size={16}
                          className="text-slate-400"
                        />

                        <span className="text-sm text-slate-700">
                          {event.organizer || "—"}
                        </span>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <button
                        onClick={() =>
                          handleToggle(event)
                        }
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          event.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >

                        {event.is_active ? (
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

                        {event.external_url && (
                          <a
                            href={event.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            title="Open event link"
                          >
                            <ExternalLink size={17} />
                          </a>
                        )}

                        <button
                          onClick={() =>
                            openEditModal(event)
                          }
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(event)
                          }
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={17} />
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4">

          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingEvent
                    ? "Edit Event"
                    : "Create New Event"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the event information in English
                  and Somali.
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

              {/* TITLES */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Event Titles
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      English Title *
                    </label>

                    <input
                      type="text"
                      name="title_en"
                      value={form.title_en}
                      onChange={handleChange}
                      placeholder="Enter English title"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Somali Title *
                    </label>

                    <input
                      type="text"
                      name="title_so"
                      value={form.title_so}
                      onChange={handleChange}
                      placeholder="Geli cinwaanka Soomaaliga"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

              {/* DESCRIPTIONS */}

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
                      value={form.description_en}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Describe the event..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Somali Description
                    </label>

                    <textarea
                      name="description_so"
                      value={form.description_so}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Sharax dhacdada..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

              {/* DATE & LOCATION */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Date & Location
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Start Date *
                    </label>

                    <input
                      type="datetime-local"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      End Date
                    </label>

                    <input
                      type="datetime-local"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location - English
                    </label>

                    <input
                      type="text"
                      name="location_en"
                      value={form.location_en}
                      onChange={handleChange}
                      placeholder="e.g. Mogadishu"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location - Somali
                    </label>

                    <input
                      type="text"
                      name="location_so"
                      value={form.location_so}
                      onChange={handleChange}
                      placeholder="Tusaale: Muqdisho"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

              {/* OTHER DETAILS */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Organizer
                    </label>

                    <input
                      type="text"
                      name="organizer"
                      value={form.organizer}
                      onChange={handleChange}
                      placeholder="Ministry / Organization"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      External URL
                    </label>

                    <input
                      type="url"
                      name="external_url"
                      value={form.external_url}
                      onChange={handleChange}
                      placeholder="https://example.com/event"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Image URL
                    </label>

                    <div className="flex gap-3">

                      <div className="relative flex-1">

                        <ImageIcon
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="url"
                          name="image"
                          value={form.image}
                          onChange={handleChange}
                          placeholder="https://example.com/event-image.jpg"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                      </div>

                    </div>

                    {form.image && (
                      <div className="mt-3">

                        <img
                          src={form.image}
                          alt="Event preview"
                          className="h-32 w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* FORM ACTIONS */}

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
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
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

                      {editingEvent
                        ? "Update Event"
                        : "Create Event"}
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

export default Events;