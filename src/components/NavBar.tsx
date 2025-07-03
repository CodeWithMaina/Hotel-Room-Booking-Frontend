import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";
import type { RootState } from "../app/store";
import { LayoutDashboard, LogOut, User } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { isAuthenticated, userType, firstName } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-menu") && !target.closest(".hamburger-menu")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout functionalities
  const handleLogOut = async () => {
    await dispatch(clearCredentials());
    navigate("/login");
  };

  //   // Navigation
  const navlinks = ["Home", "Hotels", "Rooms", "About", "Contact"];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300",
        scrolled ? "shadow-md bg-white" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-blue-600">Lux</span>
          <span className="text-gray-900">Hotel.</span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navlinks.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-800 hover:text-blue-600 transition-all duration-200"
            >
              {item}
            </Link>
          ))}
          {isAuthenticated ? (
            // dropdown button for authenticated users
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-black font-medium rounded-lg hover:from-blue-300 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-blue-400/25"
              >
                <User className="w-4 h-4" />
                <span>{firstName || "Profile"}</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-xl border border-yellow-400/20 shadow-2xl">
                  <div className="py-2">
                    {userType === "user" ? (
                      <Link
                        to="/user/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    ) : (
                      userType === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      )
                    )}

                    <button
                      onClick={handleLogOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm rounded-lg px-6 shadow-md hover:scale-105 transition-transform duration-200"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="hamburger-menu md:hidden text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Dropdown */}
        <div
          ref={menuRef}
          className={cn(
            "nav-menu absolute top-full right-4 mt-2 w-48 rounded-lg bg-white shadow-md p-4 space-y-3 transition-all duration-300 z-50",
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {navlinks.map((item) => (
            <Link
              key={item}
              to={item == "Home" ? "/" : `/${item.toLowerCase()}`}
              className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}

          {/* For authenticated users */}
          {isAuthenticated ? (
            <div>
              {userType === "user" ? (
                <Link
                  to="/user/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                userType === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )
              )}

              <Link
                to="/login"
                className="btn btn-error btn-sm w-full mt-2"
                onClick={() => handleLogOut}
              >
                LogOut
              </Link>
            </div>
          ) : (
            // For unauthorised users
            <Link
              to="/login"
              className="btn btn-primary btn-sm w-full mt-2"
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
