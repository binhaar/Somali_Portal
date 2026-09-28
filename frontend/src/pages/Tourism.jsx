import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Compass,
  Waves,
  Mountain,
  Landmark,
  Camera,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { getTourism } from "../services/tourismApi";

const Tourism = () => {
  const [tourism, setTourism] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTourism = async () => {
      try {
        setLoading(true);

        const response = await getTourism();

        setTourism(response.data?.data || response.data);
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

    loadTourism();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-gray-500">
            Loading tourism information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tourism) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <Compass className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Tourism information unavailable
          </h1>

          <p className="text-gray-600">
            {error || "No tourism content is available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  const destinations = tourism.destinations || [];
  const highlights = tourism.highlights || [];
  const gallery = tourism.gallery || [];

  const featuredDestinations = destinations.filter(
    (item) => item.featured
  );

  const visibleDestinations =
    featuredDestinations.length > 0
      ? featuredDestinations
      : destinations;

  return (
    <main className="bg-white text-gray-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        {tourism.heroImage ? (
          <img
            src={tourism.heroImage}
            alt={tourism.heroTitle || "Discover Somalia"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-800 to-slate-900" />
        )}

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 py-24">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 mb-7 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium">
              <Compass className="w-4 h-4" />
              Discover Somalia
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              {tourism.heroTitle || "Discover Somalia"}
            </h1>

            <p className="mt-7 text-lg sm:text-xl leading-8 text-white/90 max-w-2xl">
              {tourism.heroDescription ||
                tourism.subtitle ||
                "Explore the beauty, heritage and unforgettable destinations of Somalia."}
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <a
                href="#destinations"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-lg"
              >
                Explore Destinations
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#gallery"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-semibold transition-all"
              >
                View Gallery
                <Camera className="w-5 h-5" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <section className="py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-emerald-600" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-700">
                  Tourism in Somalia
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                {tourism.introductionTitle ||
                  "Discover the beauty of Somalia"}
              </h2>

              <div className="mt-7 text-gray-600 text-lg leading-8 whitespace-pre-line">
                {tourism.introduction ||
                  "Somalia offers a unique combination of beautiful coastlines, historic places, cultural traditions and remarkable landscapes."}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-100/60 rounded-3xl blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                {tourism.heroImage ? (
                  <img
                    src={tourism.heroImage}
                    alt="Somalia tourism"
                    className="w-full h-[440px] object-cover"
                  />
                ) : (
                  <div className="h-[440px] bg-gradient-to-br from-emerald-100 to-slate-200 flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-emerald-600/40" />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS
      ====================================================== */}
      {visibleDestinations.length > 0 && (
        <section
          id="destinations"
          className="py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-[2px] bg-emerald-600" />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-700">
                    Explore
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {tourism.destinationsHeading ||
                    "Explore Destinations"}
                </h2>
              </div>

              <p className="max-w-xl text-gray-600 leading-7">
                Discover destinations and places that showcase
                Somalia's natural beauty, heritage and culture.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleDestinations.map((destination) => (
                <article
                  key={destination._id || destination.title}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >

                  <div className="relative h-64 overflow-hidden">
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                    {destination.category && (
                      <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-gray-800">
                        {destination.category}
                      </span>
                    )}

                    {destination.location && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm">
                        <MapPin className="w-4 h-4" />
                        {destination.location}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {destination.title}
                    </h3>

                    {destination.description && (
                      <p className="mt-3 text-gray-600 leading-7 line-clamp-3">
                        {destination.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      Explore
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          HIGHLIGHTS
      ====================================================== */}
      {highlights.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="max-w-3xl mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-emerald-600" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-700">
                  Experience
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {tourism.highlightsHeading ||
                  "Experience Somalia"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {highlights.map((item, index) => (
                <article
                  key={item._id || `${item.title}-${index}`}
                  className="group relative overflow-hidden rounded-2xl min-h-[330px]"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-slate-900" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="relative z-10 min-h-[330px] flex flex-col justify-end p-6 text-white">

                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-5">
                      {index % 4 === 0 && (
                        <Waves className="w-5 h-5" />
                      )}

                      {index % 4 === 1 && (
                        <Mountain className="w-5 h-5" />
                      )}

                      {index % 4 === 2 && (
                        <Landmark className="w-5 h-5" />
                      )}

                      {index % 4 === 3 && (
                        <Camera className="w-5 h-5" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2 text-white/80 text-sm leading-6">
                        {item.description}
                      </p>
                    )}

                  </div>
                </article>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          GALLERY
      ====================================================== */}
      {gallery.length > 0 && (
        <section
          id="gallery"
          className="py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-[2px] bg-emerald-600" />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-700">
                    Gallery
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {tourism.galleryHeading ||
                    "Discover Somalia"}
                </h2>
              </div>

              <Camera className="hidden md:block w-10 h-10 text-emerald-600" />

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {gallery.map((item, index) => (
                <div
                  key={item._id || `${item.image}-${index}`}
                  className={`group relative overflow-hidden rounded-2xl ${
                    index === 0
                      ? "col-span-2 row-span-2 min-h-[420px]"
                      : "min-h-[200px]"
                  }`}
                >

                  <img
                    src={item.image}
                    alt={item.title || "Somalia tourism"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                  {(item.title || item.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">

                      {item.title && (
                        <h3 className="font-bold text-lg">
                          {item.title}
                        </h3>
                      )}

                      {item.description && (
                        <p className="mt-1 text-sm text-white/80 line-clamp-2">
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

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-24 text-center">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-6">
            <Compass className="w-7 h-7" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            {tourism.ctaTitle ||
              "Discover the Beauty of Somalia"}
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg leading-8 text-white/80">
            {tourism.ctaText ||
              "Explore the places, people and experiences that make Somalia unique."}
          </p>

          <a
            href="#destinations"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-gray-100 font-bold transition-all"
          >
            Explore Somalia
            <ArrowRight className="w-5 h-5" />
          </a>

        </div>
      </section>

    </main>
  );
};

export default Tourism;