import { useSelector } from "react-redux";
import { X } from "lucide-react";
import type { RootState } from "../../app/store";
import { useGetUserByIdQuery } from "../../features/api";
import { Loading } from "../../pages/Loading";
import { ProfileHeader } from "../../components/profile/ProfileHeader";

export const Profile = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useGetUserByIdQuery(id, { skip: !id });
  console.log(userData);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <X className="w-5 h-5" />
          <span>Error loading profile data</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <ProfileHeader
          profileImage={userData?.profileImage}
          firstName={userData?.firstName}
          lastName={userData?.lastName}
          role={userData?.role}
        />
      </div>
    </div>
  );
};
