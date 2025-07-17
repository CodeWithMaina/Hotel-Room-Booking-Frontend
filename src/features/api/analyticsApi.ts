
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AdminAnalyticsSummary } from '../../types/analyticsTypes';

export interface MonthlyMetric {
  month: string;
  total?: number;
  count?: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalUsers: number;
  totalBookings: number;
  openTickets: number;
  monthlySpending: MonthlyMetric[];
  monthlyBookingFrequency: MonthlyMetric[];
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  tagTypes: ['Analytics'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUserAnalyticsSummary: builder.query<AnalyticsSummary, void>({
      query: () => '/user/analytics/summary',
      providesTags: ['Analytics'],
    }),
    getAdminAnalyticsSummary: builder.query<AdminAnalyticsSummary, void>({
      query: () => '/admin/analytics/summary',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetUserAnalyticsSummaryQuery,
  useGetAdminAnalyticsSummaryQuery,
  util: { invalidateTags },
} = analyticsApi;
