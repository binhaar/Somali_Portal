import React, { useEffect, useState } from "react";
import {
  Compass,
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

const emptyDestination = {
  title: "",
  description: "",
  image: "",
  location: "",
  category: "",
  featured: false,
  order: 0,
  status: "active",
};

const emptyHighlight = {
  title: "",
  description: "",
  image: "",
  location: "",
  category: "",
  featured: false,
  order: 0,
  status: "active",
};

const emptyGallery = {
  title: "",
  description: "",
  image: "",
  order: 0,
  status: "active",
};

const initialForm = {
  title: "Tourism",
  slug: "tourism",
  subtitle: "Discover the beauty of Somalia",
  heroImage: "",
  heroTitle: "",
  heroDescription: "",
  introductionTitle: "Discover Somalia",
  introduction: "",
  destinationsHeading: "Popular Destinations",
  destinations: [],
  highlightsHeading: "Tourism Highlights",
  highlights: [],
  galleryHeading: "Gallery",
  gallery: [],
  ctaTitle: "",
  ctaText: "",
  status: "active",
};

export default function TourismAdmin() {
  const [tourismId, setTourismId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD TOURISM
  // =========================================================

  useEffect(() => {
    loadTourism();
  }, []);

  const loadTourism = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get("/tourism/admin/all");

      console.log("Tourism API response:", response.data);

      const records = response.data?.data || [];

      if (records.length > 0) {
        const record = records[0];

        setTourismId(record._id);

        setForm({
          title: record.title || "Tourism",
          slug: record.slug || "tourism",
          subtitle: record.subtitle || "",
          heroImage: record.heroImage || "",
          heroTitle: record.heroTitle || "",
          heroDescription: record.heroDescription || "",
          introductionTitle:
            record.introductionTitle || "Discover Somalia",
          introduction: record.introduction || "",
          destinationsHeading:
            record.destinationsHeading || "Popular Destinations",
          destinations: Array.isArray(record.destinations)
            ? record.destinations
            : [],
          highlightsHeading:
            record.highlightsHeading || "Tourism Highlights",
          highlights: Array.isArray(record.highlights)
            ? record.highlights
            : [],
          galleryHeading: record.galleryHeading || "Gallery",
          gallery: Array.isArray(record.gallery) ? record.gallery : [],
          ctaTitle: record.ctaTitle || "",
          ctaText: record.ctaText || "",
          status: record.status || "active",
        });
      } else {
        setTourismId(null);
        setForm(initialForm);
      }
    } catch (err) {
      console.error("Failed to load tourism:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load tourism information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BASIC FORM
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // DESTINATIONS
  // =========================================================

  const addDestination = () => {
    setForm((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        {
          ...emptyDestination,
          order: prev.destinations.length,
        },
      ],
    }));
  };

  const updateDestination = (index, field, value) => {
    setForm((prev) => {
      const destinations = [...prev.destinations];

      destinations[index] = {
        ...destinations[index],
        [field]:
          field === "featured"
            ? value
            : field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        destinations,
      };
    });
  };

  const removeDestination = (index) => {
    setForm((prev) => ({
      ...prev,
      destinations: prev.destinations.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =========================================================
  // HIGHLIGHTS
  // =========================================================

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        {
          ...emptyHighlight,
          order: prev.highlights.length,
        },
      ],
    }));
  };

  const updateHighlight = (index, field, value) => {
    setForm((prev) => {
      const highlights = [...prev.highlights];

      highlights[index] = {
        ...highlights[index],
        [field]:
          field === "featured"
            ? value
            : field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        highlights,
      };
    });
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =========================================================
  // GALLERY
  // =========================================================

  const addGallery = () => {
    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          ...emptyGallery,
          order: prev.gallery.length,
        },
      ],
    }));
  };

  const updateGallery = (index, field, value) => {
    setForm((prev) => {
      const gallery = [...prev.gallery];

      gallery[index] = {
        ...gallery[index],
        [field]:
          field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        gallery,
      };
    });
  };

  const removeGallery = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title,
        slug: "tourism",
        subtitle: form.subtitle,

        heroImage: form.heroImage,
        heroTitle: form.heroTitle,
        heroDescription: form.heroDescription,

        introductionTitle: form.introductionTitle,
        introduction: form.introduction,

        destinationsHeading: form.destinationsHeading,
        destinations: form.destinations,

        highlightsHeading: form.highlightsHeading,
        highlights: form.highlights,

        galleryHeading: form.galleryHeading,
        gallery: form.gallery,

        ctaTitle: form.ctaTitle,
        ctaText: form.ctaText,

        status: form.status,
      };

      let response;

      if (tourismId) {
        response = await api.put(
          `/tourism/admin/${tourismId}`,
          payload
        );
      } else {
        response = await api.post(
          "/tourism/admin",
          payload
        );
      }

      console.log("Tourism saved:", response.data);

      if (response.data?.data?._id) {
        setTourismId(response.data.data._id);
      }

      setSuccess("Tourism information saved successfully.");

      await loadTourism();
    } catch (err) {
      console.error("Failed to save tourism:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save tourism information."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (!tourismId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the Tourism information?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.delete(`/tourism/admin/${tourismId}`);

      setTourismId(null);
      setForm(initialForm);

      setSuccess(
        "Tourism information deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete tourism:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete tourism information."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tourism information...</span>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6 pb-24">

      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tourism Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage tourism information, destinations,
              highlights and gallery content.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setTourismId(null);
              setForm(initialForm);
              setError("");
              setSuccess("");
            }}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            New Tourism
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />

          <div>
            <p className="font-semibold">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />

          <div>
            <p className="font-semibold">
              {success}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* =====================================================
            BASIC INFORMATION
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Basic Information
              </h2>

              <p className="text-sm text-gray-500">
                Main tourism page information.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug
              </label>

              <input
                type="text"
                value="tourism"
                readOnly
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subtitle
              </label>

              <input
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Discover the beauty of Somalia"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
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

        </section>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ImageIcon className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Hero Section
              </h2>

              <p className="text-sm text-gray-500">
                The main banner shown at the top of the Tourism page.
              </p>
            </div>

          </div>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hero Image URL
              </label>

              <input
                type="text"
                name="heroImage"
                value={form.heroImage}
                onChange={handleChange}
                placeholder="https://example.com/tourism.jpg"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />

              {form.heroImage && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={form.heroImage}
                    alt="Tourism Hero"
                    className="h-64 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hero Title
              </label>

              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                placeholder="Explore Somalia"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hero Description
              </label>

              <textarea
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Discover the natural beauty, culture and heritage of Somalia."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

          </div>

        </section>

        {/* =====================================================
            INTRODUCTION
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Introduction
            </h2>

            <p className="text-sm text-gray-500">
              Main introduction content for the Tourism page.
            </p>

          </div>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Introduction Heading
              </label>

              <input
                type="text"
                name="introductionTitle"
                value={form.introductionTitle}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Introduction
              </label>

              <textarea
                name="introduction"
                value={form.introduction}
                onChange={handleChange}
                rows={7}
                placeholder="Write information about tourism in Somalia..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

          </div>

        </section>

        {/* =====================================================
            DESTINATIONS
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Destinations
              </h2>

              <p className="text-sm text-gray-500">
                Add and manage Somalia tourism destinations.
              </p>

            </div>

            <button
              type="button"
              onClick={addDestination}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Destination
            </button>

          </div>

          <div className="space-y-5">

            {form.destinations.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No destinations added yet.
              </div>
            )}

            {form.destinations.map((destination, index) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >

                <div className="mb-5 flex items-center justify-between">

                  <h3 className="font-semibold text-gray-900">
                    Destination #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Destination title"
                    value={destination.title}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={destination.location}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "location",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={destination.category}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "category",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={destination.image}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "image",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <textarea
                    placeholder="Description"
                    value={destination.description}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500 md:col-span-2"
                  />

                  <input
                    type="number"
                    placeholder="Order"
                    value={destination.order ?? 0}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "order",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <select
                    value={destination.status || "active"}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">

                  <input
                    type="checkbox"
                    checked={Boolean(destination.featured)}
                    onChange={(e) =>
                      updateDestination(
                        index,
                        "featured",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  Featured destination

                </label>

              </div>

            ))}

          </div>

        </section>

        {/* =====================================================
            HIGHLIGHTS
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Tourism Highlights
              </h2>

              <p className="text-sm text-gray-500">
                Add important tourism highlights.
              </p>

            </div>

            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Highlight
            </button>

          </div>

          <div className="space-y-5">

            {form.highlights.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No highlights added yet.
              </div>
            )}

            {form.highlights.map((highlight, index) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >

                <div className="mb-5 flex items-center justify-between">

                  <h3 className="font-semibold text-gray-900">
                    Highlight #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Highlight title"
                    value={highlight.title}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={highlight.location}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "location",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={highlight.category}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "category",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={highlight.image}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "image",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <textarea
                    placeholder="Description"
                    value={highlight.description}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500 md:col-span-2"
                  />

                  <input
                    type="number"
                    placeholder="Order"
                    value={highlight.order ?? 0}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "order",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <select
                    value={highlight.status || "active"}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">

                  <input
                    type="checkbox"
                    checked={Boolean(highlight.featured)}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        "featured",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  Featured highlight

                </label>

              </div>

            ))}

          </div>

        </section>

        {/* =====================================================
            GALLERY
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Gallery
              </h2>

              <p className="text-sm text-gray-500">
                Manage tourism gallery images.
              </p>

            </div>

            <button
              type="button"
              onClick={addGallery}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Image
            </button>

          </div>

          <div className="space-y-5">

            {form.gallery.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No gallery images added yet.
              </div>
            )}

            {form.gallery.map((item, index) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >

                <div className="mb-5 flex items-center justify-between">

                  <h3 className="font-semibold text-gray-900">
                    Gallery Image #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeGallery(index)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Image title"
                    value={item.title}
                    onChange={(e) =>
                      updateGallery(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.image}
                    onChange={(e) =>
                      updateGallery(
                        index,
                        "image",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateGallery(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500 md:col-span-2"
                  />

                  <input
                    type="number"
                    placeholder="Order"
                    value={item.order ?? 0}
                    onChange={(e) =>
                      updateGallery(
                        index,
                        "order",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  />

                  <select
                    value={item.status || "active"}
                    onChange={(e) =>
                      updateGallery(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                {item.image && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <img
                      src={item.image}
                      alt={item.title || "Tourism gallery"}
                      className="h-56 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                  </div>
                )}

              </div>

            ))}

          </div>

        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Call To Action
            </h2>

            <p className="text-sm text-gray-500">
              Content shown near the bottom of the Tourism page.
            </p>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                CTA Title
              </label>

              <input
                type="text"
                name="ctaTitle"
                value={form.ctaTitle}
                onChange={handleChange}
                placeholder="Explore Somalia"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                CTA Text
              </label>

              <textarea
                name="ctaText"
                value={form.ctaText}
                onChange={handleChange}
                rows={4}
                placeholder="Discover the beauty and culture of Somalia."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            SAVE BAR
        ====================================================== */}

        <div className="sticky bottom-4 z-20 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="font-semibold text-gray-900">
                {tourismId
                  ? "Update Tourism Information"
                  : "Create Tourism Information"}
              </p>

              <p className="text-sm text-gray-500">
                Save your changes to update the public Tourism page.
              </p>

            </div>

            <div className="flex gap-3">

              {tourismId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Tourism
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </form>
    </div>
  );
}