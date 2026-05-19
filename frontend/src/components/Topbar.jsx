import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between px-6 shadow-sm transition-colors">

      {/* Título */}
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
        Dashboard
      </h3>

      {/* Ações */}
      <div className="flex items-center gap-4">

        {/* Botão Dark Mode */}
        <button
          onClick={() => setDark(prev => !prev)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100 hover:scale-105 transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Usuário */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Olá,
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-100">
            👤 Admin
          </span>
        </div>

      </div>
    </div>
  );
}