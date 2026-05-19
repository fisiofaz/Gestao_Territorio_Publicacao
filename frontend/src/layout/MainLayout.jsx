import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
        <Topbar />

        <div className="p-6 text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}