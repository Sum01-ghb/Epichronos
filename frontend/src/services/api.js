import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

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

export async function loginUser(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function predictPatient(payload) {
  const { data } = await api.post("/predict", payload);
  return data;
}

export async function getPatientHistory() {
  const { data } = await api.get("/patients/history");
  return data;
}

export async function getPatientReport(reportId) {
  const { data } = await api.get(`/patients/report/${reportId}`);
  return data;
}

export default api;
