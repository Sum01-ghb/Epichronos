import { useAuth } from "../auth/AuthContext";
import { LogOut } from "lucide-react";
import epichronosLogo from "../assets/epichronos.png";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const displayName = user?.name ?? user?.email ?? "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-sky-100/50 bg-linear-to-r from-sky-50/90 via-blue-50/80 to-teal-50/90 backdrop-blur-2xl shadow-sm shadow-sky-900/5 transition-all duration-300">
      <div className="relative mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Left section: Mobile toggle & Spacer */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="mr-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/50 shadow-sm border border-white/60 hover:bg-white hover:text-sky-600 hover:scale-105 active:scale-95 transition-all duration-300 focus:ring-2 focus:ring-sky-400 outline-none md:hidden group"
            aria-label="Toggle navigation">
            <span className="flex h-3.5 w-4 flex-col justify-between">
              <span className="h-[2px] w-full rounded-full bg-slate-600 transition-colors group-hover:bg-sky-500" />
              <span className="h-[2px] w-full rounded-full bg-slate-600 transition-colors group-hover:bg-sky-500" />
              <span className="h-[2px] w-3/4 rounded-full bg-slate-600 transition-colors group-hover:bg-sky-500" />
            </span>
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-auto select-none">
          <div className="flex items-center gap-2.5 group cursor-pointer transition-transform hover:scale-105 duration-300">
            <img
              src={epichronosLogo}
              alt="EpiChronos Logo"
              className="h-12 w-12 sm:h-20 sm:w-20 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-sky-600 via-blue-600 to-teal-500 drop-shadow-sm">
              EpiChronos
            </h1>
          </div>
        </div>

        {/* Right section: Profile & Output */}
        <div className="flexItems-center gap-3 sm:gap-4 z-10 flex">
          <div
            className="flex h-10 w-10 sm:h-11 sm:w-11 cursor-default items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-teal-400 text-sm font-extrabold text-white shadow-md ring-[3px] ring-white/80 shadow-sky-500/20 group hover:ring-sky-200 transition-all duration-300"
            title={displayName}>
            <span className="transition-transform duration-300 group-hover:scale-110">
              {userInitial}
            </span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className="group flex items-center justify-center gap-2 cursor-pointer rounded-full border border-slate-200/60 bg-white/80 px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:border-transparent hover:bg-linear-to-r hover:from-rose-500/10 hover:to-orange-500/10 hover:text-rose-600 hover:shadow-md active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
            aria-label="Sign out">
            <span className="hidden sm:inline">Sign out</span>
            <LogOut
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
