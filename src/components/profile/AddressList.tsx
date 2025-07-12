import { Edit2, Trash2, MapPin } from "lucide-react";
import type { TAddress } from "../../types/addressTypes";

interface AddressListProps {
  addresses: TAddress[];
  onEdit?: (address: TAddress) => void;
  onDelete?: (addressId: number) => void;
  onAddNew?: () => void;
}

export const AddressList = ({ addresses, onEdit, onDelete, onAddNew }: AddressListProps) => {
  return (
    <section className="bg-[#14213D] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          onClick={onAddNew}
          className="bg-[#FCA311] text-black px-4 py-2 rounded-lg hover:bg-[#e59d08] flex items-center gap-2"
        >
          + Add
        </button>
      </div>

      {addresses.length ? (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.addressId}
              className="bg-[#000000]/20 border border-[#FCA311]/20 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{address.street}</h3>
                  <p className="text-gray-400 text-sm">
                    {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-[#FCA311] hover:text-white"
                    onClick={() => onEdit?.(address)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-500 hover:text-white"
                    onClick={() => onDelete?.(address.addressId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 flex items-center gap-2">
          <MapPin className="w-6 h-6" /> No address available
        </div>
      )}
    </section>
  );
};
