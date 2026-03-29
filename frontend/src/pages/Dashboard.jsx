import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  History,
  ShieldCheck,
  AlertTriangle,
  Users,
  BrainCircuit,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getPatientHistory } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getPatientHistory()
      .then((data) => {
        if (!cancelled) {
          setReports(Array.isArray(data) ? data : []);
          setLoading(false);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setLoading(false);
          setIsLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalAnalyzed = reports.length;
  const highRisk = reports.filter((r) => r.risk_level === "High").length;
  const modRisk = reports.filter((r) => r.risk_level === "Moderate").length;
  const lowRisk = reports.filter((r) => r.risk_level === "Low").length;

  const stats = [
    {
      label: "Total Analyzed",
      value: loading ? "-" : totalAnalyzed,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "High Risk",
      value: loading ? "-" : highRisk,
      icon: Activity,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      label: "Moderate Risk",
      value: loading ? "-" : modRisk,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Low Risk",
      value: loading ? "-" : lowRisk,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: lowRisk, color: "#10b981" },
    { name: "Moderate Risk", value: modRisk, color: "#f59e0b" },
    { name: "High Risk", value: highRisk, color: "#f43f5e" },
  ];

  const recentPatients = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.analysis_date) - new Date(a.analysis_date))
      .slice(0, 3);
  }, [reports]);

  const weeklyTrendData = useMemo(() => {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    return past7Days.map((dateStr) => {
      const count = reports.filter(
        (r) =>
          r.risk_level === "High" &&
          r.analysis_date &&
          r.analysis_date.startsWith(dateStr),
      ).length;
      const dateObj = new Date(dateStr);
      return {
        day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        risk: count,
      };
    });
  }, [reports]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/60 to-teal-50/60 pb-32 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[0%] left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-teal-300/20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-350 px-4 pt-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-slate-900 via-sky-900 to-teal-950 p-8 sm:p-12 shadow-2xl border border-slate-700/50 group">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-500/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 flex-1 text-center md:text-left">
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span className="text-xs font-bold text-sky-100 tracking-widest uppercase">EpiChronos AI Dashboard</span>
              </div> */}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Advanced{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-teal-300">
                  cancer risk
                </span>{" "}
                analysis powered by intelligence.
              </h1>

              <p className="max-w-xl text-lg text-slate-300 font-medium leading-relaxed mx-auto md:mx-0">
                Prioritize at‑risk patients using multi‑modal risk scores,
                temporal trends, and explainable AI outputs tailored to your
                population.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate("/analyze")}
                  className="w-full sm:w-auto overflow-hidden group/btn relative inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-sky-400 via-blue-500 to-teal-500 p-0.5 shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] outline-none cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center gap-2 rounded-[14px] bg-linear-to-r from-sky-500 via-blue-600 to-teal-500 px-8 py-3.5 text-base font-bold text-white transition-all group-hover/btn:from-sky-400 group-hover/btn:via-blue-500 group-hover/btn:to-teal-400">
                    <Activity className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                    <span>Analyze New Patient</span>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/patients")}
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-3.5 text-base font-bold text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-md">
                  <History className="w-5 h-5" />
                  <span>Patient History</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center shrink-0 w-72 h-72">
              <div className="relative w-full h-full animate-[spin_30s_linear_infinite]">
                <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/30" />
                <div className="absolute inset-4 rounded-full border border-teal-400/20" />
                <div className="absolute inset-8 rounded-full border border-blue-400/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit className="w-24 h-24 text-sky-400/80 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-xl p-6 lg:p-8 border ${stat.border} shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-white group-hover:shadow-sm`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-800">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mt-2 text-slate-400" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div
                className={`absolute bottom-0 left-0 w-full h-1.5 ${stat.bg}`}
              />
            </div>
          ))}
        </section>

        {/* BENTO GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution Chart */}
          <div className="col-span-1 lg:col-span-1 border border-white/60 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 flex flex-col shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Risk Distribution
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Across all analyzed patients
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-sky-50 group-hover:text-sky-600">
                <PieChartIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 min-h-[260px] relative flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              ) : totalAnalyzed === 0 ? (
                <p className="text-sm text-slate-500 font-medium">
                  No data available.
                </p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution.filter((d) => d.value > 0)}
                        innerRadius="65%"
                        outerRadius="95%"
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={12}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "1rem",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                        itemStyle={{ fontWeight: 700 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-800 tracking-tighter">
                      {totalAnalyzed}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Total
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Weekly Trend Mini Graph */}
          <div className="col-span-1 lg:col-span-1 border border-white/60 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 flex flex-col shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  High-Risk Trend
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Cases flagged last 7 days
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-100">
                <LineChartIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 min-h-[220px] w-[calc(100%+20px)] -ml-5">
              {loading ? (
                <div className="flex items-center justify-center h-full w-full">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : highRisk === 0 && totalAnalyzed > 0 ? (
                <div className="flex items-center justify-center h-full w-full">
                  <p className="text-sm text-slate-500 font-medium ml-4">
                    No high-risk cases detected recently.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyTrendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f43f5e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#f43f5e",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                      contentStyle={{
                        borderRadius: "1rem",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ fontWeight: 700, color: "#f43f5e" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="risk"
                      stroke="#f43f5e"
                      strokeWidth={4}
                      dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 7, strokeWidth: 0, fill: "#f43f5e" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
            {/* Recent Analyses (Replaces Top Drivers) */}
            <div className="flex-1 border border-white/60 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-8 shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500 text-center">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    Recent Analyses
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Latest predictive reports
                  </p>
                </div>
              </div>
              <div className="space-y-3.5">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : recentPatients.length > 0 ? (
                  recentPatients.map((rep, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate("/patients")}
                      className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm hover:shadow-md hover:bg-white transition-all cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">
                          {rep.patient_name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(rep.analysis_date).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`flex items-center gap-1.5 text-[11px] font-black tracking-wider ${
                          rep.risk_level === "High"
                            ? "text-rose-600 bg-rose-100"
                            : rep.risk_level === "Moderate"
                              ? "text-amber-600 bg-amber-100"
                              : "text-emerald-600 bg-emerald-100"
                        } px-2.5 py-1 rounded-lg`}>
                        {rep.risk_level}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No patients analyzed yet.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-4 h-28">
              <button
                onClick={() => navigate("/analyze")}
                className="group flex flex-col items-center justify-center gap-2 rounded-[2rem] bg-linear-to-br from-white to-sky-50 border border-sky-100 shadow-md hover:shadow-sky-500/20 hover:-translate-y-1 transition-all text-sky-700 cursor-pointer">
                <Activity className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold tracking-tight">
                  Analyze
                </span>
              </button>
              <button
                onClick={() => navigate("/patients")}
                className="group flex flex-col items-center justify-center gap-2 rounded-[2rem] bg-white border border-slate-200/60 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-slate-600 cursor-pointer">
                <History className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold tracking-tight">
                  History
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
