// import { Edit2, Trash2, MapPin, Plus } from "lucide-react";
// import type { TAddress } from "../../types/addressTypes";

// interface AddressListProps {
//   addresses: TAddress[];
//   onEdit?: (address: TAddress) => void;
//   onDelete?: (addressId: number) => void;
//   onAddNew?: () => void;
// }

// export const AddressList = ({
//   addresses,
//   onEdit,
//   onDelete,
//   onAddNew,
// }: AddressListProps) => {
//   return (
//     <section className="bg-[#14213D] p-6 rounded-2xl">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-[#E5E5E5]">Addresses</h2>
//         <button
//           onClick={onAddNew}
//           className="flex items-center gap-2 bg-[#FCA311] text-black px-4 py-2 rounded-lg hover:bg-[#e59d08] transition font-medium shadow"
//         >
//           <Plus className="w-4 h-4" /> Add
//         </button>
//       </div>

//       {/* Address Cards */}
//       {addresses.length > 0 ? (
//         <div className="grid gap-4">
//           {addresses.map((address) => (
//             <div
//               key={address.addressId}
//               className="bg-[#000000]/30 border border-[#FCA311]/30 rounded-xl p-4 shadow-sm hover:shadow-md transition"
//             >
//               <div className="flex justify-between items-start gap-4">
//                 {/* Address Info */}
//                 <div>
//                   <h3 className="text-white font-semibold text-md mb-1">
//                     {address.street}
//                   </h3>
//                   <p className="text-sm text-gray-300">
//                     {address.city}, {address.state} {address.postalCode},{" "}
//                     {address.country}
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <button
//                     className="text-[#FCA311] hover:text-white transition"
//                     onClick={() => onEdit?.(address)}
//                     title="Edit Address"
//                   >
//                     <Edit2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="text-red-500 hover:text-white transition"
//                     onClick={() => onDelete?.(address.addressId)}
//                     title="Delete Address"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // Empty State
//         <div className="flex items-center gap-2 text-gray-400 mt-4">
//           <MapPin className="w-5 h-5" /> No addresses available.
//         </div>
//       )}
//     </section>
//   );
// };
