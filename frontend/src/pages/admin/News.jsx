import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  X,
  RefreshCw,
  Newspaper,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  AlertCircle,
  CalendarDays,
  User,
  Tag,
} from "lucide-react";

import api from "../../services/api";

function News() {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [form, setForm] = useState({
    title_en: "",
    title_so: "",
    content_en: "",
    content_so: "",
    image: "",
    category: "",
    author: "",
    publishedAt: "",
  });

  // ==========================================
  // FETCH ALL NEWS
  // ==========================================

  const fetchNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/news/admin/all");

      const data = response?.data;

      const list =
        data?.news ||
        data?.data ||
        [];

      setNews(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load news:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load news.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title_en: "",
      title_so: "",
      content_en: "",
      content_so: "",
      image: "",
      category: "",
      author: "",
      publishedAt: "",
    });

    setEditingNews(null);
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

  const openEditModal = (item) => {
    setEditingNews(item);

    let formattedDate = "";

    if (item?.publishedAt) {
      const date = new Date(item.publishedAt);

      if (!Number.isNaN(date.getTime())) {
        formattedDate = date.toISOString().slice(0, 16);
      }
    }

    setForm({
      title_en: item?.title_en || "",
      title_so: item?.title_so || "",
      content_en: item?.content_en || "",
      content_so: item?.content_so || "",
      image: item?.image || "",
      category: item?.category || "",
      author: item?.author || "",
      publishedAt: formattedDate,
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
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!form.title_en.trim()) {
      setError("English title is required.");
      return;
    }

    if (!form.title_so.trim()) {
      setError("Somali title is required.");
      return;
    }

    if (!form.content_en.trim()) {
      setError("English content is required.");
      return;
    }

    if (!form.content_so.trim()) {
      setError("Somali content is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title_en: form.title_en.trim(),
        title_so: form.title_so.trim(),
        content_en: form.content_en.trim(),
        content_so: form.content_so.trim(),
        image: form.image.trim(),
        category: form.category.trim(),
        author: form.author.trim(),
      };

      // Only send publishedAt when editing
      if (editingNews && form.publishedAt) {
        payload.publishedAt = form.publishedAt;
      }

      // UPDATE
      if (editingNews) {
        await api.put(
          `/news/${editingNews._id}`,
          payload
        );

        setSuccess("News updated successfully.");
      }

      // CREATE
      else {
        await api.post("/news", payload);

        setSuccess("News created successfully.");
      }

      setShowModal(false);

      resetForm();

      await fetchNews(true);
    } catch (err) {
      console.error("News save error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save news.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        item?.title_en || "this news"
      }"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);

      setError("");
      setSuccess("");

      await api.delete(`/news/${item._id}`);

      setSuccess("News deleted successfully.");

      await fetchNews(true);
    } catch (err) {
      console.error("Delete news error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete news.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // TOGGLE PUBLISH STATUS
  // ==========================================

  const handleToggle = async (item) => {
    try {
      setTogglingId(item._id);

      setError("");
      setSuccess("");

      await api.patch(
        `/news/${item._id}/toggle`
      );

      setSuccess(
        item.is_published
          ? "News unpublished successfully."
          : "News published successfully."
      );

      await fetchNews(true);
    } catch (err) {
      console.error("Toggle news error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to change news status.";

      setError(message);
    } finally {
      setTogglingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return news;
    }

    return news.filter((item) => {
      const values = [
        item?.title_en,
        item?.title_so,
        item?.content_en,
        item?.content_so,
        item?.category,
        item?.author,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [news, search]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalNews = news.length;

  const publishedNews = news.filter(
    (item) => item.is_published
  ).length;

  const unpublishedNews =
    totalNews - publishedNews;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // ==========================================
  // TRUNCATE TEXT
  // ==========================================

  const truncateText = (text, length = 90) => {
    if (!text) return "—";

    if (text.length <= length) {
      return text;
    }

    return `${text.substring(0, length)}...`;
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
            Loading news...
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

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Newspaper size={23} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                News
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage government news and announcements
              </p>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => fetchNews(true)}
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
                refreshing
                  ? "animate-spin"
                  : ""
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

            Add News

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
          STATISTICS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* TOTAL */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total News
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalNews}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Newspaper size={21} />
            </div>

          </div>

        </div>

        {/* PUBLISHED */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Published
              </p>

              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {publishedNews}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={21} />
            </div>

          </div>

        </div>

        {/* UNPUBLISHED */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Unpublished
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                {unpublishedNews}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={21} />
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          NEWS TABLE
      ========================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE HEADER */}

        <div className="p-5 border-b border-slate-200">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                News Articles
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredNews.length} article
                {filteredNews.length !== 1
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
                placeholder="Search news..."
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

        {/* EMPTY */}

        {filteredNews.length === 0 ? (

          <div className="py-16 px-6 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Newspaper size={26} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No news found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "No news articles have been added yet."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                <Plus size={17} />
                Add News
              </button>
            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    News
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Author
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Published Date
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

                {filteredNews.map((item) => (

                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/70 transition"
                  >

                    {/* NEWS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.title_en}
                            className="w-14 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="w-14 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <ImageIcon size={20} />
                          </div>

                        )}

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900 max-w-[360px] truncate">
                            {item.title_en || "—"}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 max-w-[360px] truncate">
                            {item.title_so || "—"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1 max-w-[360px] truncate">
                            {truncateText(
                              item.content_en,
                              75
                            )}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4">

                      {item.category ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">

                          <Tag size={13} />

                          {item.category}

                        </span>

                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}

                    </td>

                    {/* AUTHOR */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                          <User size={15} />
                        </div>

                        <span className="text-sm text-slate-700">
                          {item.author || "—"}
                        </span>

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />

                        {formatDate(
                          item.publishedAt
                        )}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      {item.is_published ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">

                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                          Published

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">

                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />

                          Unpublished

                        </span>

                      )}

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {item.image && (
                          <a
                            href={item.image}
                            target="_blank"
                            rel="noreferrer"
                            title="Open image"
                            className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-center"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(item)
                          }
                          title="Edit"
                          className="w-9 h-9 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggle(item)
                          }
                          disabled={
                            togglingId === item._id
                          }
                          title={
                            item.is_published
                              ? "Unpublish"
                              : "Publish"
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
                              item.is_published
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }
                          `}
                        >

                          {togglingId ===
                          item._id ? (

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
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item._id
                          }
                          title="Delete"
                          className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center disabled:opacity-50"
                        >

                          {deletingId ===
                          item._id ? (

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

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL */}

          <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingNews
                    ? "Edit News"
                    : "Add News"}

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  {editingNews
                    ? "Update this news article."
                    : "Create a new government news article."}

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

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto"
            >

              <div className="p-6 space-y-6">

                {/* TITLES */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    News Title
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Title (English)
                      </label>

                      <input
                        type="text"
                        name="title_en"
                        value={form.title_en}
                        onChange={handleChange}
                        placeholder="Enter English news title..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Title (Somali)
                      </label>

                      <input
                        type="text"
                        name="title_so"
                        value={form.title_so}
                        onChange={handleChange}
                        placeholder="Geli cinwaanka wararka..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                  </div>

                </div>

                {/* CONTENT */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    News Content
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Content (English)
                      </label>

                      <textarea
                        name="content_en"
                        value={form.content_en}
                        onChange={handleChange}
                        rows={9}
                        placeholder="Write the English news content..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Content (Somali)
                      </label>

                      <textarea
                        name="content_so"
                        value={form.content_so}
                        onChange={handleChange}
                        rows={9}
                        placeholder="Qor wararka Af-Soomaaliga..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                  </div>

                </div>

                {/* META */}

                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    News Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* CATEGORY */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g. Government"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                    {/* AUTHOR */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Author
                      </label>

                      <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="e.g. Ministry of Information"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />

                    </div>

                    {/* DATE */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Published Date
                      </label>

                      <input
                        type="datetime-local"
                        name="publishedAt"
                        value={form.publishedAt}
                        onChange={handleChange}
                        disabled={!editingNews}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                      />

                    </div>

                  </div>

                </div>

                {/* IMAGE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Image URL
                  </label>

                  <div className="relative">

                    <ImageIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/news-image.jpg"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />

                  </div>

                  {/* IMAGE PREVIEW */}

                  {form.image && (
                    <div className="mt-4">

                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Image Preview
                      </p>

                      <img
                        src={form.image}
                        alt="News preview"
                        className="w-full max-w-md h-48 rounded-xl object-cover border border-slate-200"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* INFO */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-start gap-3">

                    <AlertCircle
                      size={19}
                      className="text-blue-600 mt-0.5 shrink-0"
                    />

                    <div>

                      <p className="text-sm font-semibold text-blue-900">
                        Publishing information
                      </p>

                      <p className="text-xs text-blue-700 mt-1 leading-5">
                        New news articles are automatically
                        published when created. You can
                        publish or unpublish an article later
                        using the status button.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

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

                  {editingNews
                    ? "Update News"
                    : "Create News"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default News;