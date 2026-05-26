import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔐 REQUEST → envia token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 RESPONSE → trata erros globais (403, 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status;

    if (status === 401) {
      console.warn("Sessão expirada!");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Acesso negado!");
    }

    return Promise.reject(error);
  }
);