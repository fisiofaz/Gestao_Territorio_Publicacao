import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h3 className="font-semibold text-lg">Dashboard</h3>

      <button
        onClick={() => setDark(prev => !prev)}
        className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="flex items-center gap-3">
         <span className="text-sm text-gray-600">Olá,</span>
        <span className="font-medium">👤 Admin</span>        
      </div>
    </div>
  );
}