import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Star,
  Globe2,
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
        ring-white/30
      `}
    >
      <Star
        className="h-7 w-7 fill-white text-white drop-shadow-sm"
      />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" />
    </div>
  );
}


// =====================================================
// LOGIN
// =====================================================

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ===================================================
  // REDIRECT IF ALREADY AUTHENTICATED
  // ===================================================

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) return;

    if (user.role === "ADMIN") {
      navigate("/admin/dashboard", {
        replace: true,
      });

      return;
    }

    navigate("/", {
      replace: true,
    });
  }, [
    isAuthenticated,
    user,
    authLoading,
    navigate,
  ]);


  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        cleanEmail,
        password
      );

      const loggedInUser =
        response?.user || user;


      // ===============================================
      // SERVICE REDIRECT
      // ===============================================

      const pendingServiceUrl =
        sessionStorage.getItem(
          "pendingServiceUrl"
        );

      const pendingServiceTitle =
        sessionStorage.getItem(
          "pendingServiceTitle"
        );


      if (pendingServiceUrl) {
        sessionStorage.removeItem(
          "pendingServiceUrl"
        );

        sessionStorage.removeItem(
          "pendingServiceTitle"
        );

        try {
          const serviceUrl =
            new URL(pendingServiceUrl);

          if (
            serviceUrl.protocol !== "http:" &&
            serviceUrl.protocol !== "https:"
          ) {
            throw new Error(
              "Invalid service URL"
            );
          }

          window.open(
            serviceUrl.href,
            "_blank",
            "noopener,noreferrer"
          );
        } catch (urlError) {
          console.error(
            "Invalid service URL:",
            urlError
          );

          setError(
            "The requested service link is invalid."
          );

          return;
        }

        navigate("/", {
          replace: true,
        });

        return;
      }


      // ===============================================
      // ADMIN
      // ===============================================

      if (loggedInUser?.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }


      // ===============================================
      // CITIZEN / VISITOR
      // ===============================================

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your email and password.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div
            className="
              mx-auto
              h-11
              w-11
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-[#4189DD]
            "
          />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Checking your session...
          </p>

        </div>

      </div>
    );
  }


  // ===================================================
  // ALREADY AUTHENTICATED
  // ===================================================

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div
            className="
              mx-auto
              h-11
              w-11
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-[#4189DD]
            "
          />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Redirecting...
          </p>

        </div>

      </div>
    );
  }


  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">


        {/* =================================================
            LEFT GOVERNMENT PANEL
        ================================================= */}

        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-[#0B3D91]
            lg:flex
          "
        >

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-32
              -top-32
              h-[500px]
              w-[500px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-40
              h-[550px]
              w-[550px]
              rounded-full
              bg-white/5
            "
          />

          <div
            className="
              absolute
              right-20
              top-1/3
              h-32
              w-32
              rounded-full
              bg-[#4189DD]/30
              blur-2xl
            "
          />


          <div
            className="
              relative
              z-10
              flex
              w-full
              flex-col
              justify-between
              p-12
              xl:p-16
              text-white
            "
          >

            {/* TOP BRAND */}

            <div className="flex items-center gap-4">

              <SomaliaFlag size="md" />

              <div>

                <p className="text-lg font-black tracking-tight">
                  Federal Government
                </p>

                <p className="text-sm text-white/70">
                  Republic of Somalia
                </p>

              </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="max-w-xl">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/90
                  backdrop-blur
                "
              >

                <Globe2 className="h-4 w-4" />

                Somalia Government Portal

              </div>


              <h1
                className="
                  text-5xl
                  font-black
                  leading-[1.08]
                  tracking-tight
                  xl:text-6xl
                "
              >
                One portal.
                <br />

                <span className="text-[#8CC8FF]">
                  One secure access.
                </span>
              </h1>


              <p
                className="
                  mt-7
                  max-w-lg
                  text-lg
                  leading-8
                  text-white/75
                "
              >
                Access government information and
                digital services through a secure,
                trusted and unified government portal.
              </p>


              {/* FEATURES */}

              <div className="mt-9 grid grid-cols-2 gap-4">

                <Feature
                  icon={ShieldCheck}
                  title="Secure"
                  text="Protected account access"
                />

                <Feature
                  icon={CheckCircle2}
                  title="Trusted"
                  text="Official digital services"
                />

              </div>

            </div>


            {/* FOOTER */}

            <div className="flex items-center justify-between">

              <p className="text-xs text-white/45">
                © {new Date().getFullYear()} Federal
                Government of Somalia
              </p>

              <p className="text-xs text-white/45">
                Secure Government Portal
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT LOGIN AREA
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-center
            px-5
            py-10
            sm:px-8
            lg:px-12
          "
        >

          <div className="w-full max-w-md">


            {/* MOBILE BRAND */}

            <div className="mb-8 flex flex-col items-center lg:hidden">

              <SomaliaFlag size="md" />

              <div className="mt-4 text-center">

                <p className="font-black text-[#0B3D91]">
                  Federal Government of Somalia
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Somalia Government Portal
                </p>

              </div>

            </div>


            {/* LOGIN CARD */}

            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200
                bg-white
                shadow-2xl
                shadow-slate-200/70
              "
            >

              {/* BLUE TOP BAR */}

              <div className="h-1.5 bg-[#4189DD]" />


              <div className="p-7 sm:p-9">


                {/* ICON */}

                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#EAF3FF]
                    text-[#0B3D91]
                    ring-1
                    ring-[#4189DD]/10
                  "
                >
                  <LockKeyhole size={25} />
                </div>


                {/* TITLE */}

                <h2
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                  "
                >
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to access your government
                  services securely.
                </p>


                {/* ERROR */}

                {error && (
                  <div
                    className="
                      mt-6
                      flex
                      gap-3
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3
                      text-sm
                      font-medium
                      leading-6
                      text-red-700
                    "
                  >

                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                    <span>{error}</span>

                  </div>
                )}


                {/* FORM */}

                <form
                  onSubmit={handleLogin}
                  className="mt-7 space-y-5"
                >


                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={19}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          py-3.5
                          pl-12
                          pr-4
                          text-sm
                          text-slate-800
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-[#4189DD]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-[#4189DD]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="password"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      Password
                    </label>

                    <div className="relative">

                      <LockKeyhole
                        size={19}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={loading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          py-3.5
                          pl-12
                          pr-12
                          text-sm
                          text-slate-800
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-[#4189DD]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-[#4189DD]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        disabled={loading}
                        className="
                          absolute
                          right-2
                          top-1/2
                          -translate-y-1/2
                          rounded-lg
                          p-2
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-[#0B3D91]
                        "
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* SUBMIT */}

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
                      py-3.5
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
                        <div
                          className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />

                        Signing in...
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={18} />

                        Sign In
                      </>
                    )}

                  </button>

                </form>


                {/* REGISTER */}

                <div
                  className="
                    mt-7
                    border-t
                    border-slate-100
                    pt-6
                    text-center
                  "
                >

                  <p className="text-sm text-slate-500">
                    Don't have an account?
                  </p>

                  <Link
                    to="/register"
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-1
                      text-sm
                      font-bold
                      text-[#0B3D91]
                      transition
                      hover:text-[#4189DD]
                    "
                  >
                    Create an account
                  </Link>

                </div>


                {/* BACK HOME */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/", {
                      replace: true,
                    })
                  }
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
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

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// FEATURE
// =====================================================

function Feature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/10
        p-5
        backdrop-blur
      "
    >

      <Icon
        size={23}
        className="text-[#9BD0FF]"
      />

      <p className="mt-3 font-bold">
        {title}
      </p>

      <p className="mt-1 text-sm text-white/55">
        {text}
      </p>

    </div>
  );
}