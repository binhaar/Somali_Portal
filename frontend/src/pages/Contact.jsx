import React, { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Building2,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.department ||
      !form.message.trim()
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/contact",
        form
      );

      setSuccess(
        response.data?.message ||
          "Your message has been submitted successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-[#0B3D91]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              Federal Government of Somalia
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              How can we assist you today? Reach out to
              the Federal Government of Somalia.
            </p>

          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT INFORMATION */}
            <div className="space-y-5">

              {/* GENERAL */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      General Inquiries
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      For general government questions.
                    </p>

                    <a
                      href="mailto:e-gov@moct.gov.so"
                      className="mt-3 inline-block text-sm font-bold text-[#0B3D91] hover:underline"
                    >
                      e-gov@moct.gov.so
                    </a>
                  </div>

                </div>
              </div>

              {/* MEDIA */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Media & Press
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      For official statements and press accreditation.
                    </p>

                    <a
                      href="mailto:e-gov@moct.gov.so"
                      className="mt-3 inline-block text-sm font-bold text-[#0B3D91] hover:underline"
                    >
                      e-gov@moct.gov.so
                    </a>
                  </div>

                </div>
              </div>

              {/* VISIT */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Visit Us
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Villa Somalia, Mogadishu
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Office of the Prime Minister
                    </p>

                    <a
                      href="https://maps.google.com/?q=Villa+Somalia+Mogadishu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0B3D91] hover:underline"
                    >
                      View Location
                      <ExternalLink size={14} />
                    </a>
                  </div>

                </div>
              </div>

              {/* WORKING HOURS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B3D91]">
                    <Clock3 size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Working Hours
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      Saturday – Thursday
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      8:00 AM – 4:00 PM
                    </p>

                    <p className="mt-2 text-sm text-red-500">
                      Friday: Closed
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      East Africa Time (EAT)
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* FORM */}
            <div className="lg:col-span-2">

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B3D91]">
                    Contact Form
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Send a Message
                  </h2>

                  <p className="mt-3 text-slate-500">
                    Submit your inquiry and the relevant
                    government department will review it.
                  </p>
                </div>

                {/* SUCCESS */}
                {success && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-sm font-semibold">
                      {success}
                    </p>
                  </div>
                )}

                {/* ERROR */}
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* NAME + EMAIL */}
                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Full Name
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-[#0B3D91]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-100
                        "
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Email Address
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-[#0B3D91]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-100
                        "
                      />
                    </div>

                  </div>

                  {/* PHONE + DEPARTMENT */}
                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+252..."
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            outline-none
                            transition
                            focus:border-[#0B3D91]
                            focus:bg-white
                            focus:ring-4
                            focus:ring-blue-100
                          "
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Department
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-[#0B3D91]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-100
                        "
                      >
                        <option value="">
                          Select Department
                        </option>

                        <option value="General Inquiry">
                          General Inquiry
                        </option>

                        <option value="Ministry of Interior">
                          Ministry of Interior
                        </option>

                        <option value="Ministry of Health">
                          Ministry of Health
                        </option>

                        <option value="Ministry of Education">
                          Ministry of Education
                        </option>

                        <option value="Ministry of Foreign Affairs">
                          Ministry of Foreign Affairs
                        </option>

                        <option value="Ministry of Finance">
                          Ministry of Finance
                        </option>

                        <option value="Immigration">
                          Immigration
                        </option>

                        <option value="Media & Press">
                          Media & Press
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Your Message
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Write your message..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0B3D91]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-100
                      "
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#0B3D91]
                      px-6
                      py-3.5
                      text-sm
                      font-black
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#082f70]
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      sm:w-auto
                    "
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Submit Inquiry
                      </>
                    )}
                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* OTHER WAYS */}
          <div className="mt-10 rounded-3xl bg-[#0B3D91] p-8 text-white sm:p-10">

            <div className="grid gap-8 md:grid-cols-3">

              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Building2 size={21} />
                </div>

                <h3 className="text-lg font-black">
                  Other Ways to Connect
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-100">
                  For specific departments, use the
                  relevant ministry or agency directory.
                </p>
              </div>

              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Phone size={21} />
                </div>

                <h3 className="text-lg font-black">
                  Government Support
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Contact the relevant government
                  institution for specialized assistance.
                </p>
              </div>

              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={21} />
                </div>

                <h3 className="text-lg font-black">
                  Email
                </h3>

                <a
                  href="mailto:e-gov@moct.gov.so"
                  className="mt-2 inline-block text-sm font-bold text-white hover:underline"
                >
                  e-gov@moct.gov.so
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}