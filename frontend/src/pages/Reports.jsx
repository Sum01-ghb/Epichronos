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

const fallbackRiskScore = 72;

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
      className={`relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl`}>
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClasses}`}
      />
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          {Icon && (
            <div className={`p-2.5 rounded-xl ${iconColors}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoTile({ label, value, icon: Icon, accent }) {
  // ✅ FIXED LOGIC HERE
  const isNan = value === "NaN" || value === null || value === undefined;

  const displayValue = isNan ? "NaN" : value;

  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow">
      <Icon className="w-6 h-6 text-gray-500" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`font-bold ${isNan ? "text-gray-400 italic" : ""}`}>
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
    setIsLoaded(true);
  }, []);

  if (!prediction) {
    return <div>No Analysis Available</div>;
  }

  // ✅ FIXED DATA HANDLING HERE
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

  const riskScorePercent = Math.round((prediction.risk_score || 0) * 100);

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

  const riskColor =
    effectiveRiskCategory === "Low"
      ? "#10b981"
      : effectiveRiskCategory === "Moderate"
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Risk Report</h1>

      <div className="grid grid-cols-2 gap-4">
        <InfoTile
          icon={User}
          label="Patient Name"
          value={effectivePatient.name}
        />
        <InfoTile
          icon={Calendar}
          label="Age"
          value={
            effectivePatient.age === "NaN"
              ? "NaN"
              : `${effectivePatient.age} years`
          }
        />
        <InfoTile icon={Dna} label="Gender" value={effectivePatient.gender} />
        <InfoTile
          icon={Flame}
          label="Smoking Status"
          value={effectivePatient.smokingStatus}
        />
      </div>

      <SectionCard title="Risk Score" icon={Activity}>
        <p style={{ color: riskColor }} className="text-xl font-bold">
          {riskScorePercent} / 100 ({effectiveRiskCategory})
        </p>
      </SectionCard>

      <SectionCard title="Chart">
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? riskColor : "#eee"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
