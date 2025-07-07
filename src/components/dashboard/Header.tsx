// import { Bell, Home, LogOut, User } from "lucide-react";

// export const Header = ({ search, setSearch }: { search: string; setSearch: (val: string) => void }) => (
//   <div className="navbar bg-white shadow-sm px-6">
//     <div className="flex-1">
//       <div className="text-left">
//         <p className="text-sm text-gray-700">Hello, User</p>
//         <p className="text-sm text-gray-500">Have a nice day</p>
//         <h1 className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors">John Wick</h1>
//       </div>
//     </div>
//     <div className="flex-none gap-2">
//       {/* <div className="form-control">
//         <input
//           type="text"
//           placeholder="Search documents"
//           className="input input-bordered w-72 h-10 bg-white text-gray-700 placeholder-gray-500"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div> */}
//       {/* <button className="btn btn-ghost btn-circle">
//         <Bell className="w-5 h-5 text-gray-700 hover:text-blue-700 transition-colors" />
//       </button> */}
//       <div className="dropdown dropdown-end">
//         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//           <div className="w-8 rounded-full bg-gray-300 flex items-center justify-center">
//             <User className="w-4 h-4 text-white" />
//           </div>
//         </div>
//         <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//           <li><a className="hover:text-blue-700"><Home className="w-4 h-4 mr-2" /> Home</a></li>
//           <li><a className="hover:text-blue-700"><LogOut className="w-4 h-4 mr-2" /> Logout</a></li>
//         </ul>
//       </div>
//     </div>
//   </div>
// );