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
  const { firstName } = useSelector((state: RootState) => state.auth);
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
        className={`fixed top-0 left-0 h-full z-40 transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          ${collapsed ? "w-20" : "w-64"}
          bg-[#03071e] text-white shadow-xl`}
      >
        <div className="flex flex-col justify-between h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold tracking-wide">
                <span className="text-yellow-500">Lanka</span>
                <span className="text-white">Stay</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex text-slate-400 hover:text-yellow-500 transition"
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-yellow-500"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Centered Navigation */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="space-y-2 w-full">
              {links.map(({ id, label, icon: Icon }) => {
                const isActive = current === id;
                return (
                  <div key={id} className="relative group">
                    <button
                      onClick={() => {
                        navigate(`/admin/${id}`);
                        onClose();
                      }}
                      className={`group flex items-center w-full px-3 py-2 rounded-xl font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-yellow-500 text-[#03071e] shadow-lg"
                            : "hover:bg-[#1a1a2e] text-slate-300"
                        }
                        ${collapsed ? "justify-center" : "justify-start gap-3"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-[#03071e]"
                            : "text-yellow-400 group-hover:scale-110"
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
                      <span className="absolute left-full top-2 ml-2 w-max whitespace-nowrap bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer: Profile and Logout */}
          <div className="pt-4 border-t border-slate-800">
            {/* Profile */}
            <div
              className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a2e] ${
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
                className="w-10 h-10 rounded-full border-2 border-yellow-500"
              />
              {!collapsed && (
                <div>
                  <p className="font-semibold text-white">{firstName}</p>
                  <p className="text-sm text-yellow-400">View Profile</p>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogOut}
              className={`group flex items-center w-full px-3 py-2 rounded-lg mt-3 text-red-400 hover:bg-red-800/20 hover:text-red-200 transition ${
                collapsed ? "justify-center" : "justify-start gap-3"
              }`}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition" />
              {!collapsed && <span className="font-semibold">Logout</span>}
              {collapsed && (
                <span className="absolute left-full top-2 ml-2 w-max whitespace-nowrap bg-red-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
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
              background: #64748b;
              border-radius: 9999px;
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default SideNav;
