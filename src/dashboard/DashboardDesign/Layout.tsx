import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSideNav from "../AdminDashboard/AdminSideNav";
import { Login } from "../../pages/Login";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import UserSideNav from "../UserDashboard/UserSideNav";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {userType} = useSelector((state:RootState)=> state.auth)
  const renderSideNav = () => {
    switch (userType) {
      case "admin":
        return <AdminSideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
      case "user":
        return <UserSideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>;
      default:
        return <Login/>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-gray-700 relative">
      {renderSideNav()}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
