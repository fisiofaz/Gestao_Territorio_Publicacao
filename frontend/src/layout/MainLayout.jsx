import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SidebarMobile from "../components/SidebarMobile";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE */}
      <SidebarMobile open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">

        <Topbar setSidebarOpen={setSidebarOpen} />

        <main className="p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-slate-900">
          <Outlet />
        </main>

      </div>
    </div>
  );
}