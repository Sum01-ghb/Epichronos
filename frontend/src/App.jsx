import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import BackgroundDesign from "./components/BackgroundDesign";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Reports from "./pages/Reports";
import PatientHistory from "./pages/PatientHistory";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BackgroundDesign />
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex gap-3 px-2 pb-8 pt-20 sm:px-3 lg:px-4">
        <Sidebar open={isSidebarOpen} onClose={handleCloseSidebar} />

        <main className="flex-1">
          <div className="min-h-[calc(100vh-6rem)] rounded-2xl border border-white/60 bg-white/80 p-3 shadow-sm shadow-slate-100 backdrop-blur-md sm:p-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analyze" element={<Analyze />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/patients" element={<PatientHistory />} />
                  {/* <Route path="/settings" element={<Settings />} /> */}
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
