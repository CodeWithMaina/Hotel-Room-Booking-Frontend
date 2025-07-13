import { useSelector } from "react-redux";
import { useState } from "react";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/api";
import {
  useGetEntityAddressQuery,
  useUpdateAddressMutation,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} from "../../features/api/addressesApi";
import type { RootState } from "../../app/store";
import { Loading } from "../../pages/Loading";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfoDisplay } from "../../components/profile/ProfileInfoDisplay";
import { AddressList } from "../../components/profile/AddressList";
import { AddressFormModal } from "../../components/profile/AddressFormModal";
import {
  UserFormModal,
  type TUserFormValues,
} from "../../components/profile/UserFormModal";
import toast from "react-hot-toast";
import type { TAddress } from "../../types/addressTypes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
  const { data: addressData = [], refetch: refetchAddresses } =
    useGetEntityAddressQuery({
      entityId: id,
      entityType: "user",
    });

  const [updateUser] = useUpdateUserMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [createAddress] = useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [editMode, setEditMode] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TAddress | undefined>();

  const onSubmit = async (data: TUserFormValues) => {
    console.log(data);
    try {
      await updateUser({ userId: id, ...data }).unwrap();
      refetch();
      setEditMode(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleAddressSave = async (data: TAddress) => {
    try {
      if (data.addressId) {
        const { addressId, ...addressData } = data;
        await updateAddress({ addressId, ...addressData }).unwrap();
        toast.success("Address updated successfully");
      } else {
        const { addressId: _, ...newAddress } = data;
        await createAddress({
          ...newAddress,
          entityId: id,
          entityType: "user",
        }).unwrap();
        toast.success("Address added successfully");
      }
      await refetchAddresses();
    } catch (err) {
      toast.error("Something went wrong while saving.");

      console.error(err);
    } finally {
      setAddressModalOpen(false);
    }
  };

  const handleAddressDelete = async (addressId: number) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This address will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FCA311",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#03071E",
      color: "#E5E5E5",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAddress(addressId).unwrap();
      await refetchAddresses();
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
      console.error(err);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return <div className="text-red-400 p-4">Error loading profile</div>;

  return (
    <div className="min-h-screen text-white p-6 max-w-5xl mx-auto space-y-10">
      {/* Profile Header */}
      <ProfileHeader
        profileImage={userData?.profileImage}
        firstName={userData?.firstName ?? ""}
        lastName={userData?.lastName ?? ""}
        email={userData?.email ?? ""}
        bio={userData?.bio}
        role={userData?.role}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
      />

      {/* Profile Form */}
      <section className="bg-[#14213D] p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-6">Profile Details</h2>
        {editMode ? (
          <UserFormModal
            isOpen={true}
            onClose={() => setEditMode(false)}
            onSubmit={onSubmit}
            defaultValues={{
              firstName: userData?.firstName ?? "",
              lastName: userData?.lastName ?? "",
              bio: userData?.bio ?? "",
            }}
          />
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

      {/* Address List */}
      <AddressList
        addresses={addressData}
        onEdit={(address) => {
          setEditingAddress(address);
          setAddressModalOpen(true);
        }}
        onAddNew={() => {
          setEditingAddress(undefined);
          setAddressModalOpen(true);
        }}
        onDelete={handleAddressDelete}
      />

      {/* Address Modal */}
      <AddressFormModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSubmit={handleAddressSave}
        defaultValues={editingAddress}
      />
    </div>
  );
};
