import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 🔥 seta token
        api.defaults.headers.Authorization = `Bearer ${token}`;

        // 🔥 valida no backend
        const res = await api.get("/auth/me");

        const userData = {
          email: res.data.email,
          role: res.data.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

      } catch (error) {
        console.warn("Token inválido", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, []);

  const login = (data) => {
    const userData = {
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    api.defaults.headers.Authorization = `Bearer ${data.token}`;

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.Authorization;

    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}