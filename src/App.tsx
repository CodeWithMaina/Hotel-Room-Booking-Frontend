import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { HotelsPage } from "./pages/HotelsPage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Rooms } from "./pages/Rooms";
import { About } from "./pages/About";
import { DashboardPage } from "./pages/DashboardPage";
import { Settings } from "./dashboard/AdminDashboard/Settings";
import { Dashboard } from "./dashboard/AdminDashboard/Dashboard";
import { HotelOwners } from "./dashboard/AdminDashboard/HotelOwners";
import { Booking } from "./dashboard/AdminDashboard/Booking";
import { Hotels } from "./dashboard/AdminDashboard/Hotels";
import { Users } from "./dashboard/AdminDashboard/Users";
import { Ticket } from "./dashboard/AdminDashboard/Ticket";
import { UserDashboard } from "./dashboard/UserDashboard/Dashboard";
import { UserBookings } from "./dashboard/UserDashboard/Bookings";
import { UserTickets } from "./dashboard/UserDashboard/Tickets";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/hotels",
      element: <HotelsPage />,
    },
    {
      path: "/rooms",
      element: <Rooms />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/hotel/:id",
      element: <HotelDetailsPage />,
    },
    {
      path: "/room/:id",
      element: <RoomDetailsPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <DashboardPage />,
      children: [
        {
          path: "/admin/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/admin/hotel-owners",
          element: <HotelOwners />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/booking-details",
          element: <Booking />,
        },
        {
          path: "/admin/ticket",
          element: <Ticket />,
        },
        {
          path: "/admin/hotels",
          element: <Hotels />,
        },
        {
          path: "/admin/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/user",
      element: <DashboardPage />,
      children: [
        {
          path: "/user/dashboard",
          element: <UserDashboard />,
        },
        {
          path: "/user/booking-details",
          element: <UserBookings />,
        },
        {
          path: "/user/tickets",
          element: <UserTickets />,
        },
        {
          path: "/user/settings",
          element: <Settings />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
