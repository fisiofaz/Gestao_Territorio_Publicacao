import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { email: "logado" } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);

    api.defaults.headers.Authorization = `Bearer ${data.token}`;

    setUser({
      email: data.email,
      role: data.role,
    });
  }

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}