import { HeaderCard } from "../../components/dashboard/HeaderCard";

export const HotelOwners = () => {
  const owners = [
    {
      name: "David Wagner",
      email: "david_wagner@example.com",
      role: "Super Admin",
      date: "24 Jun, 2023",
    },
    {
      name: "Ina Hogan",
      email: "windler.warren@runte.net",
      role: "Owner",
      date: "24 Aug, 2023",
    },
    {
      name: "Devin Harmon",
      email: "wintheiser_enos@yahoo.com",
      role: "Owner",
      date: "18 Dec, 2023",
    },
    {
      name: "Lena Page",
      email: "camila_ledner@gmail.com",
      role: "Pending",
      date: "8 Oct, 2023",
    },
    {
      name: "David Wagner",
      email: "david_wagner@example.com",
      role: "Super Admin",
      date: "24 Jun, 2023",
    },
    {
      name: "Ina Hogan",
      email: "windler.warren@runte.net",
      role: "Owner",
      date: "24 Aug, 2023",
    },
    {
      name: "Devin Harmon",
      email: "wintheiser_enos@yahoo.com",
      role: "Owner",
      date: "18 Dec, 2023",
    },
    {
      name: "Lena Page",
      email: "camila_ledner@gmail.com",
      role: "Pending",
      date: "8 Oct, 2023",
    },
  ];

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-blue-600 text-white";
      case "Owner":
        return "bg-blue-500 text-white";
      case "Pending":
        return "bg-gray-300 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div>
      <HeaderCard />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">List Hotel Owners</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add Owner +
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Create Date</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {owners.map(({ name, email, role, date }) => (
              <tr key={email} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </td>
                <td className="px-4 py-3">{date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                      role
                    )}`}
                  >
                    {role}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:underline">✎</button>
                  <button className="text-red-500 hover:underline">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
