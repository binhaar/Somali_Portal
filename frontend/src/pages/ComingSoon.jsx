import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock3,
  Mail,
  ArrowRight,
} from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Logo / Government Symbol */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center p-3">
            <img
              src="/logos/coat-of-arms.png"
              alt="Somalia Government"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Fallback */}
            <ShieldCheck className="w-12 h-12 text-blue-700" />
          </div>
        </div>

        {/* Country */}
        <p className="text-blue-400 font-semibold tracking-[0.25em] uppercase text-sm mb-4">
          Federal Republic of Somalia
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Coming Soon
        </h1>

        {/* Somali Portal */}
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-6">
          Somalia Government Portal
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg leading-8 mb-10">
          We are working to bring you a modern and reliable digital
          government portal. Access government services, information,
          ministries, agencies, and important public resources — all in
          one place.
        </p>

        {/* Status Card */}
        <div className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 mb-10">
          <div className="flex items-center justify-center gap-3 text-slate-200">
            <Clock3 className="w-5 h-5 text-blue-400" />

            <span className="font-medium">
              Our portal is currently under development.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:info@somalia.gov.so"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/20"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </a>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition font-semibold"
          >
            Admin Login
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Federal Republic of Somalia.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;