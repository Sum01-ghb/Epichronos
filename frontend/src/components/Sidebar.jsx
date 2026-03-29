import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  FileText,
  History,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", path: "/analyze", icon: Activity },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Patients History", path: "/patients", icon: History },
  // { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] w-64 flex-shrink-0 border-r border-white/60 bg-white/50 px-4 py-8 text-sm text-slate-500 backdrop-blur-2xl md:block shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] rounded-br-[2.5rem] overflow-hidden group/sidebar z-10">
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-sky-400/10 to-transparent pointer-events-none" />

        <div className="mb-6 px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </p>
        </div>

        <nav className="relative flex h-full flex-col gap-3">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 font-bold tracking-tight outline-none focus:ring-2 focus:ring-sky-400 overflow-hidden",
                  isActive
                    ? "bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 text-white shadow-lg shadow-sky-500/30 scale-[1.02]"
                    : "text-slate-500 hover:bg-white/80 hover:text-sky-600 hover:shadow-sm hover:scale-[1.01] border border-transparent hover:border-white",
                ].join(" ")
              }>
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110 text-white" : "text-slate-400 group-hover:text-sky-500"}`}
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div
            className="flex-1 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-[280px] flex-shrink-0 flex-col border-l border-white/40 bg-white/95 px-5 py-8 text-sm text-slate-500 shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-[2.5rem]">
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-sky-400/10 to-transparent pointer-events-none" />

            <div className="mb-8 flex items-center px-4">
              <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-sky-600 via-blue-600 to-teal-500 drop-shadow-sm">
                Menu
              </h2>
            </div>

            <nav className="relative flex h-full flex-col gap-3">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 font-bold tracking-tight outline-none overflow-hidden",
                      isActive
                        ? "bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 text-white shadow-lg shadow-sky-500/30 scale-[1.02]"
                        : "text-slate-500 hover:bg-slate-100/90 hover:text-sky-600",
                    ].join(" ")
                  }>
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-[22px] w-[22px] transition-transform duration-300 ${isActive ? "scale-110 text-white" : "text-slate-400 group-hover:text-sky-500"}`}
                      />
                      <span className="truncate text-[15px]">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
