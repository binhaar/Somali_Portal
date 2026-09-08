import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

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

  /*
   * Haddii user horey u login-gareeyay
   * oo uu mar kale galo /login,
   * ha lagu celin login form-ka.
   */
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

      /*
       * AuthContext login()
       * wuxuu sameynayaa API login-ka
       */
      const response = await login(
        cleanEmail,
        password
      );

      /*
       * User-ka waxaa laga heli karaa response.user
       * ama AuthContext user.
       */
      const loggedInUser =
        response?.user || user;

      /*
       * Haddii user-ku service ka yimid:
       *
       * Home
       *   ↓
       * Service
       *   ↓
       * Login
       *   ↓
       * Service
       *
       * pendingServiceUrl waxaa lagu keydiyay
       * sessionStorage gudaha Home.jsx.
       */
      const pendingServiceUrl =
        sessionStorage.getItem(
          "pendingServiceUrl"
        );

      const pendingServiceTitle =
        sessionStorage.getItem(
          "pendingServiceTitle"
        );

      /*
       * Haddii service la sugayay,
       * service-ka ku fur tab cusub.
       */
      if (pendingServiceUrl) {
        sessionStorage.removeItem(
          "pendingServiceUrl"
        );

        sessionStorage.removeItem(
          "pendingServiceTitle"
        );

        try {
          const serviceUrl = new URL(
            pendingServiceUrl
          );

          /*
           * Security:
           * Kaliya HTTP iyo HTTPS ayaa la oggol yahay.
           */
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

        /*
         * Muhiim:
         * replace:true wuxuu login page-ka
         * ka saaraa browser history-ga.
         */
        navigate("/", {
          replace: true,
        });

        return;
      }

      /*
       * ADMIN
       */
      if (loggedInUser?.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      /*
       * CITIZEN / VISITOR
       */
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

  /*
   * Inta AuthContext uu hubinayo session-ka
   */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#123c2f]" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Haddii horey loo login-gareeyay,
   * ha soo bandhigin login form.
   */
  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#123c2f]" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden bg-[#123c2f] lg:flex">
          <div className="relative flex w-full flex-col justify-between overflow-hidden p-12 text-white">
            {/* Decorative elements */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#16804c]/20" />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#123c2f]">
                <ShieldCheck size={30} />
              </div>

              <div>
                <div className="text-lg font-black">
                  Federal Government
                </div>

                <div className="text-sm text-white/60">
                  Republic of Somalia
                </div>
              </div>
            </div>

            {/* Main text */}
            <div className="relative z-10 max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#80d7a7]">
                Government Portal
              </p>

              <h1 className="text-5xl font-black leading-tight">
                Secure access to government services.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Access government information and
                digital services through one secure
                portal.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <ShieldCheck
                    size={24}
                    className="text-[#80d7a7]"
                  />

                  <p className="mt-3 font-bold">
                    Secure
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    Protected account access
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <LockKeyhole
                    size={24}
                    className="text-[#80d7a7]"
                  />

                  <p className="mt-3 font-bold">
                    Trusted
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    Government services
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-sm text-white/40">
              © {new Date().getFullYear()} Federal
              Government of Somalia
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#123c2f] text-white">
                <ShieldCheck size={25} />
              </div>

              <div>
                <div className="font-black text-[#123c2f]">
                  Federal Government
                </div>

                <div className="text-xs text-slate-500">
                  Republic of Somalia
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4ee] text-[#123c2f]">
                  <LockKeyhole size={24} />
                </div>

                <h2 className="text-3xl font-black text-[#123c2f]">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to access your government
                  services.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#16804c] focus:bg-white focus:ring-4 focus:ring-[#16804c]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#16804c] focus:bg-white focus:ring-4 focus:ring-[#16804c]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
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
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#123c2f] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#123c2f]/20 transition hover:bg-[#0d3026] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

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
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="mt-2 inline-block text-sm font-bold text-[#16804c] hover:underline"
                >
                  Create an account
                </Link>
              </div>

              {/* BACK HOME */}
              <button
                onClick={() =>
                  navigate("/", {
                    replace: true,
                  })
                }
                className="mt-5 w-full text-center text-sm font-semibold text-slate-400 transition hover:text-[#123c2f]"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}