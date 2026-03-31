import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientHistory, getPatientReport } from "../services/api";
import { 
  FileText, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  FolderOpen,
  History
} from "lucide-react";

// Risk category badge styles
const riskStyles = {
  Low: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    icon: <ShieldCheck className="w-3.5 h-3.5" />
  },
  Moderate: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
    icon: <AlertTriangle className="w-3.5 h-3.5" />
  },
  High: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/20",
    icon: <Activity className="w-3.5 h-3.5" />
  },
};

function formatAnalysisDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/40 p-6 lg:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl animate-pulse">
      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <div className="h-7 w-2/3 rounded-xl bg-slate-300/40" />
          <div className="h-4 w-1/3 rounded-lg bg-slate-300/20" />
        </div>
        <div className="mt-2 h-8 w-1/2 rounded-full bg-slate-300/40" />
        <div className="h-3 w-1/2 rounded-lg bg-slate-300/20 mt-1" />
        <div className="mt-4 h-12 w-full rounded-2xl bg-slate-300/50" />
      </div>
    </div>
  );
}

export default function PatientHistory() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const data = await getPatientHistory();
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setReports([]);
          setError(err?.response?.data?.detail || err.message || "Failed to load history");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleViewReport = async (reportId) => {
    setLoadingId(reportId);
    setError("");
    try {
      const report = await getPatientReport(reportId);
      const inputs = report.report_data?.biomarker_inputs || {};
      const patientData = {
        patientName: report.patient_name,
        age: report.age,
        gender: report.gender || "",
        smokingStatus: inputs.smoking_status || "",
      };
      const prediction = report.report_data || {};
      navigate("/reports", { state: { patientData, prediction } });
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to load report");
    } finally {
      setLoadingId(null);
    }
  };

  // Empty state: no reports (and not loading)
  if (!loading && reports.length === 0) {
    return (
      <div className={`flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 text-center select-none relative z-10 p-6 bg-linear-to-br from-slate-50 via-blue-50/80 to-teal-50/80 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-teal-300/20 blur-[120px]" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
          <div className="flex items-center justify-center w-28 h-28 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 relative z-10 rotate-3">
             <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-sky-400 to-blue-500 shadow-inner">
                 <FolderOpen className="w-8 h-8 text-white" />
             </div>
          </div>
        </div>
        <div className="space-y-3 relative z-10 mt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-sky-800 to-teal-700">
            No History Found
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-sm mx-auto font-medium">
            Analyze a patient to generate predictive risk reports and populate your dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/analyze")}
          className="group relative mt-6 inline-flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 p-0.5 shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 focus:outline-none"
        >
          <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-[14px] bg-linear-to-r from-sky-500/90 via-blue-500/90 to-teal-500/90 px-8 py-4 text-lg font-bold text-white transition-all group-hover:from-sky-400 group-hover:via-blue-400 group-hover:to-teal-400">
            <span className="relative z-10 flex items-center gap-2">
              <Activity className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Analyze First Patient
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/60 to-teal-50/60 pt-8 pb-32 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[140px]" />
        <div className="absolute -bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-teal-300/30 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40">
          <div className="space-y-3 flex-1 pl-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl bg-clip-text text-transparent bg-linear-to-r from-sky-900 via-blue-800 to-teal-800">
              Patients History
            </h1>
            <p className="max-w-2xl text-base text-slate-500 font-medium leading-relaxed">
              A comprehensive log of previously analyzed epigenetic risk reports. Click any card to securely view the full diagnostic breakdown.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20">
             <History className="w-8 h-8 text-sky-600" />
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-4 rounded-3xl bg-red-50/90 p-5 text-red-600 border border-red-200 shadow-lg shadow-red-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-base">Unable to load history</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             <SkeletonCard />
             <SkeletonCard />
             <SkeletonCard />
             <SkeletonCard className="hidden sm:block" />
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reports.map((report) => {
              const riskStyling = riskStyles[report.risk_level] || riskStyles.Moderate;
              return (
                <li
                  key={report.id}
                  className="group relative flex flex-col rounded-[2.5rem] border border-white/60 bg-white/60 p-6 lg:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/70 to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col gap-5 flex-1 relative z-10">
                    <div className="space-y-1.5">
                      <h2 className="font-extrabold text-2xl tracking-tight text-slate-800 line-clamp-1">
                        {report.patient_name || "Unknown"}
                      </h2>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span>Age: {report.age}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="capitalize">{report.gender || "—"}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                       <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">Risk Category</span>
                       <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-bold shadow-sm ${riskStyling.bg} ${riskStyling.border} ${riskStyling.text}`}>
                          {riskStyling.icon}
                          {report.risk_level}
                       </div>
                    </div>

                    <div className="flex-1" />

                    <div className="flex flex-col gap-4 mt-2 border-t border-slate-200/50 pt-5">
                       <p className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                          <span>Analyzed On</span>
                          <span className="text-slate-600">{formatAnalysisDate(report.analysis_date)}</span>
                       </p>
                      
                       <button
                         type="button"
                         onClick={() => handleViewReport(report.id)}
                         disabled={loadingId === report.id}
                         className="group/btn relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 p-0.5 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                       >
                         <div className="relative flex h-full w-full items-center justify-center gap-2 rounded-[14px] bg-linear-to-r from-sky-50/90 via-sky-100/90 to-teal-50/90 px-4 py-3 text-sm font-bold text-sky-700 transition-all group-hover/btn:from-sky-500 group-hover/btn:via-blue-500 group-hover/btn:to-teal-500 group-hover/btn:text-white border border-sky-200/50 group-hover/btn:border-transparent backdrop-blur-md">
                           {loadingId === report.id ? (
                             <>
                               <Loader2 className="w-4 h-4 animate-spin" />
                               <span>Loading Report...</span>
                             </>
                           ) : (
                             <>
                               <span>View Full Report</span>
                               <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                             </>
                           )}
                         </div>
                       </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
