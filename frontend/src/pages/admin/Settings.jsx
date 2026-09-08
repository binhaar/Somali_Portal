import React, { useEffect, useState } from "react";

import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  Settings as SettingsIcon,
  ShieldCheck,
  Wrench,
  UserPlus,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Image,
  Languages,
} from "lucide-react";

import api from "../../services/api";


// =====================================================
// MAIN SETTINGS COMPONENT
// =====================================================

function Settings() {
  const [settings, setSettings] = useState({
    portal_name_en: "",
    portal_name_so: "",

    portal_description_en: "",
    portal_description_so: "",

    logo_url: "",
    favicon_url: "",

    official_website: "",

    phone: "",
    email: "",

    address_en: "",
    address_so: "",

    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
    instagram_url: "",

    default_language: "so",

    maintenance_mode: false,
    registration_enabled: true,
    public_services_enabled: true,
    notifications_enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ===================================================
  // FETCH SETTINGS
  // ===================================================

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get("/settings");

      const data = response?.data?.settings;

      if (data) {
        setSettings({
          portal_name_en: data.portal_name_en || "",
          portal_name_so: data.portal_name_so || "",

          portal_description_en:
            data.portal_description_en || "",

          portal_description_so:
            data.portal_description_so || "",

          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",

          official_website:
            data.official_website || "",

          phone: data.phone || "",
          email: data.email || "",

          address_en: data.address_en || "",
          address_so: data.address_so || "",

          facebook_url:
            data.facebook_url || "",

          twitter_url:
            data.twitter_url || "",

          youtube_url:
            data.youtube_url || "",

          instagram_url:
            data.instagram_url || "",

          default_language:
            data.default_language || "so",

          maintenance_mode:
            Boolean(data.maintenance_mode),

          registration_enabled:
            data.registration_enabled !== false,

          public_services_enabled:
            data.public_services_enabled !== false,

          notifications_enabled:
            data.notifications_enabled !== false,
        });
      }
    } catch (err) {
      console.error(
        "FETCH SETTINGS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // HANDLE TOGGLE
  // ===================================================

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ===================================================
  // SAVE SETTINGS
  // ===================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/settings",
        settings
      );

      const updatedSettings =
        response?.data?.settings;

      if (updatedSettings) {
        setSettings({
          portal_name_en:
            updatedSettings.portal_name_en || "",

          portal_name_so:
            updatedSettings.portal_name_so || "",

          portal_description_en:
            updatedSettings.portal_description_en ||
            "",

          portal_description_so:
            updatedSettings.portal_description_so ||
            "",

          logo_url:
            updatedSettings.logo_url || "",

          favicon_url:
            updatedSettings.favicon_url || "",

          official_website:
            updatedSettings.official_website || "",

          phone:
            updatedSettings.phone || "",

          email:
            updatedSettings.email || "",

          address_en:
            updatedSettings.address_en || "",

          address_so:
            updatedSettings.address_so || "",

          facebook_url:
            updatedSettings.facebook_url || "",

          twitter_url:
            updatedSettings.twitter_url || "",

          youtube_url:
            updatedSettings.youtube_url || "",

          instagram_url:
            updatedSettings.instagram_url || "",

          default_language:
            updatedSettings.default_language ||
            "so",

          maintenance_mode:
            Boolean(
              updatedSettings.maintenance_mode
            ),

          registration_enabled:
            updatedSettings.registration_enabled !==
            false,

          public_services_enabled:
            updatedSettings.public_services_enabled !==
            false,

          notifications_enabled:
            updatedSettings.notifications_enabled !==
            false,
        });
      }

      setMessage(
        "Settings updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "SAVE SETTINGS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-slate-200
              border-t-green-700
              rounded-full
              animate-spin
            "
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading settings...
          </p>

        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="space-y-6 pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >

          {/* TITLE */}

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-slate-900
                flex
                items-center
                justify-center
              "
            >
              <SettingsIcon
                className="w-6 h-6 text-white"
              />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Settings
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage government portal configuration
              </p>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={fetchSettings}
              disabled={saving}
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
                transition
                disabled:opacity-50
              "
            >

              <RefreshCw className="w-4 h-4" />

              Refresh

            </button>


            <button
              type="submit"
              form="settings-form"
              disabled={saving}
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                bg-green-700
                text-white
                text-sm
                font-semibold
                hover:bg-green-800
                transition
                disabled:opacity-50
              "
            >

              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}

            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            border
            border-green-200
            bg-green-50
            text-green-800
          "
        >

          <CheckCircle2 className="w-5 h-5 shrink-0" />

          <p className="text-sm font-medium">
            {message}
          </p>

        </div>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            text-red-800
          "
        >

          <AlertCircle className="w-5 h-5 shrink-0" />

          <p className="text-sm font-medium">
            {error}
          </p>

        </div>
      )}


      {/* =================================================
          FORM
      ================================================= */}

      <form
        id="settings-form"
        onSubmit={handleSave}
        className="space-y-6"
      >


        {/* =================================================
            PORTAL INFORMATION
        ================================================= */}

        <Section
          icon={Building2}
          title="Portal Information"
          description="Basic information displayed throughout the government portal."
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <Input
              label="Portal Name (English)"
              name="portal_name_en"
              value={settings.portal_name_en}
              onChange={handleChange}
              placeholder="Somalia Government Portal"
              required
            />

            <Input
              label="Portal Name (Somali)"
              name="portal_name_so"
              value={settings.portal_name_so}
              onChange={handleChange}
              placeholder="Bogga Dowladda Soomaaliya"
              required
            />

            <Textarea
              label="Portal Description (English)"
              name="portal_description_en"
              value={
                settings.portal_description_en
              }
              onChange={handleChange}
              placeholder="Official Somalia Government Portal"
            />

            <Textarea
              label="Portal Description (Somali)"
              name="portal_description_so"
              value={
                settings.portal_description_so
              }
              onChange={handleChange}
              placeholder="Bogga rasmiga ah ee Dowladda Soomaaliya"
            />

          </div>

        </Section>


        {/* =================================================
            BRANDING
        ================================================= */}

        <Section
          icon={Image}
          title="Branding"
          description="Manage the portal logo and browser favicon."
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <Input
              label="Logo URL"
              name="logo_url"
              value={settings.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              icon={LinkIcon}
            />

            <Input
              label="Favicon URL"
              name="favicon_url"
              value={settings.favicon_url}
              onChange={handleChange}
              placeholder="https://example.com/favicon.ico"
              icon={LinkIcon}
            />

          </div>


          {/* LOGO PREVIEW */}

          {settings.logo_url && (
            <div className="mt-6">

              <p className="text-sm font-semibold text-slate-700 mb-3">
                Logo Preview
              </p>

              <div
                className="
                  w-40
                  h-28
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                <img
                  src={settings.logo_url}
                  alt="Government portal logo"
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                  "
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>

            </div>
          )}

        </Section>


        {/* =================================================
            CONTACT
        ================================================= */}

        <Section
          icon={Phone}
          title="Contact Information"
          description="Official contact details displayed to portal visitors."
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <Input
              label="Official Phone"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="+252 ..."
              icon={Phone}
            />

            <Input
              label="Official Email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="info@example.gov.so"
              icon={Mail}
            />

            <Textarea
              label="Address (English)"
              name="address_en"
              value={settings.address_en}
              onChange={handleChange}
              placeholder="Mogadishu, Somalia"
              icon={MapPin}
            />

            <Textarea
              label="Address (Somali)"
              name="address_so"
              value={settings.address_so}
              onChange={handleChange}
              placeholder="Muqdisho, Soomaaliya"
              icon={MapPin}
            />

          </div>

        </Section>


        {/* =================================================
            WEBSITE & SOCIAL MEDIA
        ================================================= */}

        <Section
          icon={Globe}
          title="Website & Social Media"
          description="Manage official website and social media addresses."
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <Input
              label="Official Website"
              name="official_website"
              value={
                settings.official_website
              }
              onChange={handleChange}
              placeholder="https://www.example.gov.so"
              icon={Globe}
            />

            <Input
              label="Facebook URL"
              name="facebook_url"
              value={settings.facebook_url}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              icon={Globe}
            />

            <Input
              label="X / Twitter URL"
              name="twitter_url"
              value={settings.twitter_url}
              onChange={handleChange}
              placeholder="https://x.com/..."
              icon={Globe}
            />

            <Input
              label="YouTube URL"
              name="youtube_url"
              value={settings.youtube_url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              icon={Globe}
            />

            <Input
              label="Instagram URL"
              name="instagram_url"
              value={
                settings.instagram_url
              }
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              icon={Globe}
            />

          </div>

        </Section>


        {/* =================================================
            LANGUAGE
        ================================================= */}

        <Section
          icon={Languages}
          title="Language"
          description="Choose the default language used by the portal."
        >

          <div className="max-w-md">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Default Language
            </label>

            <select
              name="default_language"
              value={
                settings.default_language
              }
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-800
                outline-none
                transition
                focus:ring-2
                focus:ring-green-600/20
                focus:border-green-600
              "
            >

              <option value="so">
                Somali
              </option>

              <option value="en">
                English
              </option>

            </select>

          </div>

        </Section>


        {/* =================================================
            SYSTEM SETTINGS
        ================================================= */}

        <Section
          icon={ShieldCheck}
          title="System Settings"
          description="Control important portal-wide features."
        >

          <div className="space-y-4">

            <Toggle
              icon={Wrench}
              title="Maintenance Mode"
              description="Temporarily place the portal into maintenance mode."
              enabled={
                settings.maintenance_mode
              }
              onClick={() =>
                handleToggle(
                  "maintenance_mode"
                )
              }
              danger
            />

            <Toggle
              icon={UserPlus}
              title="User Registration"
              description="Allow new citizens and visitors to create accounts."
              enabled={
                settings.registration_enabled
              }
              onClick={() =>
                handleToggle(
                  "registration_enabled"
                )
              }
            />

            <Toggle
              icon={BriefcaseBusiness}
              title="Public Services"
              description="Allow visitors to access the public government services section."
              enabled={
                settings.public_services_enabled
              }
              onClick={() =>
                handleToggle(
                  "public_services_enabled"
                )
              }
            />

            <Toggle
              icon={Mail}
              title="Notifications"
              description="Enable system notifications and administrative alerts."
              enabled={
                settings.notifications_enabled
              }
              onClick={() =>
                handleToggle(
                  "notifications_enabled"
                )
              }
            />

          </div>

        </Section>


        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-green-700
              text-white
              font-semibold
              hover:bg-green-800
              transition
              disabled:opacity-50
            "
          >

            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}


// =====================================================
// SECTION COMPONENT
// =====================================================

function Section({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        shadow-sm
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div className="p-6 border-b border-slate-100">

        <div className="flex items-start gap-4">

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

            <Icon className="w-5 h-5" />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>

          </div>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}


// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {Icon && (
          <Icon
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-400
            "
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-800
            outline-none
            transition
            focus:ring-2
            focus:ring-green-600/20
            focus:border-green-600
            ${
              Icon
                ? "pl-10"
                : ""
            }
          `}
        />

      </div>

    </div>
  );
}


// =====================================================
// TEXTAREA COMPONENT
// =====================================================

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon
            className="
              absolute
              left-3.5
              top-4
              w-4
              h-4
              text-slate-400
            "
          />
        )}

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-800
            outline-none
            resize-y
            transition
            focus:ring-2
            focus:ring-green-600/20
            focus:border-green-600
            ${
              Icon
                ? "pl-10"
                : ""
            }
          `}
        />

      </div>

    </div>
  );
}


// =====================================================
// TOGGLE COMPONENT
// =====================================================

function Toggle({
  icon: Icon,
  title,
  description,
  enabled,
  onClick,
  danger = false,
}) {
  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        p-5
        rounded-xl
        border
        border-slate-200
        bg-slate-50/50
      "
    >

      <div className="flex items-start gap-4">

        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${
              danger && enabled
                ? "bg-red-100 text-red-600"
                : "bg-white text-slate-600"
            }
          `}
        >

          <Icon className="w-5 h-5" />

        </div>


        <div>

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            {description}
          </p>

        </div>

      </div>


      {/* SWITCH */}

      <button
        type="button"
        onClick={onClick}
        aria-pressed={enabled}
        className={`
          relative
          inline-flex
          h-7
          w-12
          shrink-0
          rounded-full
          transition
          focus:outline-none
          focus:ring-2
          focus:ring-green-600/30
          ${
            danger && enabled
              ? "bg-red-600"
              : enabled
              ? "bg-green-700"
              : "bg-slate-300"
          }
        `}
      >

        <span
          className={`
            inline-block
            h-5
            w-5
            mt-1
            rounded-full
            bg-white
            shadow-sm
            transition
            ${
              enabled
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />

      </button>

    </div>
  );
}


export default Settings;