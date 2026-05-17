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
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
      <h2 className="text-xl font-bold mb-8">Congregação <br /> Tropical</h2>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}