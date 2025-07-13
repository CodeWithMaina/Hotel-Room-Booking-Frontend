import {
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  XCircle,
  Loader2,
  UserRound,
} from "lucide-react";
import type { TUser } from "../../types/usersTypes";
import { useGetEntityAddressQuery } from "../../features/api/addressesApi";
import type { TAddressEntity } from "../../types/entityTypes";

interface Props {
  user: TUser;
  onClose: () => void;
}

export const UserDetailsModal: React.FC<Props> = ({ user, onClose }) => {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useGetEntityAddressQuery(
    { entityId: user.userId, entityType: user.role as TAddressEntity },
    { skip: false }
  );

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl bg-white border border-[#E5E5E5] rounded-2xl shadow-xl text-[#03071E] font-sans px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold tracking-tight text-[#14213D] flex items-center gap-2">
            <UserRound className="text-[#FCA311] w-6 h-6" />
            User Details
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
          {/* Image */}
          <img
            src={user.profileImage || "/placeholder.jpg"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#14213D] shadow-sm"
          />

          {/* Basic Info */}
          <div className="flex-1 space-y-3 text-sm">
            <div className="text-lg font-semibold text-[#14213D]">
              {user.firstName} {user.lastName}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="text-[#FCA311] w-4 h-4" />
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="text-[#FCA311] w-4 h-4" />
              <span className="font-medium">Phone:</span>
              <span>{user.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="text-green-600 w-4 h-4" />
              <span className="font-medium">Role:</span>
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h4 className="font-semibold text-[#14213D] flex items-center gap-2 mb-2">
            <UserRound className="w-4 h-4 text-[#14213D]" />
            Bio
          </h4>
          <p className="text-sm text-gray-700">
            {user.bio || (
              <span className="italic text-gray-400">No bio provided.</span>
            )}
          </p>
        </div>

        {/* Address */}
        <div>
          <h4 className="font-semibold text-[#14213D] flex items-center gap-2 mb-2">
            <MapPin className="text-[#FCA311] w-4 h-4" />
            Address
          </h4>

          {isLoading ? (
            <div className="flex items-center gap-2 text-blue-600 mt-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading address...
            </div>
          ) : isError ? (
            <p className="text-red-500 mt-2">⚠️ Failed to load address</p>
          ) : Array.isArray(addresses) && addresses.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-800">
              {addresses.map((address) => (
                <li key={address.addressId}>
                  {address.street}, {address.city}, {address.state},{" "}
                  {address.country} - {address.postalCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2 italic">No address available.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-action mt-8 sticky bottom-0 bg-white pt-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="btn bg-[#FCA311] text-white hover:bg-[#e4980f]"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};
