import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Mail, Lock, Activity, Sparkles, BrainCircuit } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Login failed");
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
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-linear-to-br from-slate-50 via-blue-50/60 to-teal-50/60">
        
        {/* Mobile background orbs */}
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/20 blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-teal-300/20 blur-[100px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/60 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-sky-400 to-teal-400 text-white shadow-lg shadow-sky-500/30 mb-6 lg:hidden">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Sign In
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Access your AI-powered health dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-sm font-medium text-rose-700 flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wide text-slate-600 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white bg-white/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wide text-slate-600 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white bg-white/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:scale-100 disabled:opacity-70 disabled:shadow-none cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <Activity className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-sky-600 hover:text-sky-500 transition-colors underline decoration-sky-200 underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
