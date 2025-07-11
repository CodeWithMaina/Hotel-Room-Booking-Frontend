import { Home, MapPin, Plus } from "lucide-react";

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  address?: Address;
  onEdit: () => void;
};

export const ProfileAddress: React.FC<Props> = ({ address, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> Address
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> {address ? "Edit" : "Add"}
        </button>
      </div>
      {address ? (
        <div className="text-gray-700 space-y-1">
          <p><Home className="inline w-4 h-4 mr-2" />{address.street}</p>
          <p>{address.city}, {address.state} {address.postalCode}</p>
          <p>{address.country}</p>
        </div>
      ) : (
        <p className="text-gray-500">No address saved yet.</p>
      )}
    </div>
  );
};