import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Loader2,
  BriefcaseBusiness,
  HeartPulse,
  GraduationCap,
  CreditCard,
  FileText,
  Landmark,
  Car,
  Building2,
  Users,
  ShieldCheck,
  Baby,
  Home,
  CheckCircle2,
  Folder,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// ICON MAP
// ============================================================

const iconMap = {
  business: BriefcaseBusiness,
  health: HeartPulse,
  education: GraduationCap,
  certificate: GraduationCap,
  "id-card": CreditCard,
  document: FileText,
  finance: Landmark,
  car: Car,
  transport: Car,
  building: Building2,
  users: Users,
  family: Users,
  security: ShieldCheck,
  child: Baby,
  housing: Home,
  folder: Folder,
};

const getCategoryIcon = (iconName) => {
  const key = String(iconName || "")
    .toLowerCase()
    .trim();

  return iconMap[key] || Folder;
};

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  name_en: "",
  name_so: "",
  description_en: "",
  description_so: "",
  icon: "folder",
  is_active: true,
};

// ============================================================
// COMPONENT
// ============================================================

function Categories() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    ...emptyForm,
  });

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");

      const data =
        response.data?.categories ??
        response.data?.data ??
        response.data ??
        [];

      setCategories(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Load categories error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================================================
  // BODY SCROLL LOCK
  // ==========================================================

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================================
  // ADD CATEGORY
  // ==========================================================

  const handleAddCategory = () => {
    setEditingCategory(null);

    setForm({
      ...emptyForm,
    });

    setShowModal(true);
  };

  // ==========================================================
  // EDIT CATEGORY
  // ==========================================================

  const handleEditCategory = (category) => {
    setEditingCategory(category);

    setForm({
      name_en: category.name_en || "",
      name_so: category.name_so || "",
      description_en:
        category.description_en || "",
      description_so:
        category.description_so || "",
      icon: category.icon || "folder",
      is_active:
        category.is_active ?? true,
    });

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingCategory(null);

    setForm({
      ...emptyForm,
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!form.name_en.trim()) {
      alert(
        "English category name is required."
      );
      return;
    }

    if (!form.name_so.trim()) {
      alert(
        "Somali category name is required."
      );
      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      name_en: form.name_en.trim(),
      name_so: form.name_so.trim(),

      description_en:
        form.description_en.trim(),

      description_so:
        form.description_so.trim(),

      icon: form.icon,

      is_active: form.is_active,
    };

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    try {
      setSaving(true);

      if (editingCategory) {
        await api.put(
          `/categories/${editingCategory._id}`,
          payload
        );

        alert(
          "Category updated successfully."
        );
      } else {
        await api.post(
          "/categories",
          payload
        );

        alert(
          "Category created successfully."
        );
      }

      setShowModal(false);
      setEditingCategory(null);

      setForm({
        ...emptyForm,
      });

      await loadCategories();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/categories/${id}`
      );

      alert(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const handleToggle = async (id) => {
    try {
      await api.patch(
        `/categories/${id}/toggle`
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Toggle category error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change category status."
      );
    }
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredCategories =
    categories.filter((category) => {
      const value =
        search.toLowerCase().trim();

      if (!value) {
        return true;
      }

      return (
        category.name_en
          ?.toLowerCase()
          .includes(value) ||

        category.name_so
          ?.toLowerCase()
          .includes(value) ||

        category.description_en
          ?.toLowerCase()
          .includes(value) ||

        category.description_so
          ?.toLowerCase()
          .includes(value)
      );
    });

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalCategories =
    categories.length;

  const activeCategories =
    categories.filter(
      (category) =>
        category.is_active
    ).length;

  const inactiveCategories =
    categories.filter(
      (category) =>
        !category.is_active
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="p-4 md:p-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Service Categories
          </h1>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Manage categories used to organize
            government services.
          </p>

        </div>

        {/* ADD BUTTON */}

        <button
          type="button"
          onClick={handleAddCategory}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            h-11
            px-5
            rounded-xl
            bg-green-700
            hover:bg-green-800
            text-white
            text-sm
            font-semibold
            shadow-sm
            transition
          "
        >
          <Plus size={19} />

          Add Category
        </button>

      </div>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-5
        "
      >

        {/* TOTAL */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Total Categories
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-900
              mt-1
            "
          >
            {totalCategories}
          </p>

        </div>

        {/* ACTIVE */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Active
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-green-700
              mt-1
            "
          >
            {activeCategories}
          </p>

        </div>

        {/* INACTIVE */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Inactive
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-red-600
              mt-1
            "
          >
            {inactiveCategories}
          </p>

        </div>

      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-xl
          p-3
          mb-5
        "
      >

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search categories..."
            className="
              w-full
              h-11
              pl-10
              pr-4
              rounded-lg
              border
              border-slate-200
              bg-white
              text-sm
              text-slate-900
              outline-none
              focus:border-green-600
              focus:ring-2
              focus:ring-green-50
            "
          />

        </div>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-xl
          overflow-hidden
        "
      >

        {loading ? (

          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <Loader2
              size={32}
              className="
                animate-spin
                text-green-700
              "
            />

            <p
              className="
                text-sm
                text-slate-500
                mt-3
              "
            >
              Loading categories...
            </p>

          </div>

        ) : filteredCategories.length === 0 ? (

          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <Folder
              size={42}
              className="text-slate-300"
            />

            <p
              className="
                text-sm
                font-semibold
                text-slate-600
                mt-3
              "
            >
              No categories found
            </p>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              Try another search or create
              a new category.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* TABLE HEADER */}

              <thead
                className="
                  bg-slate-50
                  border-b
                  border-slate-200
                "
              >

                <tr>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      text-right
                      px-5
                      py-4
                      text-xs
                      font-bold
                      text-slate-600
                      uppercase
                    "
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {filteredCategories.map(
                  (category) => {

                    const Icon =
                      getCategoryIcon(
                        category.icon
                      );

                    return (
                      <tr
                        key={category._id}
                        className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50
                          transition
                        "
                      >

                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-[250px]
                            "
                          >

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-green-50
                                text-green-700
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >

                              <Icon size={20} />

                            </div>

                            <div className="min-w-0">

                              <p
                                className="
                                  font-semibold
                                  text-slate-900
                                  truncate
                                "
                              >
                                {
                                  category.name_en
                                }
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                  mt-1
                                  truncate
                                "
                              >
                                {
                                  category.name_so
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* DESCRIPTION */}

                        <td
                          className="
                            px-5
                            py-4
                            max-w-[360px]
                          "
                        >

                          <p
                            className="
                              text-sm
                              text-slate-600
                              truncate
                            "
                          >
                            {
                              category.description_en ||
                              category.description_so ||
                              "No description"
                            }
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              text-sm
                              font-semibold
                              ${
                                category.is_active
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            `}
                          >

                            <span
                              className={`
                                w-2
                                h-2
                                rounded-full
                                ${
                                  category.is_active
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
                              `}
                            />

                            {category.is_active
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              justify-end
                              gap-2
                            "
                          >

                            {/* TOGGLE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggle(
                                  category._id
                                )
                              }
                              title="Toggle status"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-green-50
                                hover:bg-green-100
                                text-green-700
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >

                              <Power size={16} />

                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditCategory(
                                  category
                                )
                              }
                              title="Edit category"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-blue-50
                                hover:bg-blue-100
                                text-blue-700
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >

                              <Pencil size={16} />

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  category._id
                                )
                              }
                              title="Delete category"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-red-50
                                hover:bg-red-100
                                text-red-600
                                flex
                                items-center
                                justify-center
                                transition
                              "
                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (

        <div
          className="
            fixed
            top-[94px]
            left-0
            right-0
            bottom-0
            z-[99999]
            bg-slate-950/60
            backdrop-blur-sm
            flex
            items-start
            justify-center
            overflow-y-auto
            px-3
            sm:px-5
            py-5
          "
        >

          {/* ==================================================
              MODAL CARD
          ================================================== */}

          <div
            className="
              w-full
              max-w-[760px]
              h-[calc(100vh-135px)]
              min-h-[500px]
              max-h-[650px]
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
              flex
              flex-col
              border
              border-slate-200
            "
          >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
              className="
                shrink-0
                h-[72px]
                px-5
                border-b
                border-slate-200
                bg-white
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    text-green-700
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  {editingCategory ? (
                    <Pencil size={19} />
                  ) : (
                    <Plus size={20} />
                  )}

                </div>

                <div className="min-w-0">

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                      truncate
                    "
                  >
                    {editingCategory
                      ? "Edit Service Category"
                      : "Add Service Category"}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >
                    {editingCategory
                      ? "Update category information"
                      : "Create a new service category"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  hover:bg-slate-100
                  hover:text-slate-900
                  transition
                  disabled:opacity-40
                  shrink-0
                "
              >

                <X size={21} />

              </button>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="
                flex
                flex-col
                flex-1
                min-h-0
              "
            >

              {/* ==================================================
                  SCROLLING BODY
              ================================================== */}

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  px-5
                  py-5
                "
              >

                {/* ==============================================
                    CATEGORY NAMES
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                    mb-4
                  "
                >

                  {/* ENGLISH */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Category Name — English

                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_en"
                      value={form.name_en}
                      onChange={handleChange}
                      placeholder="Business Services"
                      autoComplete="off"
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                  {/* SOMALI */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Category Name — Somali

                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name_so"
                      value={form.name_so}
                      onChange={handleChange}
                      placeholder="Adeegyada Ganacsiga"
                      autoComplete="off"
                      className="
                        w-full
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                </div>

                {/* ==============================================
                    DESCRIPTIONS
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                    mb-4
                  "
                >

                  {/* ENGLISH DESCRIPTION */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Description — English
                    </label>

                    <textarea
                      name="description_en"
                      value={
                        form.description_en
                      }
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe this category..."
                      className="
                        w-full
                        px-3
                        py-2.5
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        resize-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                  {/* SOMALI DESCRIPTION */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Description — Somali
                    </label>

                    <textarea
                      name="description_so"
                      value={
                        form.description_so
                      }
                      onChange={handleChange}
                      rows={4}
                      placeholder="Sharax qaybtaan..."
                      className="
                        w-full
                        px-3
                        py-2.5
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        text-slate-900
                        outline-none
                        resize-none
                        placeholder:text-slate-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-50
                      "
                    />

                  </div>

                </div>

                {/* ==============================================
                    ICON + STATUS
                ============================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  {/* ICON */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Category Icon
                    </label>

                    <div
                      className="
                        flex
                        gap-2
                      "
                    >

                      <select
                        name="icon"
                        value={form.icon}
                        onChange={handleChange}
                        className="
                          flex-1
                          min-w-0
                          h-11
                          px-3
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          text-sm
                          text-slate-900
                          outline-none
                          focus:border-green-600
                          focus:ring-2
                          focus:ring-green-50
                        "
                      >

                        <option value="folder">
                          General
                        </option>

                        <option value="business">
                          Business
                        </option>

                        <option value="health">
                          Health
                        </option>

                        <option value="education">
                          Education
                        </option>

                        <option value="id-card">
                          Identity
                        </option>

                        <option value="passport">
                          Passport
                        </option>

                        <option value="finance">
                          Finance
                        </option>

                        <option value="car">
                          Transport
                        </option>

                        <option value="building">
                          Building
                        </option>

                        <option value="users">
                          Users
                        </option>

                        <option value="security">
                          Security
                        </option>

                        <option value="child">
                          Child
                        </option>

                        <option value="housing">
                          Housing
                        </option>

                        <option value="document">
                          Documents
                        </option>

                      </select>

                      {/* ICON PREVIEW */}

                      <div
                        className="
                          w-11
                          h-11
                          shrink-0
                          rounded-lg
                          border
                          border-green-200
                          bg-green-50
                          text-green-700
                          flex
                          items-center
                          justify-center
                        "
                      >

                        {(() => {
                          const PreviewIcon =
                            getCategoryIcon(
                              form.icon
                            );

                          return (
                            <PreviewIcon
                              size={21}
                            />
                          );
                        })()}

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                        mb-1.5
                      "
                    >
                      Status
                    </label>

                    <label
                      className="
                        h-11
                        px-3
                        rounded-lg
                        border
                        border-slate-200
                        flex
                        items-center
                        justify-between
                        cursor-pointer
                        hover:bg-slate-50
                        transition
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <div
                          className={`
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            ${
                              form.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >

                          <Power size={16} />

                        </div>

                        <div>

                          <p
                            className="
                              text-xs
                              font-semibold
                              text-slate-800
                            "
                          >
                            {form.is_active
                              ? "Active"
                              : "Inactive"}
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-slate-400
                            "
                          >
                            {form.is_active
                              ? "Available for services"
                              : "Hidden"}
                          </p>

                        </div>

                      </div>

                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="
                          w-4
                          h-4
                          accent-green-700
                        "
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div
                className="
                  shrink-0
                  h-[68px]
                  px-5
                  border-t
                  border-slate-200
                  bg-white
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <p
                  className="
                    hidden
                    sm:block
                    text-[11px]
                    text-slate-400
                  "
                >
                  <span className="text-red-500">
                    *
                  </span>{" "}
                  Required fields
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    ml-auto
                  "
                >

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="
                      h-10
                      px-5
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      text-sm
                      font-semibold
                      text-slate-700
                      hover:bg-slate-50
                      transition
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  {/* SAVE */}

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      h-10
                      min-w-[145px]
                      px-5
                      rounded-lg
                      bg-green-700
                      hover:bg-green-800
                      text-white
                      text-sm
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-sm
                      transition
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >

                    {saving ? (
                      <>
                        <Loader2
                          size={17}
                          className="
                            animate-spin
                          "
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={17}
                        />

                        {editingCategory
                          ? "Save Changes"
                          : "Save Category"}
                      </>
                    )}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;