import React, { useState } from "react";
import { User, ChevronRight, Settings } from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileFooterProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  collapsed?: boolean;
  status?: "online" | "away" | "busy" | "offline";
  role?: string;
}

export const UserProfileButton: React.FC<ProfileFooterProps> = ({
  firstName = "John",
  lastName = "Doe",
  avatarUrl = "https://i.pravatar.cc/100",
  collapsed = false,
  status = "online",
  role = "Developer"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/user/profile")
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-400";
      case "away": return "bg-yellow-400";
      case "busy": return "bg-red-400";
      default: return "bg-gray-400";
    }
  };

  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="mt-auto">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />
      
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group cursor-pointer p-3 rounded-2xl transition-all duration-300 ease-out
          ${collapsed ? 'mx-2' : 'mx-3'}
          ${isHovered 
            ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 shadow-lg shadow-orange-500/10' 
            : 'hover:bg-gray-800/50'
          }
          border border-gray-700/50 hover:border-orange-500/30
          backdrop-blur-sm
        `}
      >
        {/* Background glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r from-orange-500/10 to-amber-500/10 blur-xl -z-10
        `} />

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'}`}>
          {/* Avatar container with status indicator */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${firstName} ${lastName}`}
                className={`
                  ${collapsed ? 'w-10 h-10' : 'w-12 h-12'} 
                  rounded-full object-cover border-2 border-orange-400/60
                  transition-all duration-300 group-hover:border-orange-400 group-hover:scale-105
                  shadow-md group-hover:shadow-orange-500/20
                `}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            
            {/* Fallback initials avatar */}
            <div className={`
              ${avatarUrl ? 'hidden' : 'flex'}
              ${collapsed ? 'w-10 h-10' : 'w-12 h-12'} 
              rounded-full bg-gradient-to-br from-orange-500 to-amber-600
              items-center justify-center text-white font-bold text-sm
              border-2 border-orange-400/60 transition-all duration-300 
              group-hover:border-orange-400 group-hover:scale-105
              shadow-md group-hover:shadow-orange-500/20
            `}>
              {getInitials()}
            </div>

            {/* Status indicator */}
            <div className={`
              absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-900
              ${getStatusColor(status)} transition-all duration-300 group-hover:scale-110
            `}>
              <div className={`
                absolute inset-0.5 rounded-full ${getStatusColor(status)} opacity-60 
                animate-pulse group-hover:animate-none
              `} />
            </div>
          </div>

          {/* User info - only shown when not collapsed */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight truncate group-hover:text-orange-200 transition-colors">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-gray-400 text-xs leading-tight truncate group-hover:text-orange-300 transition-colors">
                    {role}
                  </p>
                </div>
                
                {/* Action indicator */}
                <ChevronRight 
                  className={`
                    w-4 h-4 text-gray-500 transition-all duration-300
                    ${isHovered ? 'text-orange-400 translate-x-1' : 'group-hover:text-gray-300'}
                  `}
                />
              </div>
              
              {/* Status text */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
                <span className="text-xs text-gray-500 capitalize group-hover:text-gray-400 transition-colors">
                  {status}
                </span>
              </div>
            </div>
          )}

          {/* Collapsed state tooltip trigger */}
          {collapsed && (
            <div className="absolute left-full ml-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 delay-500 z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-xl">
                <div className="font-medium">{firstName} {lastName}</div>
                <div className="text-gray-400 text-xs">{role}</div>
                {/* Tooltip arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45" />
              </div>
            </div>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`
            absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl
            scale-0 group-active:scale-100 transition-transform duration-200 ease-out
          `} />
        </div>
      </div>

      {/* Quick actions - only shown when not collapsed and hovered */}
      {!collapsed && isHovered && (
        <div className="mt-2 mx-3 flex gap-1 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-orange-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200">
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-orange-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      )}
    </div>
  );
};