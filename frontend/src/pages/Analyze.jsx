import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictPatient } from "../services/api";
import {
  Activity,
  Dna,
  Microscope,
  Stethoscope,
  ChevronDown,
  AlertCircle,
  Loader2,
  BrainCircuit,
  PieChart,
} from "lucide-react";

function SectionCard({ title, icon: Icon, children, accent, id }) {
  const accentClasses =
    {
      blue: "border-l-blue-500",
      purple: "border-l-purple-500",
      pink: "border-l-pink-500",
      teal: "border-l-teal-500",
      yellow: "border-l-amber-500",
    }[accent] || "border-l-sky-500";

  const iconColors =
    {
      blue: "text-blue-500 bg-blue-500/10",
      purple: "text-purple-500 bg-purple-500/10",
      pink: "text-pink-500 bg-pink-500/10",
      teal: "text-teal-500 bg-teal-500/10",
      yellow: "text-amber-500 bg-amber-500/10",
    }[accent] || "text-sky-500 bg-sky-500/10";

  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60`}>
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClasses}`}
      />
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          {Icon && (
            <div className={`p-3 rounded-2xl ${iconColors}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            {title}
          </h2>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", name, options, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div className="relative w-full group">
      <div
        className={`absolute -inset-0.5 rounded-2xl transition duration-500 blur-[2px] pointer-events-none ${
          isFocused
            ? "bg-sky-400/50 opacity-100"
            : "bg-transparent opacity-0 group-hover:bg-slate-300/40 group-hover:opacity-100"
        }`}
      />

      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all overflow-hidden focus-within:border-sky-400 focus-within:bg-white/95 pb-1">
        <label
          htmlFor={name}
          className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
            isFocused || hasValue
              ? "top-2 text-[10px] font-bold text-sky-600 uppercase tracking-wider"
              : "top-4 text-sm font-medium text-slate-500"
          }`}>
          {label}
        </label>

        {type === "select" ? (
          <>
            <select
              id={name}
              name={name}
              className={`block w-full appearance-none bg-transparent px-4 pb-2 pt-7 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 ${
                !hasValue && !isFocused ? "text-transparent" : ""
              }`}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}>
              <option value="" disabled hidden></option>
              {options?.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <ChevronDown
                className={`h-4 w-4 transition-colors duration-300 ${
                  isFocused ? "text-sky-500" : "text-slate-400"
                }`}
              />
            </div>
          </>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            className="block w-full bg-transparent px-4 pb-2 pt-7 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0 placeholder:text-transparent focus:placeholder:text-slate-300"
            placeholder={type === "number" ? "0.00" : ""}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            step={type === "number" ? "any" : undefined}
          />
        )}
      </div>
    </div>
  );
}

export default function Analyze() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("patient");
  const [formData, setFormData] = useState({
    patientName: "",
    gender: "",
    age: "",
    smokingStatus: "",
    RASSF1A_pct: "",
    SEPT9_pct: "",
    APC_pct: "",
    SFRP1_pct: "",
    LINE1_pct: "",
    miR21_FC: "",
    miR34a_FC: "",
    miR155_FC: "",
    miR122_FC: "",
    EpiProxy: "",
    G: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        RASSF1A_pct: Number(formData.RASSF1A_pct || 0),
        SEPT9_pct: Number(formData.SEPT9_pct || 0),
        APC_pct: Number(formData.APC_pct || 0),
        SFRP1_pct: Number(formData.SFRP1_pct || 0),
        LINE1_pct: Number(formData.LINE1_pct || 0),
        miR21_FC: Number(formData.miR21_FC || 0),
        miR34a_FC: Number(formData.miR34a_FC || 0),
        miR155_FC: Number(formData.miR155_FC || 0),
        miR122_FC: Number(formData.miR122_FC || 0),
        EpiProxy: Number(formData.EpiProxy || 0),
        G: Number(formData.G || 0),
        age: Number(formData.age || 0),
        patient_name: formData.patientName?.trim() || undefined,
        gender: formData.gender || undefined,
        smoking_status: formData.smokingStatus || undefined,
      };

      const prediction = await predictPatient(payload);

      navigate("/reports", {
        state: {
          patientData: formData,
          prediction,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Prediction failed. Please try again.");
      setError(
        err?.response?.data?.detail || err.message || "Prediction failed",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["patient", "biomarkers", "mirna", "epi", "prediction"];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            if (section === "mirna" || section === "epi") {
              setActiveTab("biomarkers");
            } else {
              setActiveTab(section);
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progressSteps = [
    { id: "patient", label: "Patient Info", num: 1 },
    { id: "biomarkers", label: "Biomarkers", num: 2 },
    { id: "prediction", label: "Prediction", num: 3 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/80 to-teal-50/80 pt-8 pb-32">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[140px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-300/20 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-cyan-300/20 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* HERO HEADER */}
        <div className="text-center mb-12 space-y-4 pt-6">
          <div className="inline-flex items-center justify-center p-4 rounded-4xl bg-white/60 backdrop-blur-md border border-white/60 mb-4 shadow-xl shadow-sky-900/5">
            <BrainCircuit className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-sky-800 via-blue-700 to-teal-700">
            Patient Risk Analysis
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed font-medium">
            Upload patient biomarkers and get instant predictive insights
            powered by advanced epigenetic analysis.
          </p>
        </div>

        {/* PROGRESS FLOW */}
        <div className="hidden md:flex items-center justify-center mb-12 sticky top-6 z-50">
          <div className="flex items-center bg-white/70 backdrop-blur-xl border border-white/60 rounded-full px-6 py-3 shadow-xl shadow-slate-200/50">
            {progressSteps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-500 ${activeTab === step.id ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40 scale-110" : "bg-slate-200/80 text-slate-500"}`}>
                  {step.num}
                </div>
                <span
                  className={`ml-3 text-sm font-bold transition-colors duration-300 ${activeTab === step.id ? "text-sky-800" : "text-slate-500"}`}>
                  {step.label}
                </span>
                {i < progressSteps.length - 1 && (
                  <div className="w-16 h-0.5 mx-5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-sky-400 transition-all duration-700 ${progressSteps.findIndex((s) => s.id === activeTab) > i ? "w-full" : "w-0"}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.08)] relative overflow-hidden group/form">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/70 to-transparent pointer-events-none" />

          <form className="space-y-10 relative" onSubmit={handleAnalyze}>
            {/* Patient Information */}
            <SectionCard
              id="patient"
              title="Patient Information"
              icon={Stethoscope}
              accent="blue">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                />
                <Field
                  label="Gender"
                  name="gender"
                  type="select"
                  options={["Male", "Female", "Other"]}
                  value={formData.gender}
                  onChange={handleChange}
                />
                <Field
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
                <Field
                  label="Smoking Status"
                  name="smokingStatus"
                  type="select"
                  options={["Non-smoker", "Former Smoker", "Current Smoker"]}
                  value={formData.smokingStatus}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            {/* Tumor Methylation Biomarkers */}
            <SectionCard
              id="biomarkers"
              title="Tumor Methylation Biomarkers"
              icon={Dna}
              accent="purple">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="RASSF1A (%)"
                  name="RASSF1A_pct"
                  type="number"
                  value={formData.RASSF1A_pct}
                  onChange={handleChange}
                />
                <Field
                  label="SEPT9 (%)"
                  name="SEPT9_pct"
                  type="number"
                  value={formData.SEPT9_pct}
                  onChange={handleChange}
                />
                <Field
                  label="APC (%)"
                  name="APC_pct"
                  type="number"
                  value={formData.APC_pct}
                  onChange={handleChange}
                />
                <Field
                  label="SFRP1 (%)"
                  name="SFRP1_pct"
                  type="number"
                  value={formData.SFRP1_pct}
                  onChange={handleChange}
                />
                <Field
                  label="LINE1 (%)"
                  name="LINE1_pct"
                  type="number"
                  value={formData.LINE1_pct}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            {/* miRNA Expression Biomarkers */}
            <SectionCard
              id="mirna"
              title="miRNA Expression Biomarkers"
              icon={Microscope}
              accent="pink">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="miR-21 Fold Change"
                  name="miR21_FC"
                  type="number"
                  value={formData.miR21_FC}
                  onChange={handleChange}
                />
                <Field
                  label="miR-34a Fold Change"
                  name="miR34a_FC"
                  type="number"
                  value={formData.miR34a_FC}
                  onChange={handleChange}
                />
                <Field
                  label="miR-155 Fold Change"
                  name="miR155_FC"
                  type="number"
                  value={formData.miR155_FC}
                  onChange={handleChange}
                />
                <Field
                  label="miR-122 Fold Change"
                  name="miR122_FC"
                  type="number"
                  value={formData.miR122_FC}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            {/* Epigenetic Vulnerability Markers */}
            <SectionCard
              id="epi"
              title="Epigenetic Vulnerability Markers"
              icon={Activity}
              accent="teal">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Epigenetic Proxy (EpiProxy)"
                  name="EpiProxy"
                  type="number"
                  value={formData.EpiProxy}
                  onChange={handleChange}
                />
                <Field
                  label="Growth Factor (G)"
                  name="G"
                  type="number"
                  value={formData.G}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            {/* ERROR AND PREDICTION ACTON */}
            <SectionCard
              id="prediction"
              title="Analysis & Prediction"
              icon={PieChart}
              accent="yellow">
              <div className="flex flex-col gap-6 pt-2">
                {error && (
                  <div className="flex items-start gap-4 rounded-xl bg-red-50/90 p-5 text-red-600 border border-red-200 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">
                        Analysis Failed
                      </h3>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative sm:w-full w-xl cursor-pointer overflow-hidden rounded-2xl bg-linear-to-r from-amber-400 via-emerald-500 to-teal-500 p-0.5 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none">
                  <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-amber-400/90 via-emerald-500/90 to-teal-500/90 px-8 py-5 text-xl font-bold text-white transition-all group-hover:from-amber-400 group-hover:via-emerald-400 group-hover:to-teal-400">
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processing Biomarkers...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12" />
                        <span>Run Predictive Analysis</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </SectionCard>
          </form>
        </div>
      </div>
    </div>
  );
}
