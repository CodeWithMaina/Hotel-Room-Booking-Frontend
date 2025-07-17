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
import { Profile } from "./dashboard/AdminDashboard/Profile";
import { Dashboard } from "./dashboard/AdminDashboard/Dashboard";
import { Booking } from "./dashboard/AdminDashboard/Booking";
import { Hotels } from "./dashboard/AdminDashboard/Hotels";
import { Users } from "./dashboard/AdminDashboard/Users";
import { Ticket } from "./dashboard/AdminDashboard/AdminTicket";
import { UserDashboard } from "./dashboard/UserDashboard/Dashboard";
import { Bookings } from "./dashboard/UserDashboard/Bookings";
import { UserTickets } from "./dashboard/UserDashboard/UserTickets";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";
import { Toaster } from "react-hot-toast";
import { HotelDetails } from "./dashboard/AdminDashboard/HotelDetails";
import { RoomDetails } from "./dashboard/AdminDashboard/RoomDetails";
import { BookingDetails } from "./dashboard/AdminDashboard/BookingDetails";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Wishlist } from "./dashboard/UserDashboard/Wishlist";
import { UserPayment } from "./dashboard/UserDashboard/UserPayment";
import { Checkout } from "./dashboard/UserDashboard/Checkout";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { PaymentCancelledPage } from "./pages/PaymentCancelledPage";

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
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
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
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/booking-details",
          element: <Booking />,
        },
        {
          path: "/admin/booking-details/:id",
          element: <BookingDetails />,
        },
        {
          path: "/admin/hotels/:hotel/:id",
          element: <HotelDetails />,
        },
        {
          path: "/admin/room/:room/:id",
          element: <RoomDetails />,
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
          path: "/admin/profile",
          element: <Profile />,
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
          element: <Bookings />,
        },
        {
          path: "/user/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/user/payment",
          element: <UserPayment />,
        },
        {
          path: "/user/checkout/:id",
          element: <Checkout />,
        },
        {
          path: "/user/payment/payment-success",
          element: <PaymentSuccessPage />,
        },
        {
          path: "/user/payment/payment-cancelled",
          element: <PaymentCancelledPage />,
        },

        {
          path: "/user/tickets",
          element: <UserTickets />,
        },
        {
          path: "/user/profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
