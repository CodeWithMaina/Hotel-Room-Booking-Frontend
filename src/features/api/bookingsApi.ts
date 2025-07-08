import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TBooking, TBookingForm } from "../../types/bookingsTypes";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // Get all bookings
    getBookings: builder.query<TBooking[], void>({
      query: () => "bookings",
      providesTags: ["Booking"],
    }),
    // Get booking for a single user
    getBookingByUserId: builder.query({
      query: (userId:number) => `bookings/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Booking", userId }],
    }),
    // Get a single booking with ID
    getBookingById: builder.query<TBooking, number>({
      query: (userId) => `booking/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Booking", userId }],
    }),
    // Create booking
    createBooking: builder.mutation<TBookingForm, Partial<TBookingForm>>({
      query: (newBooking) => ({
        url: "booking",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: ["Booking"],
    }),
    updateBooking: builder.mutation<
      TBookingForm,
      Partial<TBookingForm> & { bookingId: number }
    >({
      query: ({ bookingId, ...patch }) => ({
        url: `booking/${bookingId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
      ],
    }),
    deleteBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetBookingByUserIdQuery,
} = bookingsApi;
