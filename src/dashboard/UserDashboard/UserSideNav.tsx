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
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

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
        className={`fixed top-0 left-0 h-full z-40 bg-[#03071e] text-white shadow-xl transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:flex
        ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col w-full h-full p-4">
          {/* Logo + Collapse */}
          <div className="flex items-center justify-between mb-8">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold tracking-tight">
                <span className="text-[#fca311]">Lux</span>
                <span className="text-white">Hotel</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex text-white hover:text-[#fca311] transition-colors"
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-[#fca311]"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto custom-scrollbar">
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
                  className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#14213d] text-white shadow-inner"
                      : "hover:bg-[#1a1a1a] text-[#e5e5e5] hover:text-[#fca311]"
                  }
                  ${collapsed ? "justify-center" : "justify-start gap-3"}`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? "text-[#fca311]"
                        : "text-[#fca311] group-hover:scale-110"
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer - Profile */}
          <div className="mt-auto pt-6 border-t border-[#1a1a1a]">
            <div
              className={`flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition-colors ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => navigate("/user/profile")}
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#fca311]"
              />
              {!collapsed && (
                <div className="text-left">
                  <h2 className="text-base font-semibold text-white">
                    {firstName}
                  </h2>
                  <p className="text-sm text-[#fca311]">View Profile</p>
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
              background: #fca311;
              border-radius: 9999px;
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default UserSideNav;
