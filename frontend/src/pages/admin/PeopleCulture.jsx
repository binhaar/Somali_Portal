import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Users,
  Palette,
  Camera,
} from "lucide-react";

import {
  getAllPeopleCulture,
  createPeopleCulture,
  updatePeopleCulture,
  deletePeopleCulture,
} from "../../services/peopleCultureApi";


/* =====================================================
   EMPTY PEOPLE
===================================================== */

const emptyPeople = {
  titleEnglish: "",
  titleSomali: "",
  contentEnglish: "",
  contentSomali: "",
  image: "",
  order: 0,
  status: "active",
};


/* =====================================================
   EMPTY CULTURE
===================================================== */

const emptyCulture = {
  titleEnglish: "",
  titleSomali: "",
  contentEnglish: "",
  contentSomali: "",
  image: "",
  order: 0,
  status: "active",
};


/* =====================================================
   EMPTY GALLERY
===================================================== */

const emptyGallery = {
  titleEnglish: "",
  titleSomali: "",
  descriptionEnglish: "",
  descriptionSomali: "",
  image: "",
  order: 0,
  status: "active",
};


/* =====================================================
   INITIAL FORM
===================================================== */

const initialForm = {
  titleEnglish: "People & Culture",
  titleSomali: "Dadka & Dhaqanka",

  subtitleEnglish: "",
  subtitleSomali: "",

  slug: "people-culture",

  heroImage: "",

  introductionTitleEnglish: "",
  introductionTitleSomali: "",

  introductionEnglish: "",
  introductionSomali: "",

  peopleHeadingEnglish: "People of Somalia",
  peopleHeadingSomali: "Dadka Soomaaliya",

  people: [],

  cultureHeadingEnglish: "Somali Culture",
  cultureHeadingSomali: "Dhaqanka Soomaaliyeed",

  culture: [],

  galleryHeadingEnglish: "People & Culture Gallery",
  galleryHeadingSomali: "Sawirrada Dadka & Dhaqanka",

  gallery: [],

  ctaTitleEnglish: "",
  ctaTitleSomali: "",

  ctaTextEnglish: "",
  ctaTextSomali: "",

  status: "active",
};


/* =====================================================
   COMPONENT
===================================================== */

function PeopleCulture() {
  const [form, setForm] = useState(initialForm);

  const [recordId, setRecordId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    loadContent();
  }, []);


  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPeopleCulture();

      const records = response.data?.data || [];

      if (records.length > 0) {
        const data = records[0];

        setRecordId(data._id);

        setForm({
          ...initialForm,
          ...data,

          people: data.people || [],

          culture: data.culture || [],

          gallery: data.gallery || [],
        });
      }
    } catch (err) {
      console.error(
        "People & Culture loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load People & Culture."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     BASIC FIELD CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =====================================================
     PEOPLE CHANGE
  ===================================================== */

  const handlePeopleChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const people = [...prev.people];

      people[index] = {
        ...people[index],
        [field]: value,
      };

      return {
        ...prev,
        people,
      };
    });
  };


  /* =====================================================
     CULTURE CHANGE
  ===================================================== */

  const handleCultureChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const culture = [...prev.culture];

      culture[index] = {
        ...culture[index],
        [field]: value,
      };

      return {
        ...prev,
        culture,
      };
    });
  };


  /* =====================================================
     GALLERY CHANGE
  ===================================================== */

  const handleGalleryChange = (
    index,
    field,
    value
  ) => {
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


  /* =====================================================
     ADD PEOPLE
  ===================================================== */

  const addPeople = () => {
    setForm((prev) => ({
      ...prev,
      people: [
        ...prev.people,
        {
          ...emptyPeople,
          order: prev.people.length + 1,
        },
      ],
    }));
  };


  /* =====================================================
     REMOVE PEOPLE
  ===================================================== */

  const removePeople = (index) => {
    setForm((prev) => ({
      ...prev,
      people: prev.people.filter(
        (_, i) => i !== index
      ),
    }));
  };


  /* =====================================================
     ADD CULTURE
  ===================================================== */

  const addCulture = () => {
    setForm((prev) => ({
      ...prev,
      culture: [
        ...prev.culture,
        {
          ...emptyCulture,
          order: prev.culture.length + 1,
        },
      ],
    }));
  };


  /* =====================================================
     REMOVE CULTURE
  ===================================================== */

  const removeCulture = (index) => {
    setForm((prev) => ({
      ...prev,
      culture: prev.culture.filter(
        (_, i) => i !== index
      ),
    }));
  };


  /* =====================================================
     ADD GALLERY
  ===================================================== */

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


  /* =====================================================
     REMOVE GALLERY
  ===================================================== */

  const removeGallery = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (_, i) => i !== index
      ),
    }));
  };


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      let response;

      if (recordId) {
        response = await updatePeopleCulture(
          recordId,
          form
        );
      } else {
        response = await createPeopleCulture(
          form
        );
      }

      const saved =
        response.data?.data || response.data;

      setRecordId(saved._id);

      setForm({
        ...initialForm,
        ...saved,

        people: saved.people || [],

        culture: saved.culture || [],

        gallery: saved.gallery || [],
      });

      setMessage(
        recordId
          ? "People & Culture updated successfully."
          : "People & Culture created successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "People & Culture save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save People & Culture."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {
    if (!recordId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete People & Culture?"
    );

    if (!confirmed) return;

    try {
      await deletePeopleCulture(recordId);

      setRecordId(null);

      setForm(initialForm);

      setMessage(
        "People & Culture deleted successfully."
      );
    } catch (err) {
      console.error(
        "People & Culture delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete People & Culture."
      );
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

          <p className="text-gray-600">
            Loading People & Culture...
          </p>
        </div>
      </div>
    );
  }


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              People & Culture
            </h1>

            <p className="mt-2 text-gray-600">
              Manage People & Culture content in
              English and Somali.
            </p>
          </div>

          <div className="flex gap-3">

            {recordId && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}

            <button
              type="submit"
              form="people-culture-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : recordId
                ? "Update"
                : "Save"}
            </button>

          </div>
        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}


        <form
          id="people-culture-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <Field
                label="Title English"
                name="titleEnglish"
                value={form.titleEnglish}
                onChange={handleChange}
                required
              />

              <Field
                label="Title Somali"
                name="titleSomali"
                value={form.titleSomali}
                onChange={handleChange}
                required
              />

              <Field
                label="Subtitle English"
                name="subtitleEnglish"
                value={form.subtitleEnglish}
                onChange={handleChange}
              />

              <Field
                label="Subtitle Somali"
                name="subtitleSomali"
                value={form.subtitleSomali}
                onChange={handleChange}
              />

              <Field
                label="Slug"
                name="slug"
                value="people-culture"
                onChange={() => {}}
                disabled
              />

              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "inactive",
                    label: "Inactive",
                  },
                ]}
              />

            </div>
          </section>


          {/* =================================================
              HERO
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <ImageIcon className="text-green-700" />

              <h2 className="text-xl font-bold text-gray-900">
                Hero Section
              </h2>
            </div>

            <Field
              label="Hero Image URL"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              placeholder="https://..."
            />

            {form.heroImage && (
              <img
                src={form.heroImage}
                alt="Hero Preview"
                className="mt-5 h-64 w-full rounded-xl object-cover"
              />
            )}

          </section>


          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Introduction
            </h2>

            <div className="space-y-6">

              <div className="grid gap-6 md:grid-cols-2">

                <Field
                  label="Introduction Title English"
                  name="introductionTitleEnglish"
                  value={
                    form.introductionTitleEnglish
                  }
                  onChange={handleChange}
                />

                <Field
                  label="Introduction Title Somali"
                  name="introductionTitleSomali"
                  value={
                    form.introductionTitleSomali
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <TextArea
                  label="Introduction English"
                  name="introductionEnglish"
                  value={form.introductionEnglish}
                  onChange={handleChange}
                />

                <TextArea
                  label="Introduction Somali"
                  name="introductionSomali"
                  value={form.introductionSomali}
                  onChange={handleChange}
                />

              </div>

            </div>
          </section>


          {/* =================================================
              PEOPLE
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div className="flex items-center gap-3">

                <Users className="text-green-700" />

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    People
                  </h2>

                  <p className="text-sm text-gray-500">
                    Add information about the people
                    of Somalia.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={addPeople}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white hover:bg-green-800"
              >
                <Plus size={18} />
                Add People Section
              </button>

            </div>


            <div className="mb-6 grid gap-6 md:grid-cols-2">

              <Field
                label="People Heading English"
                name="peopleHeadingEnglish"
                value={form.peopleHeadingEnglish}
                onChange={handleChange}
              />

              <Field
                label="People Heading Somali"
                name="peopleHeadingSomali"
                value={form.peopleHeadingSomali}
                onChange={handleChange}
              />

            </div>


            <div className="space-y-6">

              {form.people.length === 0 && (
                <EmptyMessage>
                  No People sections added yet.
                </EmptyMessage>
              )}

              {form.people.map((item, index) => (

                <div
                  key={item._id || index}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="font-bold text-gray-900">
                      People Section {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removePeople(index)
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  <div className="grid gap-6 md:grid-cols-2">

                    <Field
                      label="Title English"
                      value={item.titleEnglish}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "titleEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Title Somali"
                      value={item.titleSomali}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "titleSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Content English"
                      value={item.contentEnglish}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "contentEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Content Somali"
                      value={item.contentSomali}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "contentSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={item.image}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Order"
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Select
                      label="Status"
                      value={item.status}
                      onChange={(e) =>
                        handlePeopleChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                      options={[
                        {
                          value: "active",
                          label: "Active",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                        },
                      ]}
                    />

                  </div>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.titleEnglish}
                      className="mt-5 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                </div>

              ))}

            </div>
          </section>


          {/* =================================================
              CULTURE
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div className="flex items-center gap-3">

                <Palette className="text-green-700" />

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Culture
                  </h2>

                  <p className="text-sm text-gray-500">
                    Add information about Somali culture.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={addCulture}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white hover:bg-green-800"
              >
                <Plus size={18} />
                Add Culture Section
              </button>

            </div>


            <div className="mb-6 grid gap-6 md:grid-cols-2">

              <Field
                label="Culture Heading English"
                name="cultureHeadingEnglish"
                value={form.cultureHeadingEnglish}
                onChange={handleChange}
              />

              <Field
                label="Culture Heading Somali"
                name="cultureHeadingSomali"
                value={form.cultureHeadingSomali}
                onChange={handleChange}
              />

            </div>


            <div className="space-y-6">

              {form.culture.length === 0 && (
                <EmptyMessage>
                  No Culture sections added yet.
                </EmptyMessage>
              )}

              {form.culture.map((item, index) => (

                <div
                  key={item._id || index}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="font-bold text-gray-900">
                      Culture Section {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeCulture(index)
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  <div className="grid gap-6 md:grid-cols-2">

                    <Field
                      label="Title English"
                      value={item.titleEnglish}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "titleEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Title Somali"
                      value={item.titleSomali}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "titleSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Content English"
                      value={item.contentEnglish}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "contentEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Content Somali"
                      value={item.contentSomali}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "contentSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={item.image}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Order"
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Select
                      label="Status"
                      value={item.status}
                      onChange={(e) =>
                        handleCultureChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                      options={[
                        {
                          value: "active",
                          label: "Active",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                        },
                      ]}
                    />

                  </div>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.titleEnglish}
                      className="mt-5 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                </div>

              ))}

            </div>
          </section>


          {/* =================================================
              GALLERY
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div className="flex items-center gap-3">

                <Camera className="text-green-700" />

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Gallery
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage People & Culture images.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={addGallery}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white hover:bg-green-800"
              >
                <Plus size={18} />
                Add Gallery Image
              </button>

            </div>


            <div className="mb-6 grid gap-6 md:grid-cols-2">

              <Field
                label="Gallery Heading English"
                name="galleryHeadingEnglish"
                value={form.galleryHeadingEnglish}
                onChange={handleChange}
              />

              <Field
                label="Gallery Heading Somali"
                name="galleryHeadingSomali"
                value={form.galleryHeadingSomali}
                onChange={handleChange}
              />

            </div>


            <div className="space-y-6">

              {form.gallery.length === 0 && (
                <EmptyMessage>
                  No gallery images added yet.
                </EmptyMessage>
              )}

              {form.gallery.map((item, index) => (

                <div
                  key={item._id || index}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="font-bold text-gray-900">
                      Gallery Image {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeGallery(index)
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  <div className="grid gap-6 md:grid-cols-2">

                    <Field
                      label="Title English"
                      value={item.titleEnglish}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "titleEnglish",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Title Somali"
                      value={item.titleSomali}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "titleSomali",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description English"
                      value={
                        item.descriptionEnglish
                      }
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "descriptionEnglish",
                          e.target.value
                        )
                      }
                    />

                    <TextArea
                      label="Description Somali"
                      value={
                        item.descriptionSomali
                      }
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "descriptionSomali",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Image URL"
                      value={item.image}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />

                    <Field
                      label="Order"
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "order",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Select
                      label="Status"
                      value={item.status}
                      onChange={(e) =>
                        handleGalleryChange(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                      options={[
                        {
                          value: "active",
                          label: "Active",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                        },
                      ]}
                    />

                  </div>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.titleEnglish}
                      className="mt-5 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                </div>

              ))}

            </div>
          </section>


          {/* =================================================
              CTA
          ================================================= */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Call To Action
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <Field
                label="CTA Title English"
                name="ctaTitleEnglish"
                value={form.ctaTitleEnglish}
                onChange={handleChange}
              />

              <Field
                label="CTA Title Somali"
                name="ctaTitleSomali"
                value={form.ctaTitleSomali}
                onChange={handleChange}
              />

              <TextArea
                label="CTA Text English"
                name="ctaTextEnglish"
                value={form.ctaTextEnglish}
                onChange={handleChange}
              />

              <TextArea
                label="CTA Text Somali"
                name="ctaTextSomali"
                value={form.ctaTextSomali}
                onChange={handleChange}
              />

            </div>
          </section>


          {/* =================================================
              BOTTOM SAVE
          ================================================= */}

          <div className="flex justify-end pb-10">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-8 py-3 font-semibold text-white shadow-sm hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={19} />

              {saving
                ? "Saving..."
                : recordId
                ? "Update People & Culture"
                : "Save People & Culture"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
      />
    </div>
  );
}


/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
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

      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={6}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}


/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}


/* =========================================================
   EMPTY MESSAGE
========================================================= */

function EmptyMessage({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}


export default PeopleCulture;