import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  LockKeyhole,
  CalendarDays,
  MapPin,
  Globe,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    accountType: "CITIZEN",
    username: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "MALE",
    nationalIdNumber: "",
    passportNumber: "",
    nationality: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      accountType: type,
      nationalIdNumber: "",
      passportNumber: "",
      nationality: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const payload = {
      accountType: form.accountType,
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      otherNames: form.otherNames,
      dateOfBirth: form.dateOfBirth,
      placeOfBirth: form.placeOfBirth,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      password: form.password,
    };

    if (form.accountType === "CITIZEN") {
      payload.nationalIdNumber = form.nationalIdNumber;
    }

    if (form.accountType === "VISITOR") {
      payload.passportNumber = form.passportNumber;
      payload.nationality = form.nationality;
    }

    const result = await register(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(
      "Account created successfully. Please login to continue."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b3b2e] text-white shadow-lg">
            <UserPlus size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register for the Somalia Government Portal
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {/* Errors */}
          {error && (
            <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Account Type */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Account Type
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  handleAccountTypeChange("CITIZEN")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.accountType === "CITIZEN"
                    ? "border-[#0b3b2e] bg-[#0b3b2e]/5 ring-2 ring-[#0b3b2e]/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Somali Citizen
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Register using your National ID
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAccountTypeChange("VISITOR")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.accountType === "VISITOR"
                    ? "border-[#0b3b2e] bg-[#0b3b2e]/5 ring-2 ring-[#0b3b2e]/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Visitor
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Register using your passport
                </p>
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Username */}
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose username"
              icon={<User size={18} />}
              required
            />

            {/* First Name */}
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              icon={<User size={18} />}
              required
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              icon={<User size={18} />}
              required
            />

            {/* Other Names */}
            <Input
              label="Other Names"
              name="otherNames"
              value={form.otherNames}
              onChange={handleChange}
              placeholder="Other names"
              icon={<User size={18} />}
            />

            {/* DOB */}
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              icon={<CalendarDays size={18} />}
              required
            />

            {/* Place */}
            <Input
              label="Place of Birth"
              name="placeOfBirth"
              value={form.placeOfBirth}
              onChange={handleChange}
              placeholder="Place of birth"
              icon={<MapPin size={18} />}
              required
            />

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-[#0b3b2e] focus:bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Identity */}
            {form.accountType === "CITIZEN" ? (
              <Input
                label="National ID Number"
                name="nationalIdNumber"
                value={form.nationalIdNumber}
                onChange={handleChange}
                placeholder="National ID number"
                icon={<Globe size={18} />}
                required
              />
            ) : (
              <Input
                label="Passport Number"
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleChange}
                placeholder="Passport number"
                icon={<Globe size={18} />}
                required
              />
            )}

            {/* Nationality for visitor */}
            {form.accountType === "VISITOR" && (
              <Input
                label="Nationality"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                placeholder="Your nationality"
                icon={<Globe size={18} />}
                required
              />
            )}

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+252..."
              icon={<Phone size={18} />}
              required
            />

            {/* Email */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              icon={<LockKeyhole size={18} />}
              required
            />

            {/* Confirm */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              icon={<LockKeyhole size={18} />}
              required
            />

            {/* Submit */}
            <div className="md:col-span-2 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3b2e] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#082f25] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block text-sm font-semibold text-[#0b3b2e] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#0b3b2e] focus:bg-white focus:ring-4 focus:ring-[#0b3b2e]/10"
        />
      </div>
    </div>
  );
}

export default Register;