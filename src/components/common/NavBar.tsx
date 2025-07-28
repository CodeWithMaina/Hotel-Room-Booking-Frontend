
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, LogOut, Bell, Menu, X } from "lucide-react";
import { clearCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import { cn } from "../../lib/utils";
import { useGetUserByIdQuery } from "../../features/api";
import { Avatar } from "../ui/Avatar";
import type { AppDispatch } from "../../app/store";

const NAV_LINKS = ["Home", "Hotels", "Rooms", "About", "Contact"];

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, userId, userType } = useSelector(
    (state: RootState) => state.auth
  );

  const id = Number(userId);
  const { data: user } = useGetUserByIdQuery(id, {
    skip: !userId,
  });

  const unreadNotifications: number = 3;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (!notifRef.current?.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 animate-fade-down",
        scrolled
          ? "bg-base-100 shadow-sm border-b border-border text-base-content"
          : "bg-transparent text-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
          <span className="text-primary">Stay</span>Cloud
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = pathname === path;
            return (
              <Link
                key={item}
                to={path}
                className={cn(
                  "group relative text-sm font-medium px-2 py-1",
                  isActive ? "text-primary" : "text-muted hover:text-primary"
                )}
              >
                {item}
                <span
                  className={cn(
                    "absolute left-0 -bottom-1 h-[2px] w-full bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform",
                    isActive && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}

          {isAuthenticated && (
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-base-200 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 text-base-content rounded-xl shadow-xl border animate-fade-in">
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-primary">
                      Notifications
                    </h4>
                    <ul className="text-sm text-muted space-y-1">
                      <li>🔔 You have 3 new alerts</li>
                      <li>📅 Booking reminder for 20th Aug</li>
                      <li>🎁 Loyalty bonus unlocked</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
              >
                <Avatar
                  src={user?.profileImage ?? undefined}
                  fallback={
                    user?.firstName && user?.lastName
                      ? user.firstName[0] + user.lastName[0]
                      : "U"
                  }
                  size="sm"
                />
                <span>{user?.firstName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 text-base-content rounded-xl shadow-xl border border-border animate-fade-in overflow-hidden">
                  {/* Actions */}
                  <div className="py-2">
                    <Link
                      to={
                        userType === "admin"
                          ? "/admin/analytics"
                          : "/user/analytics"
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-primary focus:outline-none"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-base-100 shadow-xl z-50 transition-transform duration-300 transform",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-lg font-semibold text-primary">Menu</span>
          <button onClick={() => setDrawerOpen(false)}>
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {NAV_LINKS.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={item}
                to={path}
                onClick={() => setDrawerOpen(false)}
                className="block text-sm font-medium px-2 py-2 rounded hover:bg-base-200"
              >
                {item}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              <Link
                to={
                  userType === "admin" ? "/admin/analytics" : "/user/analytics"
                }
                onClick={() => setDrawerOpen(false)}
                className="block px-2 py-2 hover:bg-base-200"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
                className="block text-red-500 px-2 py-2 hover:bg-red-500/10 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-center py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
