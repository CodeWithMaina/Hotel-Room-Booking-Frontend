import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";
import { UserTypeTabs } from "./UserTypeTabs";
import type { TUser } from "../../types/usersTypes";
import { AlertCircle } from "lucide-react";
import { UsersActionBar } from "./UsersActionBar";
import { useGetUsersQuery } from "../../features/api/usersApi";
import { UserCardSkeleton } from "./skeleton/UserCardSkeleton";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-100 to-slate-200 text-[#03071e] space-y-10"
    >
      <motion.h1
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-[#14213d] tracking-tight"
      >
        <span className="text-[#fca311]">Manage</span>{" "}
        {selectedType === "user" ? "Users" : "Owners"}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserTypeTabs
          selectedType={selectedType}
          onSelect={(type) => setSelectedType(type as "user" | "owner")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <UsersActionBar
          onSearch={(query) => setSearchQuery(query)}
          className="mt-6"
        />
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <UserCardSkeleton />
            </motion.div>
          ))}
        </div>
      )}

      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center mt-10 text-red-600 gap-2"
        >
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
        </motion.div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center text-gray-500 mt-10 italic"
        >
          No {selectedType}s found.
        </motion.div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <UserCard user={user} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
