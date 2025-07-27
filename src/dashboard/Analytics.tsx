import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Hotel,
  CalendarCheck,
  DollarSign,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { format, subDays, subQuarters } from "date-fns";
import type { RootState } from "../app/store";
import {
  useGetRoleBasedAnalyticsQuery,
  type AdminDashboardStats,
} from "../features/api/analyticsApi";

type StatCard = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

type DateRangeOption = {
  label: string;
  value: string;
  getRange: () => { startDate: Date; endDate: Date };
};

export const Analytics: React.FC = () => {
  const { userType } = useSelector((state: RootState) => state.auth);
  const [selectedRangeOption, setSelectedRangeOption] = useState("30days");
  const [dateRange, setDateRange] = useState(() => ({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  }));

  const dateRangeOptions: DateRangeOption[] = [
    {
      label: "Last 7 Days",
      value: "7days",
      getRange: () => ({
        startDate: subDays(new Date(), 7),
        endDate: new Date(),
      }),
    },
    {
      label: "Last 30 Days",
      value: "30days",
      getRange: () => ({
        startDate: subDays(new Date(), 30),
        endDate: new Date(),
      }),
    },
    {
      label: "Last Quarter",
      value: "quarter",
      getRange: () => ({
        startDate: subQuarters(new Date(), 1),
        endDate: new Date(),
      }),
    },
  ];

  useEffect(() => {
    const selected = dateRangeOptions.find(
      (opt) => opt.value === selectedRangeOption
    );
    if (selected) setDateRange(selected.getRange());
  }, [selectedRangeOption]);

  const { data, isLoading, isError, refetch } = useGetRoleBasedAnalyticsQuery({
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
  });

  const analyticsData = data?.data as AdminDashboardStats | undefined;

  const stats: StatCard[] = analyticsData
    ? [
        {
          title: "Users",
          value: analyticsData.totalUsers ?? 0,
          icon: Users,
          color: "text-blue-500",
        },
        {
          title: "Hotels",
          value: analyticsData.totalHotels ?? 0,
          icon: Hotel,
          color: "text-purple-500",
        },
        {
          title: "Bookings",
          value: analyticsData.totalBookings ?? 0,
          icon: CalendarCheck,
          color: "text-yellow-500",
        },
        {
          title: "Revenue",
          value: `$${Number(analyticsData.totalRevenue || 0).toLocaleString()}`,
          icon: DollarSign,
          color: "text-green-500",
        },
        {
          title: "Tickets",
          value: analyticsData.pendingTickets ?? 0,
          icon: Clock,
          color: "text-red-500",
        },
      ]
    : [];

  const chartData =
    analyticsData?.revenueTrends?.map((item) => ({
      date: item.date,
      revenue: item.amount,
      bookings:
        analyticsData.bookingTrends?.find((b) => b.date === item.date)?.count || 0,
    })) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 md:px-12 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 text-sm">
            Platform-wide metrics and trends
          </p>
        </div>
        <select
          className="select select-bordered"
          value={selectedRangeOption}
          onChange={(e) => setSelectedRangeOption(e.target.value)}
        >
          {dateRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-600 text-center">Loading analytics...</p>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Failed to load analytics.</span>
          <button onClick={() => refetch()} className="btn btn-sm ml-auto">
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-opacity-10 ${s.color}`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{s.title}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Revenue & Booking Trends
            </h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => format(new Date(d), "MMM d")}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#82ca9d"
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Hotel</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData?.recentBookings?.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>
                        {booking.user?.firstName} {booking.user?.lastName}
                      </td>
                      <td>{booking.user?.email}</td>
                      <td>{booking.room?.hotel?.name}</td>
                      <td>{format(new Date(booking.checkInDate), "PPP")}</td>
                      <td>{format(new Date(booking.checkOutDate), "PPP")}</td>
                      <td>${parseFloat(booking.totalAmount).toFixed(2)}</td>
                      <td>{booking.bookingStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!analyticsData?.recentBookings?.length && (
                <p className="text-center text-gray-500 py-4">
                  No bookings to show.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
