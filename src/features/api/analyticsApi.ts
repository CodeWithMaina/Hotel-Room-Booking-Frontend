import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

// ====================== TYPE DEFINITIONS ======================
export interface DateRange {
  startDate: string;
  endDate: string;
}

interface BaseAnalyticsResponse {
  success: boolean;
  message?: string;
}

export interface AdminDashboardStats {
  bookingTrends: any;
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Array<{
    bookingId: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    bookingStatus: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    room: {
      roomId: number;
      pricePerNight: number;
      hotel: {
        name: string;
      };
    };
  }>;
  pendingTickets: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  revenueTrends: Array<{
    date: string;
    amount: number;
  }>;
}

export interface OwnerDashboardStats {
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  recentBookings: Array<{
    bookingId: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    bookingStatus: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    room: {
      roomId: number;
      pricePerNight: number;
      hotel: {
        name: string;
      };
      roomType: {
        name: string;
      };
    };
  }>;
  upcomingCheckIns: Array<{
    bookingId: number;
    checkInDate: string;
    checkOutDate: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      contactPhone?: string;
    };
    room: {
      roomId: number;
      hotel: {
        name: string;
      };
      roomType: {
        name: string;
      };
    };
  }>;
  revenueByRoomType: Array<{
    roomType: string;
    revenue: number;
  }>;
  bookingTrends: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserDashboardStats {
  totalBookings: number;
  upcomingBookings: Array<{
    bookingId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    bookingStatus: string;
    room: {
      roomId: number;
      pricePerNight: number;
      thumbnail?: string;
      hotel: {
        name: string;
        location?: string;
        thumbnail?: string;
      };
      roomType: {
        name: string;
      };
    };
    payments?: Array<{
      amount: number;
      paymentDate: string;
    }>;
  }>;
  pastBookings: Array<{
    bookingId: number;
    checkOutDate: string;
    room: {
      roomId: number;
      pricePerNight: number;
      thumbnail?: string;
      hotel: {
        name: string;
        location?: string;
      };
      roomType: {
        name: string;
      };
    };
    payments?: Array<{
      amount: number;
    }>;
    review?: {
      rating: number;
      comment?: string;
    };
  }>;
  totalSpent: number;
  wishlistCount: number;
  favoriteHotel?: {
    hotelId: number;
    name: string;
    bookingCount: number;
  };
  bookingTrends: Array<{
    date: string;
    count: number;
  }>;
}

interface AdminAnalyticsResponse extends BaseAnalyticsResponse {
  data: AdminDashboardStats;
}

interface OwnerAnalyticsResponse extends BaseAnalyticsResponse {
  data: OwnerDashboardStats;
}

interface UserAnalyticsResponse extends BaseAnalyticsResponse {
  data: UserDashboardStats;
}

// ====================== API DEFINITION ======================
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = (getState() as RootState).auth.token || localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      } catch (error) {
        console.error('Error preparing headers:', error);
        return headers;
      }
    },
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, DateRange | void>({
      query: (dateRange) => ({
        url: "analytics/admin",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),

    getOwnerAnalytics: builder.query<OwnerAnalyticsResponse, DateRange | void>({
      query: (dateRange) => ({
        url: "analytics/owner",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),

    getUserAnalytics: builder.query<UserAnalyticsResponse, DateRange | void>({
      query: (dateRange) => ({
        url: "analytics/user",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),

    getRoleBasedAnalytics: builder.query<
      AdminAnalyticsResponse | OwnerAnalyticsResponse | UserAnalyticsResponse, 
      DateRange | void
    >({
      query: (dateRange) => ({
        url: "analytics",
        params: dateRange ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : undefined,
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

// ====================== EXPORT HOOKS ======================
export const {
  useGetAdminAnalyticsQuery,
  useGetOwnerAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetRoleBasedAnalyticsQuery,
} = analyticsApi;

// ====================== USAGE EXAMPLES ======================
/*
// Example 1: Using role-based analytics in a component
function Dashboard() {
  const { data, error, isLoading } = useGetRoleBasedAnalyticsQuery({
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analytics</div>;
  if (!data?.success) return <div>{data?.message || 'Failed to load analytics'}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {data.data && 'totalUsers' in data.data && (
        // Admin dashboard
        <AdminDashboard stats={data.data} />
      )}
      {data.data && 'totalRooms' in data.data && (
        // Owner dashboard
        <OwnerDashboard stats={data.data} />
      )}
      {data.data && 'totalBookings' in data.data && (
        // User dashboard
        <UserDashboard stats={data.data} />
      )}
    </div>
  );
}

// Example 2: Using specific role endpoint
function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminAnalyticsQuery();

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <h2>Total Users: {data?.data?.totalUsers}</h2>
      <RevenueChart data={data?.data?.revenueTrends || []} />
    </div>
  );
}
*/