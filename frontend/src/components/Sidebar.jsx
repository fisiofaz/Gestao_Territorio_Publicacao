import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  Package
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Publicadores", icon: <Users size={18} />, path: "/publicadores" },
    { name: "Territórios", icon: <Map size={18} />, path: "/territorios" },
    { name: "Publicações", icon: <BookOpen size={18} />, path: "/publicacoes" },
    { name: "Pedidos", icon: <Package size={18} />, path: "/pedidos" },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-5 transition-colors">

      <h2 className="text-xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Congregação <br /> Tropical
      </h2>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 p-2 rounded transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}