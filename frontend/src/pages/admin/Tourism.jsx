import React, { useEffect, useState } from "react";
import {
  Compass,
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
  nameEnglish: "",
  nameSomali: "",
  descriptionEnglish: "",
  descriptionSomali: "",
  location: "",
  category: "",
  image: "",
  featured: false,
  order: 0,
  status: "active",
};

const emptyHighlight = {
  titleEnglish: "",
  titleSomali: "",
  descriptionEnglish: "",
  descriptionSomali: "",
  image: "",
  order: 0,
  status: "active",
};

const emptyGallery = {
  titleEnglish: "",
  titleSomali: "",
  descriptionEnglish: "",
  descriptionSomali: "",
  image: "",
  order: 0,
  status: "active",
};

const initialForm = {
  titleEnglish: "Tourism",
  titleSomali: "Dalxiiska",

  subtitleEnglish:
    "Discover the beauty of Somalia",

  subtitleSomali:
    "Soo ogow quruxda Soomaaliya",

  heroImage: "",

  heroTitleEnglish:
    "Explore Somalia",

  heroTitleSomali:
    "Soo Booqda Soomaaliya",

  heroDescriptionEnglish: "",

  heroDescriptionSomali: "",

  introductionTitleEnglish:
    "Discover Somalia",

  introductionTitleSomali:
    "Soo Baro Soomaaliya",

  introductionEnglish: "",

  introductionSomali: "",

  destinationsHeadingEnglish:
    "Popular Destinations",

  destinationsHeadingSomali:
    "Goobaha Dalxiiska",

  destinations: [],

  highlightsHeadingEnglish:
    "Tourism Highlights",

  highlightsHeadingSomali:
    "Waxyaabaha Muhiimka ah ee Dalxiiska",

  highlights: [],

  galleryHeadingEnglish:
    "Gallery",

  galleryHeadingSomali:
    "Sawirrada Dalxiiska",

  gallery: [],

  ctaTitleEnglish: "",

  ctaTitleSomali: "",

  ctaTextEnglish: "",

  ctaTextSomali: "",

  status: "active",
};

export default function TourismAdmin() {
  const [tourismId, setTourismId] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    loadTourism();
  }, []);

  const loadTourism = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/tourism/admin/all"
        );

      const records =
        response.data?.data || [];

      if (records.length > 0) {
        const record = records[0];

        setTourismId(record._id);

        setForm({
          ...initialForm,
          ...record,

          destinations:
            Array.isArray(
              record.destinations
            )
              ? record.destinations
              : [],

          highlights:
            Array.isArray(
              record.highlights
            )
              ? record.highlights
              : [],

          gallery:
            Array.isArray(
              record.gallery
            )
              ? record.gallery
              : [],
        });
      }
    } catch (err) {
      console.error(
        "Load Tourism Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load tourism information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BASIC
  // =====================================================

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DESTINATIONS
  // =====================================================

  const addDestination = () => {
    setForm((prev) => ({
      ...prev,

      destinations: [
        ...prev.destinations,

        {
          ...emptyDestination,

          order:
            prev.destinations
              .length,
        },
      ],
    }));
  };

  const updateDestination = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const items = [
        ...prev.destinations,
      ];

      items[index] = {
        ...items[index],
        [field]:
          field === "featured"
            ? value
            : field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        destinations: items,
      };
    });
  };

  const removeDestination = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,

      destinations:
        prev.destinations.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  // =====================================================
  // HIGHLIGHTS
  // =====================================================

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,

      highlights: [
        ...prev.highlights,

        {
          ...emptyHighlight,

          order:
            prev.highlights.length,
        },
      ],
    }));
  };

  const updateHighlight = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const items = [
        ...prev.highlights,
      ];

      items[index] = {
        ...items[index],
        [field]:
          field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        highlights: items,
      };
    });
  };

  const removeHighlight = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,

      highlights:
        prev.highlights.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  // =====================================================
  // GALLERY
  // =====================================================

  const addGallery = () => {
    setForm((prev) => ({
      ...prev,

      gallery: [
        ...prev.gallery,

        {
          ...emptyGallery,

          order:
            prev.gallery.length,
        },
      ],
    }));
  };

  const updateGallery = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const items = [
        ...prev.gallery,
      ];

      items[index] = {
        ...items[index],
        [field]:
          field === "order"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        gallery: items,
      };
    });
  };

  const removeGallery = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,

      gallery:
        prev.gallery.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        slug: "tourism",
      };

      let response;

      if (tourismId) {
        response =
          await api.put(
            `/tourism/admin/${tourismId}`,
            payload
          );
      } else {
        response =
          await api.post(
            "/tourism/admin",
            payload
          );
      }

      if (
        response.data?.data?._id
      ) {
        setTourismId(
          response.data.data._id
        );
      }

      setSuccess(
        "Tourism information saved successfully."
      );

      await loadTourism();
    } catch (err) {
      console.error(
        "Save Tourism Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save tourism information."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!tourismId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete Tourism information?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);

      await api.delete(
        `/tourism/admin/${tourismId}`
      );

      setTourismId(null);
      setForm(initialForm);

      setSuccess(
        "Tourism information deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete tourism information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading Tourism...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">

      {/* HEADER */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            <Compass className="h-6 w-6 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tourism Management
            </h1>

            <p className="text-sm text-gray-500">
              Enter Tourism information in English and Somali.
            </p>
          </div>

        </div>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-bold">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Field
              label="Title (English)"
              name="titleEnglish"
              value={form.titleEnglish}
              onChange={handleChange}
              placeholder="Tourism"
            />

            <Field
              label="Title (Somali)"
              name="titleSomali"
              value={form.titleSomali}
              onChange={handleChange}
              placeholder="Dalxiiska"
            />

            <Field
              label="Subtitle (English)"
              name="subtitleEnglish"
              value={form.subtitleEnglish}
              onChange={handleChange}
              placeholder="Discover the beauty of Somalia"
            />

            <Field
              label="Subtitle (Somali)"
              name="subtitleSomali"
              value={form.subtitleSomali}
              onChange={handleChange}
              placeholder="Soo ogow quruxda Soomaaliya"
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
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

        {/* HERO */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-bold">
            Hero Section
          </h2>

          <div className="space-y-5">

            <Field
              label="Hero Image URL"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              placeholder="https://example.com/tourism.jpg"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <Field
                label="Hero Title (English)"
                name="heroTitleEnglish"
                value={form.heroTitleEnglish}
                onChange={handleChange}
                placeholder="Explore Somalia"
              />

              <Field
                label="Hero Title (Somali)"
                name="heroTitleSomali"
                value={form.heroTitleSomali}
                onChange={handleChange}
                placeholder="Soo Booqda Soomaaliya"
              />

              <TextArea
                label="Hero Description (English)"
                name="heroDescriptionEnglish"
                value={form.heroDescriptionEnglish}
                onChange={handleChange}
              />

              <TextArea
                label="Hero Description (Somali)"
                name="heroDescriptionSomali"
                value={form.heroDescriptionSomali}
                onChange={handleChange}
              />

            </div>

            {form.heroImage && (
              <img
                src={form.heroImage}
                alt="Tourism"
                className="h-64 w-full rounded-xl object-cover"
              />
            )}

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-bold">
            Introduction
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Field
              label="Introduction Title (English)"
              name="introductionTitleEnglish"
              value={form.introductionTitleEnglish}
              onChange={handleChange}
            />

            <Field
              label="Introduction Title (Somali)"
              name="introductionTitleSomali"
              value={form.introductionTitleSomali}
              onChange={handleChange}
            />

            <TextArea
              label="Introduction (English)"
              name="introductionEnglish"
              value={form.introductionEnglish}
              onChange={handleChange}
            />

            <TextArea
              label="Introduction (Somali)"
              name="introductionSomali"
              value={form.introductionSomali}
              onChange={handleChange}
            />

          </div>

        </section>

        {/* DESTINATIONS */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Destinations
              </h2>

              <p className="text-sm text-gray-500">
                English and Somali content for every destination.
              </p>
            </div>

            <button
              type="button"
              onClick={addDestination}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Destination
            </button>

          </div>

          <div className="space-y-5">

            {form.destinations.map(
              (item, index) => (
                <div
                  key={
                    item._id ||
                    index
                  }
                  className="rounded-2xl border bg-gray-50 p-5"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="font-bold">
                      Destination #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeDestination(
                          index
                        )
                      }
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>

                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <Field
                      label="Name (English)"
                      value={
                        item.nameEnglish
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "nameEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Name (Somali)"
                      value={
                        item.nameSomali
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "nameSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (English)"
                      value={
                        item.descriptionEnglish
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "descriptionEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (Somali)"
                      value={
                        item.descriptionSomali
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "descriptionSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Location"
                      value={
                        item.location
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Category"
                      value={
                        item.category
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={
                        item.image
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <label className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        Boolean(
                          item.featured
                        )
                      }
                      onChange={(e) =>
                        updateDestination(
                          index,
                          "featured",
                          e.target.checked
                        )
                      }
                    />

                    Featured
                  </label>

                </div>
              )
            )}

          </div>

        </section>

        {/* HIGHLIGHTS */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Tourism Highlights
              </h2>
            </div>

            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Highlight
            </button>

          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            <Field
              label="Heading (English)"
              name="highlightsHeadingEnglish"
              value={
                form.highlightsHeadingEnglish
              }
              onChange={handleChange}
            />

            <Field
              label="Heading (Somali)"
              name="highlightsHeadingSomali"
              value={
                form.highlightsHeadingSomali
              }
              onChange={handleChange}
            />

          </div>

          <div className="space-y-5">

            {form.highlights.map(
              (item, index) => (
                <div
                  key={
                    item._id ||
                    index
                  }
                  className="rounded-2xl border bg-gray-50 p-5"
                >

                  <div className="mb-5 flex justify-between">

                    <h3 className="font-bold">
                      Highlight #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeHighlight(
                          index
                        )
                      }
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>

                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <Field
                      label="Title (English)"
                      value={
                        item.titleEnglish
                      }
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          "titleEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Title (Somali)"
                      value={
                        item.titleSomali
                      }
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          "titleSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (English)"
                      value={
                        item.descriptionEnglish
                      }
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          "descriptionEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (Somali)"
                      value={
                        item.descriptionSomali
                      }
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          "descriptionSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={
                        item.image
                      }
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* GALLERY */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Gallery
              </h2>
            </div>

            <button
              type="button"
              onClick={addGallery}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Image
            </button>

          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            <Field
              label="Gallery Heading (English)"
              name="galleryHeadingEnglish"
              value={
                form.galleryHeadingEnglish
              }
              onChange={handleChange}
            />

            <Field
              label="Gallery Heading (Somali)"
              name="galleryHeadingSomali"
              value={
                form.galleryHeadingSomali
              }
              onChange={handleChange}
            />

          </div>

          <div className="space-y-5">

            {form.gallery.map(
              (item, index) => (
                <div
                  key={
                    item._id ||
                    index
                  }
                  className="rounded-2xl border bg-gray-50 p-5"
                >

                  <div className="mb-5 flex justify-between">

                    <h3 className="font-bold">
                      Gallery Image #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeGallery(
                          index
                        )
                      }
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>

                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <Field
                      label="Title (English)"
                      value={
                        item.titleEnglish
                      }
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "titleEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Title (Somali)"
                      value={
                        item.titleSomali
                      }
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "titleSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (English)"
                      value={
                        item.descriptionEnglish
                      }
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "descriptionEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description (Somali)"
                      value={
                        item.descriptionSomali
                      }
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "descriptionSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={
                        item.image
                      }
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={
                        item.titleEnglish ||
                        "Tourism"
                      }
                      className="mt-4 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                </div>
              )
            )}

          </div>

        </section>

        {/* CTA */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-bold">
            Call To Action
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Field
              label="CTA Title (English)"
              name="ctaTitleEnglish"
              value={
                form.ctaTitleEnglish
              }
              onChange={handleChange}
            />

            <Field
              label="CTA Title (Somali)"
              name="ctaTitleSomali"
              value={
                form.ctaTitleSomali
              }
              onChange={handleChange}
            />

            <TextArea
              label="CTA Text (English)"
              name="ctaTextEnglish"
              value={
                form.ctaTextEnglish
              }
              onChange={handleChange}
            />

            <TextArea
              label="CTA Text (Somali)"
              name="ctaTextSomali"
              value={
                form.ctaTextSomali
              }
              onChange={handleChange}
            />

          </div>

        </section>

        {/* SAVE */}

        <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border bg-white p-4 shadow-xl">

          <div>
            <p className="font-bold">
              {tourismId
                ? "Update Tourism"
                : "Create Tourism"}
            </p>

            <p className="text-sm text-gray-500">
              English + Somali content
            </p>
          </div>

          <div className="flex gap-3">

            {tourismId && (
              <button
                type="button"
                onClick={
                  handleDelete
                }
                className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white"
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

      </form>
    </div>
  );
}

// =====================================================
// REUSABLE INPUT
// =====================================================

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
}

// =====================================================
// REUSABLE TEXTAREA
// =====================================================

function TextArea({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={5}
        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
}