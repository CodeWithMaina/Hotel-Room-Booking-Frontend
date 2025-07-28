import React, { useEffect, useMemo, useState } from "react";
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
import { Users, Hotel, CalendarCheck, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, subQuarters } from "date-fns";
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
  const [selectedRangeOption, setSelectedRangeOption] = useState("year");
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year
    return {
      startDate: startOfYear,
      endDate: now,
    };
  });

  const dateRangeOptions = useMemo<DateRangeOption[]>(
    () => [
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
      {
        label: "Year to Date",
        value: "year",
        getRange: () => {
          const now = new Date();
          return {
            startDate: new Date(now.getFullYear(), 0, 1), // January 1st
            endDate: now,
          };
        },
      },
    ],
    []
  );

  useEffect(() => {
    const selected = dateRangeOptions.find(
      (opt) => opt.value === selectedRangeOption
    );
    if (selected) {
      setDateRange(selected.getRange());
    }
  }, [selectedRangeOption, dateRangeOptions]);

  const { data, isLoading, isError, refetch } = useGetRoleBasedAnalyticsQuery({
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
  });

  console.log(data);

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

  // Modify your chart data processing to handle year-long data
  const chartData = useMemo(() => {
    if (!analyticsData?.revenueTrends?.length) {
      // If no data, return an empty array or some default values
      return [];
    }

    // For year-long data, you might want to group by month
    if (selectedRangeOption === "year") {
      const monthlyData: Record<string, { revenue: number; bookings: number }> =
        {};

      // Group revenue by month
      analyticsData.revenueTrends.forEach((item) => {
        const month = item.date.substring(0, 7); // "YYYY-MM"
        monthlyData[month] = {
          revenue:
            (monthlyData[month]?.revenue || 0) + Number(item.amount || 0),
          bookings: 0, // Initialize, we'll add bookings next
        };
      });

      // Add bookings data
      analyticsData.bookingTrends?.forEach((item: { date: string; count: number; }) => {
        const month = item.date.substring(0, 7); // "YYYY-MM"
        if (monthlyData[month]) {
          monthlyData[month].bookings += item.count;
        } else {
          monthlyData[month] = {
            revenue: 0,
            bookings: item.count,
          };
        }
      });

      // Convert to array and sort by month
      return Object.entries(monthlyData)
        .map(([date, values]) => ({
          date,
          ...values,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    // For shorter ranges, use the existing daily grouping
    return analyticsData.revenueTrends.map((item) => ({
      date: item.date,
      revenue: item.amount,
      bookings:
        analyticsData.bookingTrends?.find(
          (b: { date: string }) => b.date === item.date
        )?.count || 0,
    }));
  }, [analyticsData, selectedRangeOption]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
      <p className="font-semibold">
        {selectedRangeOption === "year" 
          ? format(new Date(label + "-01"), "MMMM yyyy") 
          : format(new Date(label), "MMMM d, yyyy")}
      </p>
      <p className="text-indigo-500">Revenue: ${payload[0].value.toLocaleString()}</p>
      <p className="text-green-500">Bookings: {payload[1].value}</p>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-8">
      {/* Header & Date Filter */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Analytics</h1>
          <p className="text-gray-500 text-sm">
            Platform-wide metrics and insights
          </p>
        </div>
        <select
          className="select select-bordered bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Status */}
      {isLoading ? (
        <p className="text-gray-600 text-center animate-pulse">
          Loading analytics...
        </p>
      ) : isError ? (
        <div className="alert alert-error justify-between">
          <span>❌ Failed to load analytics.</span>
          <button onClick={() => refetch()} className="btn btn-sm">
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-opacity-10 ${s.color} bg-current`}
                  >
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{s.title}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Revenue & Booking Trends
            </h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={
                      (d) =>
                        selectedRangeOption === "year"
                          ? format(new Date(d + "-01"), "MMM") 
                          : format(new Date(d), "MMM d") 
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    name="Bookings"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Recent Bookings
            </h2>
            <div className="overflow-x-auto rounded-xl">
              <table className="table table-zebra text-sm">
                <thead className="bg-slate-100 text-gray-600">
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
                      <td>${Number(booking.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className="badge badge-outline capitalize">
                          {booking.bookingStatus}
                        </span>
                      </td>
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
          </motion.div>
        </>
      )}
    </div>
  );
};
