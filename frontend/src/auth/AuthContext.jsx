import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loginUser as apiLogin, registerUser as apiRegister } from "../services/api";

const STORAGE_KEY = "epichronos_auth";

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const { user, token } = JSON.parse(raw);
    return { user: user || null, token: token || null };
  } catch {
    return { user: null, token: null };
  }
}

function setStoredAuth(user, token) {
  if (!token) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    const user = data.user ?? { email };
    const token = data.token ?? data.accessToken ?? data.access_token;
    if (!token) throw new Error("No token in response");
    setStoredAuth(user, token);
    setAuth({ user, token });
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    const user = data.user ?? { name, email };
    const token = data.token ?? data.accessToken ?? data.access_token;
    if (!token) throw new Error("No token in response");
    setStoredAuth(user, token);
    setAuth({ user, token });
    return data;
  }, []);

  const logout = useCallback(() => {
    setStoredAuth(null, null);
    setAuth({ user: null, token: null });
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      register,
    }),
    [auth.user, auth.token, login, logout, register]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
