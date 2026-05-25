import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  Package,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    ...(user?.role === "ADMIN"
      ? [{ name: "Admin", icon: LayoutDashboard, path: "/admin" }]
      : []),
    
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Usuários", icon: Users, path: "/usuarios" },
    { name: "Publicadores", icon: Users, path: "/publicadores" },
    { name: "Territórios", icon: Map, path: "/territorios" },
    { name: "Publicações", icon: BookOpen, path: "/publicacoes" },
    { name: "Pedidos", icon: Package, path: "/pedidos" },
  ];

  return (
    <div
      className={`hidden md:flex flex-col h-screen bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-3 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Congregação
            </h2>
            <span className="text-xs text-gray-500">Tropical</span>
          </div>
        )}

         <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group relative flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-3 py-2 rounded-lg text-sm transition-all
              
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }
              `}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.name}</span>}

              {/* TOOLTIP */}
              {collapsed && (
                <span className="absolute left-full ml-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      {!collapsed && (
        <div className="mt-auto pt-6 text-xs text-gray-400">
          v1.0 Sistema
        </div>
      )}

    </div>
  );
}
