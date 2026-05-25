import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  X
} from "lucide-react";

export default function SidebarMobile({ open, setOpen }) {
  const navigate = useNavigate();
   const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

   const menu = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Publicadores",
      icon: BookOpen,
      path: "/publicadores",
    },
    {
      label: "Territórios",
      icon: Map,
      path: "/territorios",
    },
    {
      label: "Usuários",
      icon: Users,
      path: "/usuarios",
    },
  ];

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-lg z-50 p-4 animate-slide-in">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                Menu
            </h2>

          <button onClick={() => setOpen(false)} className=" dark:text-white">
            <X />
          </button>
        </div>

        {/* MENU */}
        <div className="space-y-4">

          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  
                  ${isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </button>
             );
          })}
        </div>
      </div>
    </>
  );
}