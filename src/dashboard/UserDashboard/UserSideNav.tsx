import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "tickets", label: "Customer Support", icon: MessageSquare },
  { id: "home", label: "Home", icon: Home },
];

const UserSideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];
  const [collapsed, setCollapsed] = useState(false);
  const { firstName } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:flex
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col w-full h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold">
                <span className="text-blue-600">Lux</span>
                <span className="text-gray-900">Hotel.</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              {/* Collapse Toggle */}
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex text-gray-500 hover:text-blue-600"
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>

              {/* Close Button for Mobile */}
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-black"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {links.map(({ id, label, icon: Icon }) => {
              const isActive =
                current === id || (id === "home" && pathname === "/");
              return (
                <button
                  key={id}
                  onClick={() => {
                    navigate(id === "home" ? "/" : `/user/${id}`);
                    onClose();
                  }}
                  className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow"
                        : "hover:bg-blue-50 text-gray-700"
                    }
                    ${collapsed ? "justify-center" : "justify-start gap-3"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-white"
                        : "text-blue-600 group-hover:scale-110"
                    } transition-transform`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-semibold">{label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer - Profile & Settings */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div
              className={`flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => navigate("/user/settings")}
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
              />
              {!collapsed && (
                <div>
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-gray-900">
                      {firstName}
                    </h2>
                    <p className="text-sm text-blue-600 capitalize">
                      View Profile
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Scrollbar */}
        <style>
          {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
          }
        `}
        </style>
      </aside>
    </>
  );
};

export default UserSideNav;
