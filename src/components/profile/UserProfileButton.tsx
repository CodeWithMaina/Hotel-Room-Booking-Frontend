import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface ProfileFooterProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  collapsed?: boolean;
}

export const UserProfileButton: React.FC<ProfileFooterProps> = ({
  firstName,
  lastName,
  avatarUrl = "https://i.pravatar.cc/100",
  collapsed = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/user/profile");
  };

  return (
    <div className="mt-auto pt-6 border-t border-[#1a1a1a]">
      <div
        onClick={handleClick}
        className={clsx(
          "flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-3 rounded-lg transition-colors duration-200",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-[#fca311]"
        />
        {!collapsed && (
          <div className="text-left">
            <h2 className="text-base font-semibold text-white leading-tight">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-[#fca311]">View Profile</p>
          </div>
        )}
      </div>
    </div>
  );
};
