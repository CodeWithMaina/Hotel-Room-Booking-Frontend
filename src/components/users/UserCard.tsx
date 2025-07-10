import { useState } from "react";
import { Mail, Phone, MapPin, Pencil, Trash2, Loader2, ShieldCheck, XCircle, UserRound } from "lucide-react";
import type { TUser } from "../../types/usersTypes";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import type { TAddressEntity } from "../../types/entityTypes";
import { useGetEntityAddressQuery } from "../../features/api/addressesApi";

interface Props {
  user: TUser;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete user ${user.firstName} ${user.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("User deleted!");
        // TODO: trigger delete API
      }
    });
  };

  const handleEdit = () => {
    toast("Open edit modal or form...");
    // TODO: trigger edit form/modal
  };

  // Fetch address only when modal is open
  const { 
    data: addresses, 
    isLoading: isAddressLoading, 
    isError: isAddressError 
  } = useGetEntityAddressQuery(
    { 
      entityId: user.userId, 
      entityType: user.role as TAddressEntity
    }, 
    { skip: !showModal }
  );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-300 p-4 group relative">
        <div className="flex justify-between items-start">
          <h3 className="text-blue-600 font-semibold text-lg">
            {user.firstName} {user.lastName}
          </h3>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-white hover:bg-blue-600 p-1 rounded-full transition"
              title="View"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="text-green-600 hover:text-white hover:bg-green-600 p-1 rounded-full transition"
              title="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-white hover:bg-red-600 p-1 rounded-full transition"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-gray-500 flex items-center gap-2 mt-2">
          <Mail className="w-4 h-4" /> {user.email}
        </p>
        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <Phone className="w-4 h-4" /> {user.contactPhone}
        </p>
      </div>

      {showModal && (
  <dialog id="user_modal" className="modal modal-open">
    <div className="modal-box max-w-2xl bg-gradient-to-br from-white to-slate-100 rounded-2xl shadow-2xl animate-fade-in-out border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700">
          <UserRound className="w-5 h-5 text-blue-500" />
          {user.firstName} {user.lastName}'s Details
        </h3>
        <button
          className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100"
          onClick={() => setShowModal(false)}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Email:</span> {user.email}
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-600" />
          <span className="font-medium">Phone:</span> {user.contactPhone}
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span className="font-medium">Role:</span>{" "}
          <span className="capitalize">{user.role}</span>
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-2 text-gray-600 font-semibold">
            <MapPin className="w-4 h-4 text-yellow-600" />
            Address:
          </p>

          {isAddressLoading ? (
            <div className="flex items-center gap-2 text-blue-600 mt-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading address...
            </div>
          ) : isAddressError ? (
            <p className="text-red-500 mt-2">⚠️ Failed to load address</p>
          ) : addresses && addresses.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-700">
              {addresses.map((address) => (
                <li key={address.addressId} className="hover:text-blue-600 transition">
                  {address.street}, {address.city}, {address.state}, {address.country} - {address.postalCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No address available.</p>
          )}
        </div>
      </div>
    </div>
  </dialog>
)}
    </>
  );
};