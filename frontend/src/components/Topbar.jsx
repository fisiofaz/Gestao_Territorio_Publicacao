import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Topbar() {
  const { dark, setDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b flex items-center justify-between px-6 shadow-sm transition">

      {/* Título */}
      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
        Dashboard
      </h3>

      {/* Ações */}
      <div className="flex items-center gap-4">

        {/* Botão Dark Mode */}
        <button
          onClick={() => setDark(prev => !prev)}
          className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Usuário */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Olá,
          </span>
          <span className="font-medium dark:text-white">
            👤 Admin
          </span>
        </div>
        
        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
        >
          Sair
        </button>

      </div>
    </div>
  );
}