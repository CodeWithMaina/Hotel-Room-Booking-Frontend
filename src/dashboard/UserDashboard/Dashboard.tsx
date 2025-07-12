import {
  UserCircle,
  CalendarDays,
  CreditCard,
  LifeBuoy,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { MetricCard, type Metric } from "../../components/dashboard/skeleton/MetricCard";
import { MetricCardSkeleton } from "../../components/dashboard/skeleton/MetricCardSkeleton";

export const UserDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const metrics: Metric[] = [
    {
      title: "Total Spent",
      value: "$2,500",
      icon: (
        <div className="p-2 rounded-full bg-[#FCA311]/20 text-[#FCA311]">
          <CreditCard className="w-5 h-5" />
        </div>
      ),
    },
    {
      title: "Total Bookings",
      value: "18",
      icon: (
        <div className="p-2 rounded-full bg-[#E5E5E5]/10 text-[#E5E5E5]">
          <CalendarDays className="w-5 h-5" />
        </div>
      ),
    },
    {
      title: "Open Tickets",
      value: "2",
      icon: (
        <div className="p-2 rounded-full bg-[#FCA311]/10 text-[#FCA311]">
          <LifeBuoy className="w-5 h-5" />
        </div>
      ),
    },
    {
      title: "Loyalty Points",
      value: "320",
      icon: (
        <div className="p-2 rounded-full bg-[#14213D]/20 text-[#FFFFFF]">
          <UserCircle className="w-5 h-5" />
        </div>
      ),
    },
  ];

  const lineData = [
    { month: "Jan", value: 200 },
    { month: "Feb", value: 400 },
    { month: "Mar", value: 300 },
    { month: "Apr", value: 500 },
  ];

  const barData = [
    { service: "Spa", count: 5 },
    { service: "Hotel", count: 10 },
    { service: "Resort", count: 3 },
    { service: "Tour", count: 7 },
  ];

  return (
    <div className="min-h-screen bg-[#03071E] p-4 sm:p-6 text-white space-y-12">
      {/* Metrics */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {(loading ? new Array(4).fill(null) : metrics).map((metric, idx) =>
          loading || !metric ? (
            <MetricCardSkeleton key={idx} />
          ) : (
            <MetricCard key={idx} metric={metric} />
          )
        )}
      </div>

      {/* Booking Highlight */}
      <div>
        <h3 className="text-lg font-medium text-[#FCA311] mb-3 tracking-wide">
          Upcoming Booking
        </h3>
        {loading ? (
          <div className="bg-[#14213D] h-28 rounded-2xl animate-pulse" />
        ) : (
          <BookingCard />
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#14213D] border border-[#1F2A3D] rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 tracking-wide">
            Spending Over Time
          </h3>
          {loading ? (
            <div className="h-40 bg-[#1F2A3D] rounded-lg animate-pulse" />
          ) : (
            <ResponsiveLineChart data={lineData} color="#FCA311" />
          )}
        </div>
        <div className="bg-[#14213D] border border-[#1F2A3D] rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 tracking-wide">
            Booking Frequency
          </h3>
          {loading ? (
            <div className="h-40 bg-[#1F2A3D] rounded-lg animate-pulse" />
          ) : (
            <ResponsiveBarChart data={barData} color="#E5E5E5" />
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-[#14213D] p-6 rounded-2xl border border-[#1F2A3D]">
        <Tabs defaultValue="bookings">
          <TabsList className="flex gap-3 mb-6 bg-[#03071E] p-1 rounded-xl border border-[#FCA311]/30 w-full overflow-x-auto">
            <TabsTrigger value="bookings">Latest Bookings</TabsTrigger>
            <TabsTrigger value="tickets">Customer Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {loading ? (
              <div className="h-24 bg-[#1F2A3D] rounded-lg animate-pulse" />
            ) : (
              <BookingTable />
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <div className="text-center text-[#E5E5E5]/70 italic py-6">
              Coming soon: Support ticket view
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
