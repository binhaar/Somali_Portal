import { useState } from "react";

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
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";


// =====================================================
// SOMALIA FLAG
// =====================================================

function SomaliaFlag({ size = "md" }) {
  const sizes = {
    sm: "h-10 w-14",
    md: "h-14 w-20",
    lg: "h-16 w-24",
  };

  return (
    <div
      className={`
        ${sizes[size] || sizes.md}
        relative
        flex
        items-center
        justify-center
        overflow-hidden
        rounded-lg
        bg-[#4189DD]
        shadow-lg
        ring-1
        ring-[#0B3D91]/10
      `}
    >

      <Star
        className="
          h-7
          w-7
          fill-white
          text-white
          drop-shadow-sm
        "
      />

    </div>
  );
}


// =====================================================
// REGISTER
// =====================================================

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();


  // ===================================================
  // FORM
  // ===================================================

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


  // ===================================================
  // HANDLE CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ===================================================
  // ACCOUNT TYPE
  // ===================================================

  const handleAccountTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,

      accountType: type,

      nationalIdNumber: "",
      passportNumber: "",
      nationality: "",
    }));
  };


  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    // ================================================
    // PASSWORD CHECK
    // ================================================

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }


    setLoading(true);


    // ================================================
    // PAYLOAD
    // ================================================

    const payload = {
      accountType:
        form.accountType,

      username:
        form.username,

      firstName:
        form.firstName,

      lastName:
        form.lastName,

      otherNames:
        form.otherNames,

      dateOfBirth:
        form.dateOfBirth,

      placeOfBirth:
        form.placeOfBirth,

      gender:
        form.gender,

      phone:
        form.phone,

      email:
        form.email,

      password:
        form.password,
    };


    // ================================================
    // CITIZEN
    // ================================================

    if (
      form.accountType ===
      "CITIZEN"
    ) {
      payload.nationalIdNumber =
        form.nationalIdNumber;
    }


    // ================================================
    // VISITOR
    // ================================================

    if (
      form.accountType ===
      "VISITOR"
    ) {
      payload.passportNumber =
        form.passportNumber;

      payload.nationality =
        form.nationality;
    }


    try {

      const result =
        await register(payload);

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
      }, 1200);

    } catch (err) {

      setLoading(false);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );

    }
  };


  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#F4F8FD]
        px-4
        py-8
        sm:py-12
      "
    >

      <div className="mx-auto max-w-6xl">


        {/* =================================================
            TOP BRAND
        ================================================= */}

        <div className="mb-8 flex flex-col items-center text-center">

          <SomaliaFlag size="lg" />

          <div className="mt-4">

            <p
              className="
                text-xl
                font-black
                tracking-tight
                text-[#0B3D91]
              "
            >
              Federal Government of Somalia
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Somalia Government Portal
            </p>

          </div>

        </div>


        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200
            bg-white
            shadow-2xl
            shadow-slate-200/70
          "
        >

          {/* BLUE HEADER */}

          <div
            className="
              relative
              overflow-hidden
              bg-[#0B3D91]
              px-6
              py-8
              text-white
              sm:px-10
              sm:py-9
            "
          >

            <div
              className="
                absolute
                -right-20
                -top-24
                h-64
                w-64
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                absolute
                -bottom-28
                -left-20
                h-64
                w-64
                rounded-full
                bg-white/5
              "
            />


            <div className="relative z-10 flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-[#0B3D91]
                  shadow-lg
                "
              >
                <UserPlus size={27} />
              </div>


              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#9BD0FF]
                  "
                >
                  Government Portal
                </p>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-black
                    sm:text-3xl
                  "
                >
                  Create Your Account
                </h1>

                <p className="mt-1 text-sm text-white/65">
                  Register securely for online government services.
                </p>

              </div>

            </div>

          </div>


          <div className="p-6 sm:p-10">


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  mb-6
                  flex
                  gap-3
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-sm
                  font-medium
                  leading-6
                  text-red-700
                "
              >

                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>

              </div>
            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <div
                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-4
                  text-sm
                  font-medium
                  text-[#0B3D91]
                "
              >

                <CheckCircle2
                  size={19}
                />

                <span>
                  {success}
                </span>

              </div>
            )}


            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <div className="mb-9">

              <div className="mb-3">

                <h2
                  className="
                    text-lg
                    font-black
                    text-slate-900
                  "
                >
                  Account Type
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the account type that applies to you.
                </p>

              </div>


              <div className="grid gap-4 sm:grid-cols-2">

                {/* CITIZEN */}

                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange(
                      "CITIZEN"
                    )
                  }
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-5
                    text-left
                    transition
                    ${
                      form.accountType ===
                      "CITIZEN"
                        ? `
                          border-[#4189DD]
                          bg-[#EEF6FF]
                          ring-2
                          ring-[#4189DD]/20
                        `
                        : `
                          border-slate-200
                          bg-white
                          hover:border-[#A9CEF5]
                          hover:bg-slate-50
                        `
                    }
                  `}
                >

                  {form.accountType ===
                    "CITIZEN" && (
                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#0B3D91]
                        text-white
                      "
                    >
                      <CheckCircle2 size={16} />
                    </div>
                  )}


                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#EAF3FF]
                      text-[#0B3D91]
                    "
                  >
                    <User size={21} />
                  </div>


                  <p className="mt-4 font-bold text-slate-900">
                    Somali Citizen
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Register using your National ID.
                  </p>

                </button>


                {/* VISITOR */}

                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange(
                      "VISITOR"
                    )
                  }
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-5
                    text-left
                    transition
                    ${
                      form.accountType ===
                      "VISITOR"
                        ? `
                          border-[#4189DD]
                          bg-[#EEF6FF]
                          ring-2
                          ring-[#4189DD]/20
                        `
                        : `
                          border-slate-200
                          bg-white
                          hover:border-[#A9CEF5]
                          hover:bg-slate-50
                        `
                    }
                  `}
                >

                  {form.accountType ===
                    "VISITOR" && (
                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#0B3D91]
                        text-white
                      "
                    >
                      <CheckCircle2 size={16} />
                    </div>
                  )}


                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#EAF3FF]
                      text-[#0B3D91]
                    "
                  >
                    <Globe size={21} />
                  </div>


                  <p className="mt-4 font-bold text-slate-900">
                    Visitor
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Register using your passport.
                  </p>

                </button>

              </div>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >


              {/* =================================================
                  PERSONAL INFORMATION
              ================================================= */}

              <FormSection
                number="01"
                title="Personal Information"
                description="Provide your basic personal information."
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <Input
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose username"
                    icon={<User size={18} />}
                    required
                  />

                  <Input
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    icon={<User size={18} />}
                    required
                  />

                  <Input
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    icon={<User size={18} />}
                    required
                  />

                  <Input
                    label="Other Names"
                    name="otherNames"
                    value={form.otherNames}
                    onChange={handleChange}
                    placeholder="Other names"
                    icon={<User size={18} />}
                  />

                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    icon={<CalendarDays size={18} />}
                    required
                  />

                  <Input
                    label="Place of Birth"
                    name="placeOfBirth"
                    value={form.placeOfBirth}
                    onChange={handleChange}
                    placeholder="Place of birth"
                    icon={<MapPin size={18} />}
                    required
                  />


                  {/* GENDER */}

                  <div>

                    <label
                      htmlFor="gender"
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3.5
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        focus:border-[#4189DD]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#4189DD]/10
                      "
                    >

                      <option value="MALE">
                        Male
                      </option>

                      <option value="FEMALE">
                        Female
                      </option>

                    </select>

                  </div>


                  {/* IDENTITY */}

                  {form.accountType ===
                  "CITIZEN" ? (
                    <Input
                      label="National ID Number"
                      name="nationalIdNumber"
                      value={
                        form.nationalIdNumber
                      }
                      onChange={handleChange}
                      placeholder="National ID number"
                      icon={
                        <ShieldCheck size={18} />
                      }
                      required
                    />
                  ) : (
                    <Input
                      label="Passport Number"
                      name="passportNumber"
                      value={
                        form.passportNumber
                      }
                      onChange={handleChange}
                      placeholder="Passport number"
                      icon={
                        <Globe size={18} />
                      }
                      required
                    />
                  )}


                  {/* NATIONALITY */}

                  {form.accountType ===
                    "VISITOR" && (
                    <Input
                      label="Nationality"
                      name="nationality"
                      value={
                        form.nationality
                      }
                      onChange={handleChange}
                      placeholder="Your nationality"
                      icon={
                        <Globe size={18} />
                      }
                      required
                    />
                  )}

                </div>

              </FormSection>


              {/* =================================================
                  CONTACT
              ================================================= */}

              <FormSection
                number="02"
                title="Contact Information"
                description="Provide your contact details."
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+252..."
                    icon={<Phone size={18} />}
                    required
                  />

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

                </div>

              </FormSection>


              {/* =================================================
                  SECURITY
              ================================================= */}

              <FormSection
                number="03"
                title="Account Security"
                description="Create a secure password for your account."
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    icon={
                      <LockKeyhole size={18} />
                    }
                    required
                  />

                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={
                      form.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Repeat password"
                    icon={
                      <LockKeyhole size={18} />
                    }
                    required
                  />

                </div>

              </FormSection>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <div className="border-t border-slate-100 pt-7">

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-[#0B3D91]
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-[#0B3D91]/20
                    transition
                    hover:bg-[#092F70]
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account

                      <ArrowRight size={19} />
                    </>
                  )}

                </button>


                {/* LOGIN LINK */}

                <div className="mt-6 text-center">

                  <p className="text-sm text-slate-500">
                    Already have an account?
                  </p>

                  <Link
                    to="/login"
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                      text-[#0B3D91]
                      transition
                      hover:text-[#4189DD]
                    "
                  >
                    Sign in to your account
                  </Link>

                </div>


                {/* HOME */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/", {
                      replace: true,
                    })
                  }
                  className="
                    mx-auto
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                    hover:text-[#0B3D91]
                  "
                >

                  <ArrowLeft size={15} />

                  Back to Home

                </button>

              </div>

            </form>

          </div>

        </div>


        {/* FOOTER */}

        <div className="py-6 text-center">

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Federal Government
            of Somalia · Somalia Government Portal
          </p>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// FORM SECTION
// =====================================================

function FormSection({
  number,
  title,
  description,
  children,
}) {
  return (
    <section>

      <div className="mb-5 flex items-start gap-4">

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#EAF3FF]
            text-xs
            font-black
            text-[#0B3D91]
          "
        >
          {number}
        </div>


        <div>

          <h2
            className="
              text-lg
              font-black
              text-slate-900
            "
          >
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-slate-50/50
          p-5
          sm:p-6
        "
      >
        {children}
      </div>

    </section>
  );
}


// =====================================================
// INPUT
// =====================================================

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

      <label
        htmlFor={name}
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-slate-700
        "
      >

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <div className="relative">

        <span
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </span>


        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3.5
            pl-11
            pr-4
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-[#4189DD]
            focus:ring-4
            focus:ring-[#4189DD]/10
          "
        />

      </div>

    </div>
  );
}


export default Register;