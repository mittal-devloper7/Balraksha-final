import { createContext, useEffect, useMemo, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  me,
} from "../services/authService";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("balraksha_user") || "null"),
  );
  const [token, setToken] = useState(() =>
    localStorage.getItem("balraksha_token"),
  );
  const [loading, setLoading] = useState(Boolean(token));
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    me()
      .then((r) => {
        setUser(r.data.user);
        localStorage.setItem("balraksha_user", JSON.stringify(r.data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]);
  const save = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("balraksha_token", data.token);
    localStorage.setItem("balraksha_user", JSON.stringify(data.user));
  };
  const login = async (p) => {
    const r = await loginApi(p);
    save(r.data);
    return r.data.user;
  };
  const register = async (p) => {
    const r = await registerApi(p);
    save(r.data);
    return r.data.user;
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("balraksha_token");
    localStorage.removeItem("balraksha_user");
  };
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
