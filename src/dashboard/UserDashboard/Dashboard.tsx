import {
  UserCircle,
  CalendarDays,
  CreditCard,
  LifeBuoy,
} from "lucide-react";
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

export const UserDashboard = () => {
  const metrics = [
    {
      title: "Total Spent",
      value: "$2,500",
      icon: (
        <div className="p-2 rounded-full bg-[#DDA15E]/20 text-[#BC6C25]">
          <CreditCard className="w-5 h-5" />
        </div>
      ),
      border: "border-[#DDA15E]",
    },
    {
      title: "Total Bookings",
      value: "18",
      icon: (
        <div className="p-2 rounded-full bg-[#606C38]/20 text-[#606C38]">
          <CalendarDays className="w-5 h-5" />
        </div>
      ),
      border: "border-[#606C38]",
    },
    {
      title: "Open Tickets",
      value: "2",
      icon: (
        <div className="p-2 rounded-full bg-[#BC6C25]/20 text-[#BC6C25]">
          <LifeBuoy className="w-5 h-5" />
        </div>
      ),
      border: "border-[#BC6C25]",
    },
    {
      title: "Loyalty Points",
      value: "320",
      icon: (
        <div className="p-2 rounded-full bg-[#283618]/20 text-[#283618]">
          <UserCircle className="w-5 h-5" />
        </div>
      ),
      border: "border-[#283618]",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-[#283618]">
      {/* Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className={`bg-white border-l-4 ${metric.border} shadow-lg hover:shadow-xl transition duration-300 rounded-2xl`}
          >
            <CardHeader className="flex items-center gap-4">
              {metric.icon}
              <CardTitle className="text-md text-[#283618] font-semibold tracking-wide">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#283618]">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Summary */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-[#606C38] mb-4 tracking-wide">
          Upcoming Booking
        </h3>
        <BookingCard />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#EDEDED]">
          <h3 className="text-lg font-semibold text-[#606C38] mb-3">
            Spending Over Time
          </h3>
          <ResponsiveLineChart data={lineData} color="#BC6C25" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#EDEDED]">
          <h3 className="text-lg font-semibold text-[#606C38] mb-3">
            Booking Frequency
          </h3>
          <ResponsiveBarChart data={barData} color="#606C38" />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white p-6 rounded-2xl shadow border border-[#EDEDED]">
        <Tabs defaultValue="bookings">
          <TabsList className="flex gap-3 mb-6 bg-[#FEFAE0] p-1 rounded-xl border border-[#DDA15E] w-fit">
            <TabsTrigger
              value="bookings"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#283618] data-[state=active]:bg-[#DDA15E] data-[state=active]:text-white transition"
            >
              Latest Bookings
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#283618] data-[state=active]:bg-[#DDA15E] data-[state=active]:text-white transition"
            >
              Customer Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingTable />
          </TabsContent>

          <TabsContent value="tickets">
            <div className="text-center text-gray-400 italic py-4">
              Coming soon: Support ticket view
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
