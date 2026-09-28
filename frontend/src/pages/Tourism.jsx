import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Compass,
  ArrowRight,
  Star,
  Camera,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getTourism } from "../services/tourismApi";

function Tourism() {
  const [language, setLanguage] = useState(
    localStorage.getItem("portalLanguage") || "en"
  );

  const [tourism, setTourism] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LANGUAGE
  ===================================================== */

  const changeLanguage = (value) => {
    localStorage.setItem("portalLanguage", value);
    setLanguage(value);
  };

  /* =====================================================
     LOAD TOURISM
  ===================================================== */

  useEffect(() => {
    const loadTourism = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTourism(language);

        setTourism(response.data?.data || response.data);
      } catch (err) {
        console.error("Tourism loading error:", err);
        setError(
          language === "so"
            ? "Macluumaadka dalxiiska lama soo dejin karin."
            : "Unable to load tourism information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTourism();
  }, [language]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          language={language}
          setLanguage={changeLanguage}
        />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

            <p className="text-gray-600">
              {language === "so"
                ? "Macluumaadka waa la soo dejinayaa..."
                : "Loading tourism information..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !tourism) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          language={language}
          setLanguage={changeLanguage}
        />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {language === "so"
                ? "Macluumaadka dalxiiska lama helin"
                : "Tourism information unavailable"}
            </h1>

            <p className="text-gray-600">
              {error ||
                (language === "so"
                  ? "Fadlan mar kale isku day."
                  : "Please try again later.")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     DATA
  ===================================================== */

  const destinations = tourism.destinations || [];
  const highlights = tourism.highlights || [];
  const gallery = tourism.gallery || [];

  return (
    <div className="min-h-screen bg-white">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        language={language}
        setLanguage={changeLanguage}
      />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative min-h-[600px] overflow-hidden">

        {tourism.heroImage && (
          <img
            src={tourism.heroImage}
            alt={tourism.heroTitle || tourism.title || "Somalia Tourism"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-3xl text-white">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Compass size={18} />

              <span className="text-sm font-medium">
                {language === "so"
                  ? "Dalxiiska Soomaaliya"
                  : "Somalia Tourism"}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {tourism.heroTitle || tourism.title}
            </h1>

            {tourism.heroDescription && (
              <p className="max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
                {tourism.heroDescription}
              </p>
            )}

          </div>
        </div>
      </section>

      {/* =================================================
          INTRODUCTION
      ================================================= */}

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
            <Compass size={28} />
          </div>

          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            {tourism.introductionTitle}
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            {tourism.introduction}
          </p>

        </div>
      </section>

      {/* =================================================
          DESTINATIONS
      ================================================= */}

      {destinations.length > 0 && (
        <section className="bg-gray-50 px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-700">
                {language === "so"
                  ? "Goobaha"
                  : "Destinations"}
              </p>

              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {tourism.destinationsHeading}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {destinations.map((destination, index) => (
                <article
                  key={destination._id || index}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  {destination.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {destination.featured && (
                        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow">
                          <Star
                            size={13}
                            className="fill-current"
                          />
                          {language === "so"
                            ? "La xushay"
                            : "Featured"}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">

                    <h3 className="mb-3 text-2xl font-bold text-gray-900">
                      {destination.name}
                    </h3>

                    {destination.location && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-green-700">
                        <MapPin size={16} />
                        <span>{destination.location}</span>
                      </div>
                    )}

                    {destination.description && (
                      <p className="leading-7 text-gray-600">
                        {destination.description}
                      </p>
                    )}

                  </div>
                </article>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =================================================
          HIGHLIGHTS
      ================================================= */}

      {highlights.length > 0 && (
        <section className="bg-white px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-700">
                {language === "so"
                  ? "Waxyaabaha Muhiimka ah"
                  : "Highlights"}
              </p>

              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {tourism.highlightsHeading}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {highlights.map((item, index) => (
                <div
                  key={item._id || index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="leading-7 text-gray-600">
                      {item.description}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =================================================
          GALLERY
      ================================================= */}

      {gallery.length > 0 && (
        <section className="bg-gray-50 px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-12 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Camera size={23} />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {tourism.galleryHeading}
              </h2>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {gallery.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}

                  {(item.title || item.description) && (
                    <div className="p-5">

                      {item.title && (
                        <h3 className="mb-2 font-bold text-gray-900">
                          {item.title}
                        </h3>
                      )}

                      {item.description && (
                        <p className="text-sm leading-6 text-gray-600">
                          {item.description}
                        </p>
                      )}

                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =================================================
          CTA
      ================================================= */}

      <section className="bg-green-800 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="mb-5 text-3xl font-bold md:text-4xl">
            {tourism.ctaTitle}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-green-50">
            {tourism.ctaText}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-800 transition hover:bg-gray-100"
          >
            {language === "so"
              ? "Nala soo xiriir"
              : "Contact Us"}

            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Tourism;