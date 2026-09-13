import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getHistory } from "../services/historyApi";

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getHistory();

        if (response.data?.success) {
          setHistory(response.data.data);
        } else {
          setError("History page not found.");
        }
      } catch (err) {
        console.error("History Error:", err);
        setError("Unable to load History.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main>
        {/* PAGE HEADER */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#0B3D91]">
              About Somalia
            </p>

            <h1 className="text-4xl font-black text-slate-900">
              {history?.title || "History"}
            </h1>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {loading && (
            <div className="py-20 text-center text-slate-500">
              Loading History...
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
              {error}
            </div>
          )}

          {history && !loading && (
            <div className="space-y-12">

              {/* HISTORICAL BACKGROUND */}
              <section>
                <h2 className="mb-6 text-2xl font-black text-slate-900">
                  {history.heading}
                </h2>

                <div className="space-y-5 text-base leading-8 text-slate-600">
                  {(history.content || []).map((item) => (
                    <p key={item._id}>
                      {item.text}
                    </p>
                  ))}
                </div>
              </section>

              {/* RESPONSIBILITIES */}
              {(history.responsibilities || []).length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-black text-slate-900">
                    {history.responsibilitiesHeading ||
                      "Responsibilities"}
                  </h2>

                  <div className="space-y-4">
                    {history.responsibilities.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3D91] text-sm font-black text-white">
                          {index + 1}
                        </div>

                        <p className="pt-1 text-base leading-7 text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CLOSING CONTENT */}
              {(history.closingContent || []).length > 0 && (
                <section className="border-t border-slate-200 pt-10">
                  <div className="space-y-5 text-base leading-8 text-slate-600">
                    {history.closingContent.map((item) => (
                      <p key={item._id}>
                        {item.text}
                      </p>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}