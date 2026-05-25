import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Topbar({setSidebarOpen}) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };  

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/usuarios": "Usuários",
    "/publicadores": "Publicadores",
    "/territorios": "Territórios",
    "/admin": "Painel Administrativo",
  };

  const titulo = pageTitles[location.pathname] || "Sistema";

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b flex items-center justify-between px-4 gap-2 md:px-6 shadow-sm transition ">
      
      {/* 🔥 ESQUERDA */}
      <div className="flex items-center gap-3">
        {/* BOTÃO MOBILE */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Título */}
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          {titulo}
        </h3>
      </div>    

      {/* 🔥 DIREITA */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Botão Dark Mode */}
        <button
          onClick={() => setDark(prev => !prev)}
          className="px-2 md:px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded text-sm"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Usuário */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Olá,
          </span>
          <span className="font-medium dark:text-white">
           👤 {user?.email || " Admin"}
          </span>
        </div>
        
        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 rounded transition"
        >
          Sair
        </button>

      </div>
    </div>
  );
}