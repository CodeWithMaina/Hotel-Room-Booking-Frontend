import React from "react";
import { User, Settings } from "lucide-react";
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
}) => {
  const navigate = useNavigate();

  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="mt-auto">
      <div className="h-px bg-gray-700/50 my-4" />

      <div
        className={`flex items-center p-3 rounded-xl border border-gray-700 bg-gray-800 cursor-pointer ${collapsed ? "justify-center mx-2" : "gap-4 mx-3"}`}
      >
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${firstName} ${lastName}`}
              className={`${collapsed ? "w-10 h-10" : "w-12 h-12"} rounded-full object-cover border-2 border-orange-400`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}

          {/* Fallback initials */}
          <div
            className={`${avatarUrl ? "hidden" : "flex"} ${collapsed ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-orange-500 items-center justify-center text-white font-semibold text-sm`}
          >
            {getInitials()}
          </div>

        </div>

        {/* User info */}
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium truncate">
                  {firstName} {lastName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="mt-2 mx-3 flex gap-2">
          <button onClick={() => navigate("/admin/profile")} className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg">
            <User className="w-4 h-4" />
            Profile
          </button>
          <button onClick={() => navigate("/admin/settings")} className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      )}
    </div>
  );
};
