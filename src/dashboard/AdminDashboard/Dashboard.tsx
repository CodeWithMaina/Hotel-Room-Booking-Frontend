import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Hotel,
  CalendarCheck,
  DollarSign,
  Activity,
  ShieldCheck,
  Server,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/dashboard/Card";
import { useGetAdminAnalyticsSummaryQuery } from "../../features/api/analyticsApi";
import { Skeleton } from "../../components/dashboard/skeleton/AdminSkeleton";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router";

export const Dashboard = () => {
  const { data: response, isError, isLoading } = useGetAdminAnalyticsSummaryQuery();
  const data = response?.data;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 p-6 md:p-12 text-base-content">
        <Skeleton className="h-12 w-64 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base-200 p-6 md:p-12 text-base-content">
        <div className="alert alert-error">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: data?.stats?.totalUsers || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Total Bookings",
      value: data?.stats?.totalBookings || 0,
      icon: CalendarCheck,
      color: "text-warning",
    },
    {
      title: "Total Hotels",
      value: data?.stats?.totalHotels || 0,
      icon: Hotel,
      color: "text-indigo-600",
    },
    {
      title: "Revenue",
      value: `$${data?.stats?.totalRevenue || "0.00"}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const chartData = data?.charts?.monthlyBookings?.rows?.map(row => ({
    month: row.month,
    bookings: Number(row.bookings),
  })) || [];

  const pieData = [
    { name: "Available", value: data?.charts?.roomOccupancy?.available || 0 },
    { name: "Occupied", value: data?.charts?.roomOccupancy?.occupied || 0 },
  ];

  const pieColors = ["#0ea5e9", "#facc15"];
  const newUsers = data?.recentActivity?.newUsers || [];
  const recentBookings = data?.recentActivity?.recentBookings || [];
  const health = data?.systemHealth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white px-4 md:px-12 py-8 text-gray-900 font-sans">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="text-center">
          <p className="uppercase text-sm tracking-wide text-primary mb-1">Welcome back, Admin</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">Monitor key metrics and platform activity</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white shadow hover:shadow-lg transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 bg-white shadow">
          <CardHeader>
            <CardTitle>Monthly Bookings Overview</CardTitle>
            <Button
              className="text-sm"
              variant="ghost"
              onClick={() => navigate("/admin/bookings")}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400">No booking data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 gap-4">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[i] }}
                  />
                  {entry.name}: {entry.value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & New Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* System Health */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Activity className="text-green-600" />
              System Uptime: <span className="font-medium">{health?.uptime || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" />
              Security Status: <span className="font-medium">{health?.securityStatus || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Server className="text-green-600" />
              Server Load: <span className="font-medium">{health?.serverLoad || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* New Users */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => navigate("/admin/users")}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {newUsers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {newUsers.map((user, index) => (
                  <li key={index} className="py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Joined: {new Date(user.joined).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">No new users</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="bg-white shadow mt-12">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recent Bookings</CardTitle>
          <Button onClick={() => navigate("/admin/booking-details")}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto">
          {recentBookings.length > 0 ? (
            <table className="table-auto w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50 border-b">
                    <td>{booking.id}</td>
                    <td>{booking.guest}</td>
                    <td>{booking.room}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-4">No recent bookings</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
