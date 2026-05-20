import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
   
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

   useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
 

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);

      login(res.data.token);

      toast.success("Login realizado!");
      navigate("/dashboard");

    } catch {
      toast.error("Credenciais inválidas");
    }
    
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow w-[350px]">

        <h1 className="text-xl font-bold mb-4 text-center">
          Login
        </h1>

        <div className="space-y-3">
          <input
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, senha: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded"
        >
          Entrar
        </button>

      </div>
    </div>
  );
}