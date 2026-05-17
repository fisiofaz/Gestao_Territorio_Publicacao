import { useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);



  return (

    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-slate-100 dark:bg-slate-900">
          <Topbar />

          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}