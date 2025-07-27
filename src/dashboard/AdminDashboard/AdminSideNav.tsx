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
  Home,
  CardSim,
  House,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import { useGetUserByIdQuery } from "../../features/api/usersApi";
import { UserProfileButton } from "../../components/profile/UserProfileButton";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { id: "analytics", label: "Analytics", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "rooms", label: "Rooms", icon: House },
  { id: "payments", label: "Payments", icon: CardSim },
  { id: "ticket", label: "Customer Support", icon: MessageSquare },
  {
    id: "utils",
    label: "Manage Utils",
    icon: ClipboardList,
    children: [
      { id: "amenities", label: "Amenities" },
      { id: "roomtypes", label: "Room Types" },
    ],
  },
];

const AdminSideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const { data: userData, isLoading, isError, error } = useGetUserByIdQuery(id);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user data. Please try again.");
      console.error("User data error:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLogOut = () => {
    toast.custom((t) => (
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col space-y-4 w-[340px] transition-all duration-300 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Confirm Logout
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to logout? You'll need to sign in again to access your account.
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch(clearCredentials());
              toast.dismiss(t.id);
              toast.success("Logged out successfully.");
              navigate("/login");
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-700/50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:flex
          ${collapsed ? "w-20" : "w-72"}`}
      >
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold tracking-tight group">
                <span className="text-blue-400 group-hover:text-blue-300 transition-colors duration-200">Stay</span>
                <span className="text-white group-hover:text-gray-200 transition-colors duration-200">Cloud</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navLinks.map(({ id, label, icon: Icon, children }) => {
              const isActive =
                current === id ||
                children?.some((child) => current === child.id);
              const isDropdownOpen = openDropdown === id;

              return (
                <div key={id} className="relative group">
                  <button
                    onClick={() => {
                      if (children) {
                        setOpenDropdown((prev) => (prev === id ? null : id));
                      } else {
                        navigate(`/admin/${id}`);
                        onClose();
                      }
                    }}
                    className={`group/button flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25 text-white"
                        : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                    } ${collapsed ? "justify-center" : "justify-start gap-3"}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover/button:text-blue-400 group-hover/button:scale-110"
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{label}</span>
                        {children && (
                          <ChevronRight
                            className={`w-4 h-4 transform transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-90" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Tooltip for collapsed view */}
                  {collapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-600">
                      {label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                    </div>
                  )}

                  {/* Dropdown menu */}
                  {children && isDropdownOpen && !collapsed && (
                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-600 pl-4">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            navigate(`/admin/${child.id}`);
                            onClose();
                          }}
                          className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                            current === child.id 
                              ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-400" 
                              : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Section: Home + Profile + Logout */}
          <div className="p-4 border-t border-slate-700/50 space-y-2">
            {/* Home Button */}
            <button
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className={`group/home flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                ${
                  pathname === "/"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-600/25 text-white"
                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                }
                ${collapsed ? "justify-center" : "justify-start gap-3"}`}
            >
              <Home
                className={`w-5 h-5 transition-all duration-200 ${
                  pathname === "/"
                    ? "text-white"
                    : "text-slate-400 group-hover/home:text-emerald-400 group-hover/home:scale-110"
                }`}
              />
              {!collapsed && <span>Home</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-600">
                  Home
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                </div>
              )}
            </button>

            {/* Profile */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                {!collapsed && <span className="ml-3 text-sm text-slate-400">Loading profile...</span>}
              </div>
            ) : !isError && userData ? (
              <UserProfileButton collapsed={collapsed} />
            ) : (
              <div className="flex items-center justify-center py-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
                {!collapsed && "Failed to load profile"}
                {collapsed && "!"}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogOut}
              className={`group/logout flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 ${
                collapsed ? "justify-center" : "justify-start gap-3"
              }`}
            >
              <LogOut className="w-5 h-5 group-hover/logout:scale-110 transition-transform duration-200" />
              {!collapsed && <span>Logout</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-red-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-red-600">
                  Logout
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-red-800 border-l border-b border-red-600 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style>
          {`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #475569 transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #475569;
              border-radius: 9999px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #64748b;
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default AdminSideNav;