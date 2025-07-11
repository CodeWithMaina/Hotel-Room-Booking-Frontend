import { Camera, User } from "lucide-react";

type Props = {
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export const ProfileHeader: React.FC<Props> = ({ profileImage, firstName, lastName, role }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 shadow border border-slate-200">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-slate-300 overflow-hidden border-4 border-blue-600">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-12 h-12 text-white mx-auto my-6" />
          )}
        </div>
        <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-700">
            {firstName} {lastName}
          </h1>
          <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-sm capitalize">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};