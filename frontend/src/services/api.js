import axios from "axios";

// Point to FastAPI backend. Set VITE_API_URL in .env to override (e.g. in production).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to requests so /predict and /patients/* receive the authenticated user
const AUTH_STORAGE_KEY = "epichronos_auth";
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

/**
 * Login user. Expects backend: POST /auth/login
 * Body: { email, password }
 * Returns: { token, user } or similar
 */
export async function loginUser(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

/**
 * Register user. Expects backend: POST /auth/register
 * Body: { name, email, password }
 * Returns: { token, user } or similar
 */
export async function registerUser(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

/**
 * Predict patient risk. Expects backend: POST /predict (requires auth).
 * Body: biomarker + age + optional patient_name, gender
 * Returns: { risk_score, risk_level, biomarker_contribution, top_biomarkers, epigenetic_age }
 */
export async function predictPatient(payload) {
  const { data } = await api.post("/predict", payload);
  return data;
}

/**
 * Get current user's patient report history. Requires auth.
 * Returns: [{ id, patient_name, age, gender, risk_level, analysis_date }, ...]
 */
export async function getPatientHistory() {
  const { data } = await api.get("/patients/history");
  return data;
}

/**
 * Get full report by id. Requires auth; only returns report if it belongs to the user.
 * Returns: { id, patient_name, age, gender, risk_score, risk_level, analysis_date, report_data }
 */
export async function getPatientReport(reportId) {
  const { data } = await api.get(`/patients/report/${reportId}`);
  return data;
}

export default api;
