import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TBooking } from "../../types/bookingsTypes";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<TBooking[], void>({
      query: () => "bookings",
      providesTags: ["Booking"],
    }),
    getBookingById: builder.query<TBooking, number>({
      query: (id) => `booking/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),
    createBooking: builder.mutation<TBooking, Partial<TBooking>>({
      query: (newBooking) => ({
        url: "booking",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: ["Booking"],
    }),
    updateBooking: builder.mutation<
      TBooking,
      Partial<TBooking> & { bookingId: number }
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
} = bookingsApi;
