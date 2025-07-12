// // ProfilePageRedesigned.tsx
// import {
//   User,
//   Phone,
//   Mail,
//   Calendar,
//   Camera,
//   Edit2,
//   X,
//   Check,
//   Plus,
//   Trash2,
//   MapPin,
//   Star,
//   WholeWord,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { useState } from "react";
// import type { RootState } from "../../app/store";
// import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/api";
// import type { TUserForm } from "../../types/usersTypes";
// import { Loading } from "../../pages/Loading";
// import { useGetEntityAddressQuery } from "../../features/api/addressesApi";
// import type { TAddress } from "../../types/addressTypes";

// export const Profile = () => {
//   const { userId } = useSelector((state: RootState) => state.auth);
//   const id = Number(userId);

//   const {
//     data: userData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetUserByIdQuery(id, { skip: !id });
//   const { data: addressData } = useGetEntityAddressQuery({
//     entityId: id,
//     entityType: "user",
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty },
//   } = useForm<TUserForm>({
//     defaultValues: {
//       firstName: userData?.firstName || "",
//       lastName: userData?.lastName || "",
//       contactPhone: userData?.contactPhone || "",
//       email: userData?.email || "",
//       bio: userData?.bio || "",
//     },
//   });

//   const [updateUser] = useUpdateUserMutation();
//   const [editMode, setEditMode] = useState(false);
//   const [showAddressForm, setShowAddressForm] = useState(false);

//   const onSubmit = async (data: TUserForm) => {
//     try {
//       await updateUser({
//         userId: id,
//         ...data,
//       }).unwrap();
//       refetch();
//       setEditMode(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile.");
//     }
//   };

//   if (isLoading) return <Loading />;
//   if (isError)
//     return (
//       <div className="bg-[#FCA311]/10 text-[#FCA311] p-4 rounded-lg flex gap-2">
//         <X className="w-5 h-5" /> Error loading profile
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#03071E] text-white">
//       <div className="max-w-5xl mx-auto p-6 space-y-10">
//         <section className="flex flex-col md:flex-row gap-6 items-start md:items-center">
//           <div className="relative group">
//             <img
//               src={userData?.profileImage || "https://via.placeholder.com/150"}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover border-4 border-[#FCA311]/40"
//             />
//             <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
//               <Camera className="w-5 h-5 text-white" />
//             </button>
//             {userData?.role === "admin" && (
//               <div className="absolute -top-2 -right-2 bg-[#FCA311] p-1 rounded-full">
//                 <Star className="w-4 h-4 text-black" />
//               </div>
//             )}
//           </div>

//           <div className="flex-1 space-y-2">
//             <h1 className="text-2xl font-bold">
//               {userData?.firstName} {userData?.lastName}
//             </h1>
//             <p className="text-gray-400">{userData?.email}</p>
//             <p className="text-sm text-gray-500">
//               {userData?.bio || "No bio available"}
//             </p>
//             <div className="flex flex-wrap gap-4 text-sm text-[#E5E5E5]">
//               <span className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 Member since {new Date(userData?.createdAt || "").getFullYear()}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={() => setEditMode(!editMode)}
//             className="px-5 py-2 rounded-xl font-medium bg-[#FCA311] text-black hover:bg-[#e59d08] flex items-center gap-2"
//           >
//             {editMode ? (
//               <>
//                 <X className="w-4 h-4" /> Cancel
//               </>
//             ) : (
//               <>
//                 <Edit2 className="w-4 h-4" /> Edit
//               </>
//             )}
//           </button>
//         </section>

//         <section className="bg-[#14213D] p-6 rounded-2xl">
//           <h2 className="text-lg font-semibold mb-6">Profile Details</h2>
//           {editMode ? (
//             <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//               <div>
//                 <label className="text-sm">First Name</label>
//                 <input
//                   type="text"
//                   {...register("firstName", { required: true })}
//                   className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Last Name</label>
//                 <input
//                   type="text"
//                   {...register("lastName", { required: true })}
//                   className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Bio</label>
//                 <input
//                   type="text"
//                   {...register("bio", { required: true })}
//                   className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Phone</label>
//                 <input
//                   type="tel"
//                   {...register("contactPhone")}
//                   className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Email</label>
//                 <input
//                   type="email"
//                   {...register("email")}
//                   className="w-full mt-1 p-2 rounded-lg bg-[#000000] border border-[#FCA311]/40 text-white"
//                 />
//               </div>
//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditMode(false);
//                     reset();
//                   }}
//                   className="px-4 py-2 rounded-lg border border-[#FCA311] text-[#FCA311] hover:bg-[#FCA311]/10"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#FCA311] text-black font-medium rounded-lg hover:bg-[#e59d08]"
//                   disabled={!isDirty}
//                 >
//                   <Check className="w-4 h-4 inline-block mr-1" /> Save
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex items-center gap-2">
//                 <User className="w-5 h-5 text-[#FCA311]" />
//                 <span>
//                   {userData?.firstName} {userData?.lastName}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <WholeWord className="w-5 h-5 text-[#FCA311]" />
//                 <span>
//                   {userData?.bio}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone className="w-5 h-5 text-[#FCA311]" />
//                 <span>{userData?.contactPhone}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Mail className="w-5 h-5 text-[#FCA311]" />
//                 <span>{userData?.email}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Star className="w-5 h-5 text-[#FCA311]" />
//                 <span className="capitalize">{userData?.role}</span>
//               </div>
//             </div>
//           )}
//         </section>

//         <section className="bg-[#14213D] p-6 rounded-2xl">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Addresses</h2>
//             <button
//               onClick={() => setShowAddressForm(!showAddressForm)}
//               className="bg-[#FCA311] text-black px-4 py-2 rounded-lg hover:bg-[#e59d08] flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" /> Add
//             </button>
//           </div>

//           {/* Address form and address cards would go here based on address data */}
//           {addressData?.length ? (
//             <div className="grid gap-4">
//               {addressData.map((address: TAddress) => (
//                 <div
//                   key={address.addressId}
//                   className="bg-[#000000]/20 border border-[#FCA311]/20 rounded-lg p-4"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="text-white font-semibold">
//                         {address.street}
//                       </h3>
//                       <p className="text-gray-400 text-sm">
//                         {address.city}, {address.state} {address.postalCode},{" "}
//                         {address.country}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button className="text-[#FCA311] hover:text-white">
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button className="text-red-500 hover:text-white">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-gray-400 flex items-center gap-2">
//               <MapPin className="w-6 h-6" /> No address available
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/api";
import { useGetEntityAddressQuery } from "../../features/api/addressesApi";
import type { TUserForm } from "../../types/usersTypes";
import type { RootState } from "../../app/store";
import { Loading } from "../../pages/Loading";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { ProfileInfoDisplay } from "../../components/profile/ProfileInfoDisplay";
import { AddressList } from "../../components/profile/AddressList";


export const Profile = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const { data: userData, isLoading, isError, refetch } = useGetUserByIdQuery(id, { skip: !id });
  const { data: addressData = [] } = useGetEntityAddressQuery({ entityId: id, entityType: "user" });
  console.log(userData)
  console.log(addressData)

  const methods = useForm<TUserForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      contactPhone: "",
      email: "",
      bio: "",
    },
    values: {
      firstName: userData?.firstName ?? "",
      lastName: userData?.lastName ?? "",
      contactPhone: userData?.contactPhone ?? "",
      email: userData?.email ?? "",
      bio: userData?.bio ?? "",
    },
  });

  const [updateUser] = useUpdateUserMutation();
  const [editMode, setEditMode] = useState(false);

  const onSubmit = async (data: TUserForm) => {
    try {
      await updateUser({ userId: id, ...data }).unwrap();
      refetch();
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-400 p-4">Error loading profile</div>;

  return (
    <div className="min-h-screen bg-[#03071E] text-white p-6 max-w-5xl mx-auto space-y-10">
      <ProfileHeader
        profileImage={userData?.profileImage}
        firstName={userData?.firstName ?? ""}
        lastName={userData?.lastName ?? ""}
        email={userData?.email ?? ""}
        bio={userData?.bio}
        role={userData?.role}
        createdAt={userData?.createdAt}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
      />

      <section className="bg-[#14213D] p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-6">Profile Details</h2>
        {editMode ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ProfileForm isDirty={methods.formState.isDirty} onCancel={() => setEditMode(false)} />
            </form>
          </FormProvider>
        ) : (
          <ProfileInfoDisplay
            firstName={userData?.firstName ?? ""}
            lastName={userData?.lastName ?? ""}
            bio={userData?.bio}
            contactPhone={userData?.contactPhone}
            email={userData?.email ?? ""}
            role={userData?.role}
          />
        )}
      </section>

      <AddressList addresses={addressData} />
    </div>
  );
};
