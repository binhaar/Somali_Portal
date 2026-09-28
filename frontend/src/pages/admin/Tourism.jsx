import React, { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  MapPin,
  Image as ImageIcon,
  Star,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import {
  getAllTourism,
  createTourism,
  updateTourism,
  deleteTourism,
} from "../../services/tourismApi";

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
  subtitle: "",
  heroImage: "",
  heroTitle: "",
  heroDescription: "",

  introductionTitle: "",
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

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 5 }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <textarea
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      >
        {children}
      </select>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-green-100 p-3 text-green-700">
        <Icon size={22} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function TourismAdmin() {
  const [form, setForm] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTourism();
  }, []);

  const loadTourism = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTourism();

      const data = response?.data?.data || [];

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tourism:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load tourism information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDestinationChange = (index, field, value) => {
    setForm((prev) => {
      const destinations = [...prev.destinations];

      destinations[index] = {
        ...destinations[index],
        [field]: value,
      };

      return {
        ...prev,
        destinations,
      };
    });
  };

  const addDestination = () => {
    setForm((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        {
          ...emptyDestination,
          order: prev.destinations.length + 1,
        },
      ],
    }));
  };

  const removeDestination = (index) => {
    setForm((prev) => ({
      ...prev,
      destinations: prev.destinations.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleHighlightChange = (index, field, value) => {
    setForm((prev) => {
      const highlights = [...prev.highlights];

      highlights[index] = {
        ...highlights[index],
        [field]: value,
      };

      return {
        ...prev,
        highlights,
      };
    });
  };

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        {
          ...emptyHighlight,
          order: prev.highlights.length + 1,
        },
      ],
    }));
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleGalleryChange = (index, field, value) => {
    setForm((prev) => {
      const gallery = [...prev.gallery];

      gallery[index] = {
        ...gallery[index],
        [field]: value,
      };

      return {
        ...prev,
        gallery,
      };
    });
  };

  const addGallery = () => {
    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          ...emptyGallery,
          order: prev.gallery.length + 1,
        },
      ],
    }));
  };

  const removeGallery = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const editTourism = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "Tourism",
      slug: item.slug || "tourism",
      subtitle: item.subtitle || "",
      heroImage: item.heroImage || "",
      heroTitle: item.heroTitle || "",
      heroDescription: item.heroDescription || "",

      introductionTitle: item.introductionTitle || "",
      introduction: item.introduction || "",

      destinationsHeading:
        item.destinationsHeading || "Popular Destinations",
      destinations: item.destinations || [],

      highlightsHeading:
        item.highlightsHeading || "Tourism Highlights",
      highlights: item.highlights || [],

      galleryHeading: item.galleryHeading || "Gallery",
      gallery: item.gallery || [],

      ctaTitle: item.ctaTitle || "",
      ctaText: item.ctaText || "",

      status: item.status || "active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingId) {
        await updateTourism(editingId, form);
        setMessage("Tourism information updated successfully.");
      } else {
        await createTourism(form);
        setMessage("Tourism information created successfully.");
      }

      await loadTourism();

      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save tourism:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to save tourism information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tourism information?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      await deleteTourism(id);

      setMessage("Tourism information deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadTourism();
    } catch (err) {
      console.error("Failed to delete tourism:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete tourism information."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tourism Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage tourism information, destinations, highlights and
                gallery content.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              New Tourism
            </button>
          </div>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFORMATION */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SectionHeader
              icon={MapPin}
              title="Basic Information"
              description="Main tourism page information."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                placeholder="Tourism"
              />

              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) =>
                  handleChange("slug", e.target.value)
                }
                placeholder="tourism"
              />

              <div className="md:col-span-2">
                <Input
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(e) =>
                    handleChange("subtitle", e.target.value)
                  }
                  placeholder="Discover the beauty of Somalia"
                />
              </div>

              <Select
                label="Status"
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>

          {/* HERO */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SectionHeader
              icon={ImageIcon}
              title="Hero Section"
              description="The main banner shown at the top of the Tourism page."
            />

            <div className="space-y-5">
              <Input
                label="Hero Image URL"
                value={form.heroImage}
                onChange={(e) =>
                  handleChange("heroImage", e.target.value)
                }
                placeholder="https://example.com/tourism.jpg"
              />

              {form.heroImage && (
                <img
                  src={form.heroImage}
                  alt="Hero Preview"
                  className="h-64 w-full rounded-2xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              <Input
                label="Hero Title"
                value={form.heroTitle}
                onChange={(e) =>
                  handleChange("heroTitle", e.target.value)
                }
                placeholder="Discover Somalia"
              />

              <TextArea
                label="Hero Description"
                value={form.heroDescription}
                onChange={(e) =>
                  handleChange("heroDescription", e.target.value)
                }
                placeholder="Explore the natural beauty, culture and heritage of Somalia."
                rows={4}
              />
            </div>
          </div>

          {/* INTRODUCTION */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SectionHeader
              icon={MapPin}
              title="Introduction"
              description="Introduction content for the Tourism page."
            />

            <div className="space-y-5">
              <Input
                label="Introduction Title"
                value={form.introductionTitle}
                onChange={(e) =>
                  handleChange(
                    "introductionTitle",
                    e.target.value
                  )
                }
                placeholder="Tourism in Somalia"
              />

              <TextArea
                label="Introduction"
                value={form.introduction}
                onChange={(e) =>
                  handleChange("introduction", e.target.value)
                }
                placeholder="Write tourism introduction..."
                rows={8}
              />
            </div>
          </div>

          {/* DESTINATIONS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <SectionHeader
                icon={MapPin}
                title="Tourism Destinations"
                description="Add places and destinations visitors can explore."
              />

              <button
                type="button"
                onClick={addDestination}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Plus size={18} />
                Add Destination
              </button>
            </div>

            <div className="mb-5">
              <Input
                label="Destinations Heading"
                value={form.destinationsHeading}
                onChange={(e) =>
                  handleChange(
                    "destinationsHeading",
                    e.target.value
                  )
                }
                placeholder="Popular Destinations"
              />
            </div>

            <div className="space-y-6">
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
                    <h3 className="font-bold text-gray-900">
                      Destination #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeDestination(index)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Title"
                      value={destination.title}
                      onChange={(e) =>
                        handleDestinationChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Laas Geel"
                    />

                    <Input
                      label="Location"
                      value={destination.location}
                      onChange={(e) =>
                        handleDestinationChange(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Somaliland"
                    />

                    <Input
                      label="Category"
                      value={destination.category}
                      onChange={(e) =>
                        handleDestinationChange(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                      placeholder="Historical Site"
                    />

                    <Input
                      label="Order"
                      type="number"
                      value={destination.order}
                      onChange={(e) =>
                        handleDestinationChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Image URL"
                        value={destination.image}
                        onChange={(e) =>
                          handleDestinationChange(
                            index,
                            "image",
                            e.target.value
                          )
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {destination.image && (
                      <div className="md:col-span-2">
                        <img
                          src={destination.image}
                          alt={destination.title}
                          className="h-52 w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <TextArea
                        label="Description"
                        value={destination.description}
                        onChange={(e) =>
                          handleDestinationChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe this destination..."
                        rows={4}
                      />
                    </div>

                    <Select
                      label="Status"
                      value={destination.status}
                      onChange={(e) =>
                        handleDestinationChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>

                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          checked={Boolean(destination.featured)}
                          onChange={(e) =>
                            handleDestinationChange(
                              index,
                              "featured",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />

                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Star size={16} />
                          Featured
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <SectionHeader
                icon={Star}
                title="Tourism Highlights"
                description="Add important tourism highlights."
              />

              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Plus size={18} />
                Add Highlight
              </button>
            </div>

            <div className="mb-5">
              <Input
                label="Highlights Heading"
                value={form.highlightsHeading}
                onChange={(e) =>
                  handleChange(
                    "highlightsHeading",
                    e.target.value
                  )
                }
                placeholder="Tourism Highlights"
              />
            </div>

            <div className="space-y-6">
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
                    <h3 className="font-bold text-gray-900">
                      Highlight #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Title"
                      value={highlight.title}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Beautiful Beaches"
                    />

                    <Input
                      label="Location"
                      value={highlight.location}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Mogadishu"
                    />

                    <Input
                      label="Category"
                      value={highlight.category}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                      placeholder="Nature"
                    />

                    <Input
                      label="Order"
                      type="number"
                      value={highlight.order}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Image URL"
                        value={highlight.image}
                        onChange={(e) =>
                          handleHighlightChange(
                            index,
                            "image",
                            e.target.value
                          )
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {highlight.image && (
                      <div className="md:col-span-2">
                        <img
                          src={highlight.image}
                          alt={highlight.title}
                          className="h-52 w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <TextArea
                        label="Description"
                        value={highlight.description}
                        onChange={(e) =>
                          handleHighlightChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe this highlight..."
                        rows={4}
                      />
                    </div>

                    <Select
                      label="Status"
                      value={highlight.status}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>

                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          checked={Boolean(highlight.featured)}
                          onChange={(e) =>
                            handleHighlightChange(
                              index,
                              "featured",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />

                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Star size={16} />
                          Featured
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <SectionHeader
                icon={Camera}
                title="Tourism Gallery"
                description="Add tourism photos to the public gallery."
              />

              <button
                type="button"
                onClick={addGallery}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                <Plus size={18} />
                Add Photo
              </button>
            </div>

            <div className="mb-5">
              <Input
                label="Gallery Heading"
                value={form.galleryHeading}
                onChange={(e) =>
                  handleChange(
                    "galleryHeading",
                    e.target.value
                  )
                }
                placeholder="Explore Somalia"
              />
            </div>

            <div className="space-y-6">
              {form.gallery.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No gallery photos added yet.
                </div>
              )}

              {form.gallery.map((photo, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                      Gallery Photo #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeGallery(index)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Title"
                      value={photo.title}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Somali Coast"
                    />

                    <Input
                      label="Order"
                      type="number"
                      value={photo.order}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Image URL"
                        value={photo.image}
                        onChange={(e) =>
                          handleGalleryChange(
                            index,
                            "image",
                            e.target.value
                          )
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {photo.image && (
                      <div className="md:col-span-2">
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="h-60 w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <TextArea
                        label="Description"
                        value={photo.description}
                        onChange={(e) =>
                          handleGalleryChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Photo description..."
                        rows={3}
                      />
                    </div>

                    <Select
                      label="Status"
                      value={photo.status}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SectionHeader
              icon={Star}
              title="Call To Action"
              description="Content shown near the bottom of the Tourism page."
            />

            <div className="space-y-5">
              <Input
                label="CTA Title"
                value={form.ctaTitle}
                onChange={(e) =>
                  handleChange("ctaTitle", e.target.value)
                }
                placeholder="Discover Somalia"
              />

              <TextArea
                label="CTA Text"
                value={form.ctaText}
                onChange={(e) =>
                  handleChange("ctaText", e.target.value)
                }
                placeholder="Explore the beauty and culture of Somalia."
                rows={4}
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="sticky bottom-4 z-20 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="font-semibold text-gray-900">
                  {editingId
                    ? "Editing Tourism Information"
                    : "Create Tourism Information"}
                </p>

                <p className="text-sm text-gray-500">
                  Save your changes to update the public Tourism page.
                </p>
              </div>

              <div className="flex gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingId ? "Update Tourism" : "Save Tourism"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* EXISTING RECORDS */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Existing Tourism Content
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2
                size={28}
                className="animate-spin text-green-700"
              />
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No tourism content has been created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {item.title || "Tourism"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.subtitle || "No subtitle"}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status || "active"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editTourism(item)}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}