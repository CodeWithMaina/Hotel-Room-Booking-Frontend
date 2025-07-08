import { UserCircle, CalendarDays, CreditCard, LifeBuoy } from "lucide-react";
import { BookingCard } from "../../components/dashboard/BookingCard";
import { ResponsiveBarChart } from "../../components/dashboard/ResponsiveBarChart";
import { BookingTable } from "../../components/dashboard/BookingTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/dashboard/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/dashboard/Card";
import { ResponsiveLineChart } from "../../components/dashboard/ResponsiveLineChart";
import { HeaderCard } from "../../components/dashboard/HeaderCard";

export const UserDashboard = () => {
  const metrics = [
    {
      title: "Total Spent",
      value: "$2,500",
      icon: (
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          <CreditCard className="w-5 h-5" />
        </div>
      ),
      border: "border-blue-200",
    },
    {
      title: "Total Bookings",
      value: "18",
      icon: (
        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
          <CalendarDays className="w-5 h-5" />
        </div>
      ),
      border: "border-purple-200",
    },
    {
      title: "Open Tickets",
      value: "2",
      icon: (
        <div className="p-2 rounded-full bg-rose-100 text-rose-600">
          <LifeBuoy className="w-5 h-5" />
        </div>
      ),
      border: "border-rose-200",
    },
    {
      title: "Loyalty Points",
      value: "320",
      icon: (
        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
          <UserCircle className="w-5 h-5" />
        </div>
      ),
      border: "border-emerald-200",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-gray-700">
      <HeaderCard />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className={`shadow-sm border ${metric.border} transition-all duration-300 hover:shadow-md`}
          >
            <CardHeader className="flex items-center gap-4">
              {metric.icon}
              <CardTitle className="text-sm text-gray-600">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-gray-800">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Upcoming Booking</h3>
        <BookingCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Spending Over Time</h3>
          <ResponsiveLineChart data={lineData} color="#1D4ED8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Booking Frequency</h3>
          <ResponsiveBarChart data={barData} color="#9333EA" />
        </div>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Latest Bookings</TabsTrigger>
          <TabsTrigger value="tickets">Customer Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingTable />
        </TabsContent>
        <TabsContent value="tickets">
          <div className="text-sm text-gray-500">
            Coming soon: Support ticket view
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
