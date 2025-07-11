import {
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquare,
  LogOut,
  X,
  Hotel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "ticket", label: "Customer Support", icon: MessageSquare },
];

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];
  const [collapsed, setCollapsed] = useState(false);

  const {firstName} = useSelector((state: RootState)=> state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLogOut = () => {
    dispatch(clearCredentials());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

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
          lg:translate-x-0 lg:static
          ${collapsed ? "w-20" : "w-64"} transition-all`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold transition-all">
                <span className="text-blue-600">Lanka</span>
                <span className="text-gray-900">Stay.</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex text-gray-500 hover:text-blue-600 transition"
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
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
              const isActive = current === id;
              return (
                <div key={id} className="relative group">
                  <button
                    onClick={() => {
                      navigate(`/admin/${id}`);
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
                    <span
                      className={`transition-all duration-200 ${
                        collapsed
                          ? "opacity-0 scale-95 hidden"
                          : "opacity-100 scale-100 block"
                      }`}
                    >
                      {label}
                    </span>
                  </button>

                  {/* Tooltip on collapsed hover */}
                  {collapsed && (
                    <span className="absolute left-full top-2 ml-2 w-max whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer: Profile and Logout */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {/* Profile Button */}
            <div
              className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-blue-50 ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={() => {
                toast.success("Opening Profile...");
                navigate("/admin/profile");
              }}
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
              {!collapsed && (
                <div>
                  <p className="font-semibold text-gray-900">{firstName}</p>
                  <p className="text-sm text-blue-600">View Profile</p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => handleLogOut}
              className={`group flex items-center w-full px-3 py-2 rounded-lg mt-2 text-red-600 hover:bg-red-100 transition ${
                collapsed ? "justify-center" : "justify-start gap-3"
              }`}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition" />
              {!collapsed && <span className="font-semibold">Logout</span>}
              {collapsed && (
                <span className="absolute left-full top-2 ml-2 w-max whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                  Logout
                </span>
              )}
            </button>
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

export default SideNav;