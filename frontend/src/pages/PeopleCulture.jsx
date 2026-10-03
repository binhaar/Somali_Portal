import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getPeopleCulture } from "../services/peopleCultureApi";

const PeopleCulture = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("portalLanguage") || "en"
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSomali = language === "so";

  const changeLanguage = (value) => {
    localStorage.setItem("portalLanguage", value);
    setLanguage(value);
  };

  useEffect(() => {
    const loadPeopleCulture = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPeopleCulture(language);

        if (response?.data?.success) {
          setData(response.data.data);
        } else {
          setData(null);
          setError(
            response?.data?.message ||
              (isSomali
                ? "Macluumaadka Dadka & Dhaqanka lama helin."
                : "People & Culture content was not found.")
          );
        }
      } catch (err) {
        console.error("Failed to load People & Culture:", err);

        setData(null);
        setError(
          isSomali
            ? "Waxaa dhacay cilad marka la soo gelinayay xogta."
            : "An error occurred while loading the content."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPeopleCulture();
  }, [language, isSomali]);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar
        language={language}
        setLanguage={changeLanguage}
      />

      {/* =========================
          LOADING
      ========================= */}
      {loading && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-700" />

            <p className="text-gray-600">
              {isSomali
                ? "Xogta ayaa la soo gelinayaa..."
                : "Loading content..."}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}
      {!loading && error && (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />

            <h2 className="mb-2 text-xl font-bold text-red-800">
              {isSomali ? "Xog lama helin" : "Content not found"}
            </h2>

            <p className="text-red-700">
              {error}
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              {isSomali ? "Bogga Hore" : "Home"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* =========================
          CONTENT
      ========================= */}
      {!loading && !error && data && (
        <>
          {/* HERO */}
          <section className="relative overflow-hidden bg-gray-900">
            {data.heroImage && (
              <img
                src={data.heroImage}
                alt={data.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/60" />

            <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-8">
              <div className="max-w-3xl text-white">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                  <Users className="h-5 w-5" />

                  <span className="text-sm font-medium">
                    {isSomali
                      ? "Dadka & Dhaqanka"
                      : "People & Culture"}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {data.heroTitle || data.title}
                </h1>

                {data.heroDescription && (
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
                    {data.heroDescription}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* INTRODUCTION */}
          {(data.introductionTitle || data.introduction) && (
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">

                {data.introductionTitle && (
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {data.introductionTitle}
                  </h2>
                )}

                {data.introduction && (
                  <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-600">
                    {data.introduction}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* PEOPLE */}
          {data.people?.length > 0 && (
            <section className="bg-gray-50 py-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {data.peopleHeading ||
                      (isSomali ? "Dadka Soomaaliyeed" : "The Somali People")}
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {data.people.map((person, index) => (
                    <article
                      key={person._id || index}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      {person.image && (
                        <img
                          src={person.image}
                          alt={person.title}
                          className="h-56 w-full object-cover"
                        />
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          {person.title}
                        </h3>

                        {person.content && (
                          <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                            {person.content}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CULTURE */}
          {data.culture?.length > 0 && (
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {data.cultureHeading ||
                      (isSomali ? "Dhaqanka Soomaaliya" : "Somali Culture")}
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {data.culture.map((item, index) => (
                    <article
                      key={item._id || index}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-56 w-full object-cover"
                        />
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>

                        {item.content && (
                          <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* GALLERY */}
          {data.gallery?.length > 0 && (
            <section className="bg-gray-50 py-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {data.galleryHeading ||
                      (isSomali ? "Sawirrada" : "Gallery")}
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.gallery.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}

                      <div className="p-5">
                        <h3 className="font-bold text-gray-900">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          {(data.ctaTitle || data.ctaText) && (
            <section className="bg-blue-800 py-16">
              <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

                {data.ctaTitle && (
                  <h2 className="text-3xl font-bold text-white">
                    {data.ctaTitle}
                  </h2>
                )}

                {data.ctaText && (
                  <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                    {data.ctaText}
                  </p>
                )}

                <Link
                  to="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-800 transition hover:bg-gray-100"
                >
                  {isSomali ? "Bogga Hore" : "Back to Home"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default PeopleCulture;