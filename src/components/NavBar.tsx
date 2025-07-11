import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import type { RootState } from "../app/store";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, userType, firstName } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = async () => {
    await dispatch(clearCredentials());
    navigate("/login");
  };

  const navlinks = ["Home", "Hotels", "Rooms", "About", "Contact"];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#03071e] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#fca311]">Lux</span>
          <span className="text-white">Hotel</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center relative">
          {navlinks.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = currentPath === path;

            return (
              <Link
                key={item}
                to={path}
                className={`group relative text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                  isActive
                    ? "text-[#fca311]"
                    : "text-[#e5e5e5] hover:text-[#fca311]"
                }`}
              >
                {item}
                {/* Animated underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#fca311] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${
                    isActive ? "scale-x-100" : ""
                  }`}
                ></span>
              </Link>
            );
          })}

          {/* Authenticated user */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() =>
                  setIsProfileDropdownOpen(!isProfileDropdownOpen)
                }
                className="flex items-center gap-2 px-4 py-2 bg-[#fca311] text-[#03071e] font-medium rounded-lg hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>{firstName || "Profile"}</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#14213d] text-white rounded-xl shadow-2xl overflow-hidden border border-[#fca311]/30 animate-fadeIn">
                  <div className="py-2">
                    <Link
                      to={
                        userType === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                      }
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#fca311]/10 hover:text-[#fca311] transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-[#fca311] text-black rounded-lg font-medium hover:scale-105 transition-transform shadow-lg"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#fca311] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`absolute top-full right-4 mt-3 w-56 bg-[#03071e] text-white rounded-lg shadow-lg p-4 space-y-3 z-50 transform transition-all duration-300 origin-top-right ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {navlinks.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = currentPath === path;

            return (
              <Link
                key={item}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium px-2 py-1 rounded-md transition-all ${
                  isActive
                    ? "text-[#fca311] underline underline-offset-4"
                    : "text-[#e5e5e5] hover:text-[#fca311]"
                }`}
              >
                {item}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              <Link
                to={
                  userType === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#fca311]/10 hover:text-[#fca311]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full block text-center py-2 bg-[#fca311] text-[#03071e] rounded-md font-medium hover:scale-105 transition-transform"
              onClick={() => setIsOpen(false)}
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
