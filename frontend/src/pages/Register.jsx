import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Mail, Lock, User, Activity, Sparkles, BrainCircuit } from "lucide-react";

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ?? err.message ?? "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* LEFT PANEL - Visual / Branding */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-slate-900 via-sky-900 to-teal-950 p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-500/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span className="text-xs font-bold text-sky-100 tracking-widest uppercase">EpiChronos AI</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
            EpiChronos
          </h1>
          <p className="text-xl text-sky-100/80 font-medium max-w-md">
            AI-powered cancer risk detection platform
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-center flex-1">
           <div className="relative w-80 h-80 animate-[spin_40s_linear_infinite]">
             <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/30" />
             <div className="absolute inset-8 rounded-full border border-teal-400/20" />
             <div className="absolute inset-16 rounded-full border border-blue-400/10" />
             <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-32 h-32 text-sky-400/80 animate-pulse" />
             </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-linear-to-br from-slate-50 via-blue-50/60 to-teal-50/60 overflow-y-auto">
        
        {/* Mobile background orbs */}
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/20 blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-teal-300/20 blur-[100px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/60 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-sky-400 to-teal-400 text-white shadow-lg shadow-sky-500/30 mb-6 lg:hidden">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Join the AI-powered health dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-sm font-medium text-rose-700 flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {submitError}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wide text-slate-600 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full rounded-xl border ${errors.name ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white focus:border-sky-400 focus:ring-sky-500/10'} bg-white/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 ml-1 text-xs font-semibold text-rose-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wide text-slate-600 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-xl border ${errors.email ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white focus:border-sky-400 focus:ring-sky-500/10'} bg-white/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-sm`}
                  placeholder="doctor@hospital.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 ml-1 text-xs font-semibold text-rose-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wide text-slate-600 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-xl border ${errors.password ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white focus:border-sky-400 focus:ring-sky-500/10'} bg-white/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 ml-1 text-xs font-semibold text-rose-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:scale-100 disabled:opacity-70 disabled:shadow-none cursor-pointer"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <Activity className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-sky-600 hover:text-sky-500 transition-colors underline decoration-sky-200 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
