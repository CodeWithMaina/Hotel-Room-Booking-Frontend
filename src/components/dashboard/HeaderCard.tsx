import React from "react";

interface AdminHeaderProps {
  userName: string;
  userRole: string;
}

const HeaderCard: React.FC<AdminHeaderProps> = ({ userName, userRole }) => {

  return (
    <header className="bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 animate-fade-in gap-3">
          {/* Left: Greeting */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-700">
              Hello, {userName}
            </h1>
            <p className="text-sm text-gray-500">Have a nice day</p>
          </div>

          {/* Right: User Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div
              className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm hover:scale-105 hover:bg-blue-700 transition-all duration-300 cursor-pointer"
              aria-label="User Avatar"
              title={userName}
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* Name & Role */}
            <div className="text-left">
              <p className="text-sm text-gray-500">{userName}</p>
              <p className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderCard;
