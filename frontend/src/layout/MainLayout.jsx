import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 bg-slate-100 dark:bg-slate-900 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}