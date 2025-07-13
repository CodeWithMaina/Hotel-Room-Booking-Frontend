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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "ticket", label: "Customer Support", icon: MessageSquare },
];

const AdminSideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id);

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
      className={`bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 flex flex-col space-y-3 w-[300px] transition-all ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Are you sure you want to logout?
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
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
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  ));
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
        className={`fixed top-0 left-0 h-full z-40 bg-[#03071e] text-white shadow-xl transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:flex
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col w-full h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            {!collapsed && (
              <Link to="/" className="text-2xl font-bold tracking-tight">
                <span className="text-yellow-500">Lanka</span>
                <span className="text-white">Stay</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex text-white hover:text-yellow-500 transition-colors"
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

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto custom-scrollbar">
            {navLinks.map(({ id, label, icon: Icon }) => {
              const isActive = current === id;

              return (
                <div key={id} className="relative group w-full">
                  <button
                    onClick={() => {
                      navigate(`/admin/${id}`);
                      onClose();
                    }}
                    className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300
                      ${
                        isActive
                          ? "bg-[#fca311]/90 shadow-inner text-[#03071e]"
                          : "hover:bg-[#1a1a1a] text-[#e5e5e5]"
                      }
                      ${collapsed ? "justify-center" : "justify-start gap-3"}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive
                          ? "text-[#03071e]"
                          : "text-yellow-400 group-hover:scale-110"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium">{label}</span>
                    )}
                  </button>

                  {/* Tooltip */}
                  {collapsed && (
                    <span className="absolute left-full top-2 ml-2 w-max whitespace-nowrap bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Section: Home + Profile + Logout */}
          <div className="mt-auto pt-6 border-t border-[#1a1a1a] space-y-2">
            {/* Home Button */}
            <button
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300
                ${
                  pathname === "/"
                    ? "bg-[#14213d] shadow-inner"
                    : "hover:bg-[#1a1a1a]"
                }
                ${collapsed ? "justify-center" : "justify-start gap-3"}`}
            >
              <Home
                className={`w-5 h-5 transition-transform duration-200 ${
                  pathname === "/"
                    ? "text-[#fca311]"
                    : "text-[#fca311] group-hover:scale-110"
                }`}
              />
              {!collapsed && (
                <span className="text-sm font-medium text-white">Home</span>
              )}
            </button>

            {/* Profile */}
            {isLoading ? (
              <div className="flex items-center justify-center py-2 text-sm text-gray-400">
                Loading profile...
              </div>
            ) : !isError && userData ? (
              <UserProfileButton
                firstName={userData.firstName}
                lastName={userData.lastName}
                avatarUrl={userData.profileImage}
                collapsed={collapsed}
              />
            ) : (
              <div className="flex items-center justify-center py-2 text-sm text-red-400">
                Failed to load profile
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogOut}
              className={`group flex items-center w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-800/20 hover:text-red-200 transition ${
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

export default AdminSideNav;
