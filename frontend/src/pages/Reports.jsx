import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Download,
  Activity,
  User,
  Calendar,
  Flame,
  Dna,
  BrainCircuit,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fallbackPatient = {
  name: "NaN",
  age: "NaN",
  gender: "NaN",
  smokingStatus: "NaN",
  analysisDate: new Date().toISOString().split("T")[0],
};

const fallbackRiskScore = 72; // used if no prediction provided

function computeRiskCategory(score) {
  if (score < 33) return "Low";
  if (score < 66) return "Moderate";
  return "High";
}

function SectionCard({ title, icon: Icon, children, accent = "sky", id }) {
  const accentClasses = {
    blue: "border-l-blue-500",
    purple: "border-l-purple-500",
    pink: "border-l-pink-500",
    teal: "border-l-teal-500",
    yellow: "border-l-amber-500",
    sky: "border-l-sky-500",
  }[accent];

  const iconColors = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    pink: "text-pink-500 bg-pink-500/10",
    teal: "text-teal-500 bg-teal-500/10",
    yellow: "text-amber-500 bg-amber-500/10",
    sky: "text-sky-500 bg-sky-500/10",
  }[accent];

  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 flex flex-col h-full`}>
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClasses}`}
      />
      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2.5 rounded-xl ${iconColors}`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              {title}
            </h2>
          </div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </section>
  );
}

function InfoTile({ label, value, icon: Icon, accent }) {
  const isNan = value === "NaN" || value === null || value === undefined;
  const displayValue = isNan ? "NaN" : value;

  const accentColors =
    {
      blue: "text-blue-500 bg-blue-500/10 ring-blue-500/20",
      purple: "text-purple-500 bg-purple-500/10 ring-purple-500/20",
      pink: "text-pink-500 bg-pink-500/10 ring-pink-500/20",
      amber: "text-amber-500 bg-amber-500/10 ring-amber-500/20",
      teal: "text-teal-500 bg-teal-500/10 ring-teal-500/20",
      slate: "text-slate-500 bg-slate-500/10 ring-slate-500/20",
    }[accent] || "text-slate-500 bg-slate-500/10 ring-slate-500/20";

  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white/70 backdrop-blur-xl p-5 border border-white shadow-lg shadow-slate-200/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div
        className={`p-3.5 rounded-2xl ring-1 transition-colors ${accentColors} group-hover:bg-opacity-20`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p
          className={`mt-0.5 text-lg font-bold tracking-tight ${isNan ? "text-slate-400 italic" : "text-slate-800"}`}>
          {displayValue}
        </p>
      </div>
    </div>
  );
}

export default function Reports() {
  const reportRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const patientData = state.patientData || {};
  const prediction = state.prediction || null;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
  }, []);

  if (!prediction) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 text-center select-none relative z-10 p-6 bg-linear-to-br from-slate-50 via-blue-50/80 to-teal-50/80">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-teal-300/20 blur-[120px]" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full animate-pulse" />
          <div className="flex items-center justify-center w-28 h-28 bg-white/60 backdrop-blur-xl rounded-full shadow-2xl border border-white/60 relative z-10">
            <Stethoscope className="w-12 h-12 text-sky-500" />
          </div>
        </div>
        <div className="space-y-3 relative z-10 mt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-sky-800 to-teal-700">
            No Analysis Available
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-sm mx-auto font-medium">
            Please run a predictive analysis on a patient profile to generate a
            comprehensive risk report.
          </p>
        </div>
        <button
          onClick={() => navigate("/analyze")}
          className="group relative mt-6 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-sky-500 via-blue-500 to-teal-500 p-0.5 shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 focus:outline-none">
          <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-[14px] bg-linear-to-r from-sky-500/90 via-blue-500/90 to-teal-500/90 px-8 py-4 text-lg font-bold text-white transition-all group-hover:from-sky-400 group-hover:via-blue-400 group-hover:to-teal-400">
            <span className="relative z-10 flex items-center gap-2">
              <Activity className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Analyze Patient
            </span>
          </div>
        </button>
      </div>
    );
  }

  const effectivePatient = {
    name: patientData.patientName ?? fallbackPatient.name,
    age:
      patientData.age !== undefined && patientData.age !== null
        ? Number(patientData.age)
        : fallbackPatient.age,
    gender: patientData.gender ?? fallbackPatient.gender,
    smokingStatus: patientData.smokingStatus ?? fallbackPatient.smokingStatus,
    analysisDate: fallbackPatient.analysisDate,
  };

  const riskScorePercent = prediction
    ? Math.round((prediction.risk_score || 0) * 100)
    : fallbackRiskScore;

  const effectiveRiskCategory = prediction?.risk_level
    ? prediction.risk_level
    : computeRiskCategory(riskScorePercent);

  const pieData = useMemo(
    () => [
      { name: "Risk", value: riskScorePercent },
      { name: "Remaining", value: 100 - riskScorePercent },
    ],
    [riskScorePercent],
  );

  const riskColor = useMemo(() => {
    if (effectiveRiskCategory === "Low") return "#10b981";
    if (effectiveRiskCategory === "Moderate") return "#f59e0b";
    return "#ef4444";
  }, [effectiveRiskCategory]);

  const riskIcon = useMemo(() => {
    if (effectiveRiskCategory === "Low")
      return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    if (effectiveRiskCategory === "Moderate")
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <Activity className="w-5 h-5 text-red-500" />;
  }, [effectiveRiskCategory]);

  const biomarkerData = useMemo(() => {
    if (!prediction?.biomarker_contribution) return [];
    return Object.entries(prediction.biomarker_contribution)
      .map(([name, value]) => ({
        name,
        value: Number(value) || 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [prediction]);

  const topBiomarkers = prediction?.top_biomarkers || [];

  const handleDownload = () => {
    const riskColorHex =
      effectiveRiskCategory === "Low"
        ? "#10b981"
        : effectiveRiskCategory === "Moderate"
          ? "#f59e0b"
          : "#ef4444";

    const bioRows = biomarkerData
      .slice(0, 12)
      .map(
        (b) => `
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #f1f5f9">${b.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${Math.round(b.value * 100)}%;background:${riskColorHex};border-radius:99px"></div>
              </div>
              <span style="font-size:12px;font-weight:700;color:${riskColorHex};min-width:36px;text-align:right">${(b.value * 100).toFixed(1)}%</span>
            </div>
          </td>
        </tr>`,
      )
      .join("");

    const topRows = topBiomarkers
      .map(
        (item, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:${i < 3 ? "#fffbeb" : "#f8fafc"};border-radius:12px;border:1px solid ${i < 3 ? "#fde68a" : "#e2e8f0"};margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${i < 3 ? "#f59e0b" : "#94a3b8"};color:#fff;font-size:11px;font-weight:800">${i + 1}</span>
            <span style="font-size:13px;font-weight:700;color:#334155">${item.feature}</span>
          </div>
          <span style="font-size:13px;font-weight:800;color:#d97706">${(item.importance * 100).toFixed(1)}%</span>
        </div>`,
      )
      .join("");

    const epiAgeSection =
      typeof prediction.epigenetic_age === "number"
        ? `<div class="card">
            <h2 class="section-title">🔬 Cellular Age Comparison</h2>
            <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:12px">
              <div style="flex:1;min-width:120px;text-align:center;padding:20px;background:#eef2ff;border-radius:16px;border:1px solid #c7d2fe">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#818cf8;margin-bottom:8px">Chronological</div>
                <div style="font-size:40px;font-weight:900;color:#312e81">${effectivePatient.age}</div>
                <div style="font-size:12px;color:#818cf8;margin-top:4px">years</div>
              </div>
              <div style="flex:1;min-width:120px;text-align:center;padding:20px;background:#fff7ed;border-radius:16px;border:1px solid #fed7aa">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#f97316;margin-bottom:8px">Epigenetic</div>
                <div style="font-size:40px;font-weight:900;color:#7c2d12">${Math.round(prediction.epigenetic_age)}</div>
                <div style="font-size:12px;color:#f97316;margin-top:4px">years</div>
              </div>
              <div style="flex:2;min-width:200px;display:flex;flex-direction:column;justify-content:center;padding:20px;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0">
                <div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:8px">Age Acceleration</div>
                <div style="font-size:28px;font-weight:900;color:${Math.round(prediction.epigenetic_age) > effectivePatient.age ? "#ef4444" : "#10b981"}">
                  ${Math.round(prediction.epigenetic_age) > effectivePatient.age ? "+" : ""}${Math.round(prediction.epigenetic_age) - effectivePatient.age} yrs
                </div>
                <div style="font-size:12px;color:#94a3b8;margin-top:4px">${Math.round(prediction.epigenetic_age) > effectivePatient.age ? "Epigenetic aging detected" : "No accelerated aging"}</div>
              </div>
            </div>
          </div>`
        : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>EpiChronos Risk Report – ${effectivePatient.name}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#0f172a;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{max-width:820px;margin:0 auto;padding:32px 40px}
    .hero{background:linear-gradient(135deg,#0f172a 0%,#0c4a6e 50%,#042f2e 100%);border-radius:20px;padding:32px;margin-bottom:24px;color:#fff}
    .hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#bae6fd;margin-bottom:16px}
    .hero-name{font-size:32px;font-weight:900;margin-bottom:8px}
    .hero-sub{font-size:14px;color:rgba(255,255,255,.7);margin-bottom:20px}
    .risk-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:99px;font-size:15px;font-weight:800;border:2px solid;margin-bottom:8px}
    .score-line{font-size:13px;color:rgba(255,255,255,.6)}
    .info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
    .info-tile{background:#fff;border-radius:14px;padding:14px 16px;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .tile-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:4px}
    .tile-value{font-size:15px;font-weight:700;color:#1e293b}
    .card{background:#fff;border-radius:16px;padding:20px 24px;margin-bottom:20px;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .section-title{font-size:15px;font-weight:800;color:#0f172a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9}
    table{width:100%;border-collapse:collapse}
    .footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8}
    @page{margin:0.5in;size:A4 portrait}
    @media print{body{background:#fff}.page{padding:0}}
  </style>
</head>
<body>
<div class="page">
  <div class="hero">
    <div class="hero-badge">⬡ EpiChronos AI Diagnostics</div>
    <div class="hero-name">${effectivePatient.name !== "NaN" ? effectivePatient.name : "Unknown Profile"}</div>
    <div class="hero-sub">Based on deep epigenetic analysis, this patient demonstrates the following risk profile.</div>
    <div class="risk-pill" style="color:${riskColorHex};border-color:${riskColorHex};background:${riskColorHex}18">
      ${effectiveRiskCategory} Risk
    </div>
    <div class="score-line">Risk Score: <strong style="color:#fff">${riskScorePercent} / 100</strong> &nbsp;·&nbsp; Analysis Date: <strong style="color:#fff">${effectivePatient.analysisDate}</strong></div>
  </div>

  <div class="info-grid">
    <div class="info-tile"><div class="tile-label">Patient Name</div><div class="tile-value">${effectivePatient.name}</div></div>
    <div class="info-tile"><div class="tile-label">Age</div><div class="tile-value">${effectivePatient.age !== "NaN" ? effectivePatient.age + " years" : "—"}</div></div>
    <div class="info-tile"><div class="tile-label">Gender</div><div class="tile-value">${effectivePatient.gender !== "NaN" ? effectivePatient.gender : "—"}</div></div>
    <div class="info-tile"><div class="tile-label">Smoking Status</div><div class="tile-value">${effectivePatient.smokingStatus !== "NaN" ? effectivePatient.smokingStatus : "—"}</div></div>
    <div class="info-tile"><div class="tile-label">Risk Level</div><div class="tile-value" style="color:${riskColorHex};font-weight:800">${effectiveRiskCategory}</div></div>
    <div class="info-tile"><div class="tile-label">Risk Score</div><div class="tile-value" style="color:${riskColorHex};font-weight:800">${riskScorePercent} / 100</div></div>
  </div>

  ${
    biomarkerData.length > 0
      ? `
  <div class="card">
    <h2 class="section-title">📊 Biomarker Contribution</h2>
    <table><tbody>${bioRows}</tbody></table>
  </div>`
      : ""
  }

  ${
    topBiomarkers.length > 0
      ? `
  <div class="card">
    <h2 class="section-title">🔑 Top Drivers</h2>
    ${topRows}
  </div>`
      : ""
  }

  ${epiAgeSection}

  <div class="footer">
    Generated by EpiChronos AI · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · For clinical reference only
  </div>
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;

    const popup = window.open(
      "",
      "_blank",
      "width=900,height=700,scrollbars=yes",
    );
    if (!popup) {
      alert("Please allow popups for this site to download the report as PDF.");
      return;
    }
    popup.document.write(html);
    popup.document.close();
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/60 to-teal-50/60 pt-8 pb-32 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[140px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-300/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-4xl shadow-xl shadow-slate-200/40">
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl bg-clip-text bg-linear-to-r from-sky-900 via-blue-800 to-teal-800">
              Risk Analysis Report
            </h1>
            <p className="max-w-2xl text-base text-slate-500 font-medium leading-relaxed">
              Model-derived epigenetic cancer risk summary for patient
              profiling, including key biomarker attributions.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="group relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 to-sky-900 p-0.5 shadow-xl shadow-sky-900/20 transition-all hover:scale-[1.02] hover:shadow-sky-900/40 focus:outline-none cursor-pointer">
            <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-[14px] bg-linear-to-r from-slate-800 to-sky-800 px-6 py-3.5 text-sm font-bold text-white transition-all group-hover:from-slate-700 group-hover:to-sky-700">
              <Download className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 text-sky-400" />
              <span>Download Report</span>
            </div>
          </button>
        </header>

        {/* Report content */}
        <div ref={reportRef} className="space-y-6">
          {/* HERO SUMMARY */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-slate-900 via-sky-950 to-teal-950 p-8 sm:p-12 shadow-2xl border border-slate-700 w-full group">
            <div className="absolute top-0 right-0 w-160 h-160 bg-sky-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-160 h-160 bg-teal-500/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-5 text-center md:text-left flex-1 max-w-2xl">
                {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-md">
                  <BrainCircuit className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-sky-200 tracking-widest uppercase">
                    AI Diagnostics
                  </span>
                </div> */}
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {effectivePatient.name !== "NaN"
                    ? effectivePatient.name
                    : "Unknown Profile"}
                </h2>
                <p className="text-slate-300 text-base sm:text-xl leading-relaxed font-medium">
                  Based on deep epigenetic analysis, this patient's profile
                  demonstrates a{" "}
                  <span
                    className="text-white font-bold px-1.5 py-0.5 rounded-md mx-1 border border-white/20"
                    style={{ backgroundColor: `${riskColor}30` }}>
                    {effectiveRiskCategory}
                  </span>{" "}
                  risk correlation.
                </p>
              </div>

              <div className="flex items-center justify-center shrink-0 w-64 h-64 bg-slate-900/50 p-6 rounded-4xl border border-slate-800 backdrop-blur-md shadow-2xl shadow-black/40">
                <div className="w-full h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="riskGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1">
                          <stop
                            offset="0%"
                            stopColor={riskColor}
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor={riskColor}
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius="75%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                        cornerRadius={12}>
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Risk"
                                ? "url(#riskGrad)"
                                : "rgba(255,255,255,0.03)"
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                      className="text-5xl font-black tracking-tighter"
                      style={{ color: riskColor }}>
                      {riskScorePercent}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mt-1">
                      Score
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PATIENT INFO */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoTile
              icon={User}
              label="Patient Name"
              value={effectivePatient.name}
              accent="blue"
            />
            <InfoTile
              icon={Calendar}
              label="Age"
              value={
                effectivePatient.age === "NaN"
                  ? "NaN"
                  : `${effectivePatient.age} years`
              }
              accent="purple"
            />
            <InfoTile
              icon={Dna}
              label="Gender"
              value={effectivePatient.gender}
              accent="pink"
            />
            <InfoTile
              icon={Flame}
              label="Smoking Status"
              value={effectivePatient.smokingStatus}
              accent="amber"
            />
            <InfoTile
              icon={Activity}
              label="Analysis Date"
              value={effectivePatient.analysisDate}
              accent="teal"
            />
            <div className="flex items-center gap-4 rounded-3xl bg-slate-900 p-5 border border-slate-800 shadow-xl shadow-slate-900/20 overflow-hidden relative group">
              <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-l from-sky-500/20 to-transparent pointer-events-none" />
              <div className="p-3.5 rounded-2xl bg-white/10 ring-1 ring-white/20 text-sky-400">
                {riskIcon}
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Category
                </p>
                <p
                  className="mt-0.5 text-xl font-black tracking-tight"
                  style={{ color: riskColor }}>
                  {effectiveRiskCategory}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            {/* Biomarker Contribution */}
            <SectionCard
              title="Biomarker Contribution"
              icon={BarChart}
              accent="sky">
              <div className="w-full h-80 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={biomarkerData}
                    layout="vertical"
                    margin={{ left: -20, top: 10, right: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop
                          offset="0%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(14,165,233,0.05)" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Relative Importance"
                      radius={[0, 6, 6, 0]}
                      fill="url(#barGrad)"
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Top Influential Biomarkers */}
            <SectionCard title="Top Drivers" icon={Flame} accent="yellow">
              <div className="flex flex-col h-full bg-amber-500/5 rounded-3xl border border-amber-500/10 p-5 mt-2">
                {topBiomarkers.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                    <Activity className="w-8 h-8 text-amber-500 mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-amber-700">
                      Driver data unavailable
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3">
                    {topBiomarkers.map((item, index) => (
                      <div
                        key={item.feature}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 hover:bg-white transition-colors border border-amber-100/50 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold ${index < 3 ? "bg-linear-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/30" : "bg-slate-200 text-slate-500"}`}>
                            {index + 1}
                          </div>
                          <span className="font-bold text-slate-700 text-sm tracking-tight">
                            {item.feature}
                          </span>
                        </div>
                        <span className="font-black text-amber-600 text-sm tabular-nums tracking-tighter">
                          {(item.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Epigenetic Age section */}
          {typeof prediction.epigenetic_age === "number" && (
            <SectionCard
              title="Cellular Age Comparison"
              icon={BrainCircuit}
              accent="purple">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-4 items-center p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center text-center p-6 rounded-4xl bg-indigo-50/50 border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-indigo-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                      Chronological
                    </p>
                    <p className="text-5xl font-black tracking-tighter text-indigo-900">
                      {effectivePatient.age}
                    </p>
                    <p className="text-xs font-semibold text-indigo-400 mt-1">
                      years
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 rounded-4xl bg-orange-50/50 border border-orange-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-orange-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
                      Epigenetic
                    </p>
                    <p className="text-5xl font-black tracking-tighter text-orange-900">
                      {Math.round(prediction.epigenetic_age)}
                    </p>
                    <p className="text-xs font-semibold text-orange-400 mt-1">
                      years
                    </p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          label: "Comparison",
                          Chronological: effectivePatient.age,
                          Epigenetic: Math.round(prediction.epigenetic_age),
                        },
                      ]}
                      barSize={40}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={false}
                      />
                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="Chronological"
                        fill="#818cf8"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="Epigenetic"
                        fill="#fb923c"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
