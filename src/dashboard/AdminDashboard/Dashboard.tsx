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
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/Button";
import { Card, CardContent } from "../../components/dashboard/Card";
import { useGetAdminAnalyticsSummaryQuery } from "../../features/api/analyticsApi";
import type {
  MonthlyBooking,
  NewUser,
  RecentBooking,
  SystemHealth,
} from "../../types/analyticsTypes";
import { Skeleton } from "../../components/dashboard/skeleton/AdminSkeleton";

export const Dashboard = () => {
  const { data: response, isError, isLoading } = useGetAdminAnalyticsSummaryQuery();
  const data = response?.data;

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
      color: "text-primary",
    },
    {
      title: "Revenue",
      value: `$${data?.stats?.totalRevenue || "0.00"}`,
      icon: DollarSign,
      color: "text-success",
    },
  ];

  const chartData = data?.charts?.monthlyBookings?.rows?.map((row: MonthlyBooking) => ({
    month: row.month,
    bookings: Number(row.bookings),
  })) || [];

  const pieData = [
    {
      name: "Available",
      value: data?.charts?.roomOccupancy?.available || 0,
    },
    {
      name: "Occupied",
      value: data?.charts?.roomOccupancy?.occupied || 0,
    },
  ];

  const pieColors = ["#007BFF", "#FFC107"];

  const newUsers: NewUser[] = data?.recentActivity?.newUsers || [];
  const recentBookings: RecentBooking[] = data?.recentActivity?.recentBookings || [];
  const health: SystemHealth | undefined = data?.systemHealth;

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-12 text-base-content">
      <h1 className="text-4xl font-bold mb-10 text-primary tracking-wide">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card className="bg-base-100 shadow-md hover:shadow-lg transition-all">
              <CardContent className="flex items-center gap-4 p-5">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 bg-base-100 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Monthly Bookings Overview
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#007BFF" />
                  <YAxis stroke="#007BFF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#007BFF",
                    }}
                    labelStyle={{ color: "#007BFF" }}
                    cursor={{ fill: "#007BFF33" }}
                  />
                  <Bar dataKey="bookings" fill="#007BFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-base-100 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Room Occupancy
            </h2>
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
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: pieColors[index] }}
                  />
                  <span className="text-sm">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health + New Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Card className="bg-base-100 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              System Health
            </h2>
            <div className="flex flex-col gap-4 text-muted">
              <div className="flex items-center gap-3">
                <Activity className="text-success" />
                <span>
                  System Uptime:{" "}
                  <strong className="text-base-content">
                    {health?.uptime || "N/A"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-success" />
                <span>
                  Security Status:{" "}
                  <strong className="text-base-content">
                    {health?.securityStatus || "N/A"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Server className="text-success" />
                <span>
                  Server Load:{" "}
                  <strong className="text-base-content">
                    {health?.serverLoad || "N/A"}
                  </strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-base-100 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              New Users
            </h2>
            {newUsers.length > 0 ? (
              <ul className="divide-y divide-base-300">
                {newUsers.map((user: NewUser, index: number) => (
                  <li key={index} className="py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                    <p className="text-xs text-muted">
                      Joined: {new Date(user.joined).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted text-center py-4">
                No new users
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="bg-base-100 shadow-md mt-10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Recent Bookings
            </h2>
            <Button className="btn btn-primary text-white">View All</Button>
          </div>
          <div className="overflow-x-auto">
            {recentBookings.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr className="text-primary text-sm">
                    <th>ID</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking: RecentBooking) => (
                    <tr key={booking.id} className="hover:bg-base-200">
                      <td>{booking.id}</td>
                      <td>{booking.guest}</td>
                      <td>{booking.room}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-muted text-center py-4">
                No recent bookings
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};