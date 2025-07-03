import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
  X,
  Home,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  // { id: "users", label: "Users", icon: Users },
  // { id: "hotel-owners", label: "Hotel Owners", icon: ClipboardList },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  // { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "tickets", label: "Customer Support", icon: MessageSquare },
  // { id: "help", label: "Help", icon: LifeBuoy },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "home", label: "Home", icon: Home },

];

const UserSideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];

  // Close on escape key (mobile)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600">LankaStay.</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 text-gray-700">
            {links.map(({ id, label, icon: Icon }) => {
              const isActive = current === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    navigate(id === "home" ? "/" :`/user/${id}`);
                    onClose();
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default UserSideNav;
