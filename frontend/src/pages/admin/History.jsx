import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

const emptyItem = () => ({
  text: "",
  status: "active",
});

const HistoryAdmin = () => {
  const [historyId, setHistoryId] = useState(null);

  const [form, setForm] = useState({
    title: "History",
    heading: "Historical Background",
    content: [emptyItem()],
    responsibilitiesHeading: "Responsibilities",
    responsibilities: [emptyItem()],
    closingContent: [emptyItem()],
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get("/history/admin/all");
      const records = response.data?.data || [];

      if (records.length > 0) {
        const item = records[0];

        setHistoryId(item._id);

        setForm({
          title: item.title || "History",
          heading: item.heading || "Historical Background",

          content:
            item.content?.length > 0
              ? item.content.map((entry) => ({
                  text: entry.text || "",
                  status: entry.status || "active",
                }))
              : [emptyItem()],

          responsibilitiesHeading:
            item.responsibilitiesHeading || "Responsibilities",

          responsibilities:
            item.responsibilities?.length > 0
              ? item.responsibilities.map((entry) => ({
                  text: entry.text || "",
                  status: entry.status || "active",
                }))
              : [emptyItem()],

          closingContent:
            item.closingContent?.length > 0
              ? item.closingContent.map((entry) => ({
                  text: entry.text || "",
                  status: entry.status || "active",
                }))
              : [emptyItem()],

          status: item.status || "active",
        });
      }
    } catch (err) {
      console.error("Load History Admin Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load History data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      ),
    }));
  };

  const addArrayItem = (field) => {
    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], emptyItem()],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((previous) => {
      const updated = previous[field].filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...previous,
        [field]: updated.length > 0 ? updated : [emptyItem()],
      };
    });
  };

  const cleanItems = (items) =>
    items
      .filter((item) => item.text.trim())
      .map((item, index) => ({
        text: item.text.trim(),
        order: index,
        status: item.status || "active",
      }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      title: form.title.trim(),
      heading: form.heading.trim(),

      content: cleanItems(form.content),

      responsibilitiesHeading:
        form.responsibilitiesHeading.trim() ||
        "Responsibilities",

      responsibilities: cleanItems(
        form.responsibilities
      ),

      closingContent: cleanItems(
        form.closingContent
      ),

      status: form.status,
    };

    if (!payload.title || !payload.heading) {
      setError("Title and heading are required.");
      setSaving(false);
      return;
    }

    try {
      let response;

      if (historyId) {
        response = await api.put(
          `/history/admin/${historyId}`,
          payload
        );
      } else {
        response = await api.post(
          "/history/admin",
          payload
        );
      }

      const savedHistory = response.data?.data;

      if (savedHistory?._id) {
        setHistoryId(savedHistory._id);
      }

      setSuccess(
        response.data?.message ||
          "History page saved successfully."
      );
    } catch (err) {
      console.error("Save History Admin Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save History page."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderTextItems = (
    field,
    title,
    placeholder
  ) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add and manage the content paragraphs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {form[field].map((item, index) => (
          <div
            key={`${field}-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {title} {index + 1}
              </span>

              <button
                type="button"
                onClick={() =>
                  removeArrayItem(field, index)
                }
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                aria-label={`Delete ${title} ${index + 1}`}
              >
                <Trash2 size={17} />
              </button>
            </div>

            <textarea
              value={item.text}
              onChange={(event) =>
                updateArrayItem(
                  field,
                  index,
                  "text",
                  event.target.value
                )
              }
              placeholder={placeholder}
              rows={5}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <div className="mt-3">
              <select
                value={item.status}
                onChange={(event) =>
                  updateArrayItem(
                    field,
                    index,
                    "status",
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin text-emerald-600"
          />
          <span className="font-medium">
            Loading History...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            History
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the single History page displayed on
            the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadHistory}
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="font-bold">
              Something went wrong
            </p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFORMATION */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Page Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="History"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Main Heading
              </label>

              <input
                type="text"
                value={form.heading}
                onChange={(event) =>
                  updateField(
                    "heading",
                    event.target.value
                  )
                }
                placeholder="Historical Background"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Page Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* HISTORICAL CONTENT */}
        {renderTextItems(
          "content",
          "Historical Background",
          "Write a historical background paragraph..."
        )}

        {/* RESPONSIBILITIES */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Responsibilities Section
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set the section heading and add numbered
              responsibility items.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Section Heading
            </label>

            <input
              type="text"
              value={form.responsibilitiesHeading}
              onChange={(event) =>
                updateField(
                  "responsibilitiesHeading",
                  event.target.value
                )
              }
              placeholder="Responsibilities"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="space-y-4">
            {form.responsibilities.map(
              (item, index) => (
                <div
                  key={`responsibility-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Responsibility {index + 1}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem(
                          "responsibilities",
                          index
                        )
                      }
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <textarea
                    value={item.text}
                    onChange={(event) =>
                      updateArrayItem(
                        "responsibilities",
                        index,
                        "text",
                        event.target.value
                      )
                    }
                    placeholder="Write a responsibility..."
                    rows={4}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <div className="mt-3">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateArrayItem(
                          "responsibilities",
                          index,
                          "status",
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
                    >
                      <option value="active">
                        Active
                      </option>
                      <option value="inactive">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              addArrayItem("responsibilities")
            }
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={17} />
            Add Responsibility
          </button>
        </section>

        {/* CLOSING CONTENT */}
        {renderTextItems(
          "closingContent",
          "Closing Content",
          "Write a closing paragraph..."
        )}

        {/* SAVE */}
        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {historyId
                  ? "Update History"
                  : "Create History"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HistoryAdmin;
