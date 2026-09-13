import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getHistory } from "../services/historyApi";

const History = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();

        setHistory(response.data?.data || null);
      } catch (err) {
        console.error("History Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load History page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-white">
        <Loader2
          size={40}
          className="animate-spin text-[#0B3D91]"
        />
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main className="bg-white">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            History
          </h1>

          <p className="mt-4 text-gray-500">
            {error}
          </p>
        </section>
      </main>
    );
  }

  // =========================================================
  // NO DATA
  // =========================================================

  if (!history) {
    return (
      <main className="bg-white">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            History
          </h1>

          <p className="mt-4 text-gray-500">
            No History content available.
          </p>
        </section>
      </main>
    );
  }

  // =========================================================
  // PUBLIC PAGE
  // =========================================================

  return (
    <main className="bg-white text-gray-800">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-gray-200 bg-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
            About Somalia
          </p>

          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            {history.title}
          </h1>
        </div>
      </section>


      {/* =====================================================
          HISTORICAL BACKGROUND
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-14 md:px-8">

        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          {history.heading}
        </h2>

        <div className="space-y-6">
          {history.content?.map((item) => (
            <p
              key={item._id}
              className="text-[17px] leading-8 text-gray-600"
            >
              {item.text}
            </p>
          ))}
        </div>


        {/* ===================================================
            RESPONSIBILITIES
        =================================================== */}

        {history.responsibilities?.length > 0 && (
          <div className="mt-14">

            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              {history.responsibilitiesHeading}
            </h2>

            <div className="space-y-6">

              {history.responsibilities.map(
                (item, index) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-4"
                  >

                    {/* NUMBER */}

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B3D91] text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    {/* TEXT */}

                    <p className="text-[17px] leading-8 text-gray-600">
                      {item.text}
                    </p>

                  </div>
                )
              )}

            </div>
          </div>
        )}


        {/* ===================================================
            CLOSING CONTENT
        =================================================== */}

        {history.closingContent?.length > 0 && (
          <div className="mt-14 border-t border-gray-200 pt-10">

            <div className="space-y-6">

              {history.closingContent.map(
                (item) => (
                  <p
                    key={item._id}
                    className="text-[17px] leading-8 text-gray-600"
                  >
                    {item.text}
                  </p>
                )
              )}

            </div>

          </div>
        )}

      </section>

    </main>
  );
};

export default History;