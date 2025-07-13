import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";
import { UserTypeTabs } from "./UserTypeTabs";
import type { TUser } from "../../types/usersTypes";
import { AlertCircle } from "lucide-react";
import { UsersActionBar } from "./UsersActionBar";
import { useGetUsersQuery } from "../../features/api/usersApi";
import { UserCardSkeleton } from "./skeleton/UserCardSkeleton";

export const UserList = () => {
  const [selectedType, setSelectedType] = useState<"user" | "owner">("user");
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: usersData, isLoading, isError, refetch } = useGetUsersQuery();

  useEffect(() => {
    if (usersData) {
      let filtered = usersData.filter((user) => user.role === selectedType);
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          [
            user.firstName,
            user.lastName,
            user.email,
            user.contactPhone || "",
          ].some((field) => field.toLowerCase().includes(query))
        );
      }
      setFilteredUsers(filtered);
    }
  }, [selectedType, usersData, searchQuery]);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-100 to-slate-200 text-[#03071e]">
      <h1 className="text-3xl font-bold text-[#14213d] mb-6 tracking-tight">
        <span className="text-[#fca311]">Manage</span>{" "}
        {selectedType === "user" ? "Users" : "Owners"}
      </h1>

      <UserTypeTabs
        selectedType={selectedType}
        onSelect={(type) => setSelectedType(type as "user" | "owner")}
      />

      <UsersActionBar
        onSearch={(query) => setSearchQuery(query)}
        className="mt-6"
      />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center mt-10 text-red-600 gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">Failed to load users.</span>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-[#fca311] text-black rounded-md hover:opacity-90 transition font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-10 italic">
          No {selectedType}s found.
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {filteredUsers.map((user) => (
            <UserCard key={user.userId} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
