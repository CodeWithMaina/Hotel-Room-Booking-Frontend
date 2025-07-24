import {
  UserCircle,
  CalendarDays,
  CreditCard,
  LifeBuoy,
} from "lucide-react";
import { motion } from "framer-motion";
import { BookingCard } from "../../components/dashboard/BookingCard";
import { ResponsiveBarChart } from "../../components/dashboard/ResponsiveBarChart";
import { BookingTable } from "../../components/dashboard/BookingTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/dashboard/tabs";
import { ResponsiveLineChart } from "../../components/dashboard/ResponsiveLineChart";
import {
  MetricCard,
  type Metric,
} from "../../components/dashboard/skeleton/MetricCard";
import { MetricCardSkeleton } from "../../components/dashboard/skeleton/MetricCardSkeleton";
import { useGetUserAnalyticsSummaryQuery } from "../../features/api/analyticsApi";
import { useState } from "react";

export const UserDashboard = () => {
  const [tab, setTab] = useState("bookings");

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const {
    data: analytics,
    error,
    isLoading,
  } = useGetUserAnalyticsSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const metrics: Metric[] = [
    {
      title: "Total Spent",
      value: analytics ? `Ksh ${analytics.totalRevenue.toLocaleString()}` : "-",
      icon: (
        <div className="p-1.5 rounded-full bg-primary/10 text-primary">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: "Total Bookings",
      value: analytics ? analytics.totalBookings.toString() : "-",
      icon: (
        <div className="p-1.5 rounded-full bg-muted/10 text-muted">
          <CalendarDays className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: "Open Tickets",
      value: analytics ? analytics.openTickets.toString() : "-",
      icon: (
        <div className="p-1.5 rounded-full bg-primary/10 text-primary">
          <LifeBuoy className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: "Total Users",
      value: analytics ? analytics.totalUsers.toString() : "-",
      icon: (
        <div className="p-1.5 rounded-full bg-base-content/10 text-base-content">
          <UserCircle className="w-4 h-4" />
        </div>
      ),
    },
  ];

  const lineData =
    analytics?.monthlySpending?.slice().reverse().map((item) => ({
      month: item.month,
      value: item.total || 0,
    })) || [];

  const barData =
    analytics?.monthlyBookingFrequency?.slice().reverse().map((item) => ({
      service: item.month,
      count: item.count || 0,
    })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-6 md:px-10 md:py-10 space-y-10 text-base-content"
    >
      <motion.h1
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl md:text-3xl font-bold text-primary tracking-tight"
      >
        Welcome Back
      </motion.h1>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(isLoading || error ? new Array(4).fill(null) : metrics).map(
          (metric, idx) =>
            isLoading || !metric ? (
              <MetricCardSkeleton key={idx} />
            ) : (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <MetricCard metric={metric} />
              </motion.div>
            )
        )}
      </section>

      {/* Upcoming Booking */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-base md:text-lg font-semibold text-primary mb-2">
          Upcoming Booking
        </h3>
        {isLoading ? (
          <div className="bg-base-100 h-24 rounded-xl shadow animate-pulse" />
        ) : (
          <BookingCard />
        )}
      </motion.section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-6 shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-base font-medium text-primary mb-3">
            Spending Over Time
          </h4>
          {isLoading ? (
            <div className="h-40 bg-base-200 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveLineChart data={lineData} color="#007bff" />
          )}
        </motion.div>

        <motion.div
          className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-6 shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-base font-medium text-primary mb-3">
            Booking Frequency
          </h4>
          {isLoading ? (
            <div className="h-40 bg-base-200 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveBarChart data={barData} color="#6c757d" />
          )}
        </motion.div>
      </section>

      {/* Tabbed Section */}
      <motion.section
        className="bg-base-100 p-4 md:p-6 rounded-xl border border-base-300 shadow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="bg-base-200 border border-primary/20 p-1 rounded-lg flex gap-2 w-full mb-4">
            <TabsTrigger
              value="bookings"
              className="flex-1 text-sm font-medium px-3 py-1.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition"
            >
              Latest Bookings
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="flex-1 text-sm font-medium px-3 py-1.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition"
            >
              Customer Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {isLoading ? (
              <div className="h-24 bg-base-200 rounded-lg animate-pulse" />
            ) : (
              <BookingTable />
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <div className="text-center text-sm text-muted italic py-6">
              Coming soon: Support ticket view
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </motion.div>
  );
};
