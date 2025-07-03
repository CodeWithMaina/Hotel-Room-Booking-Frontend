import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { THotel } from "../../types/hotelsTypes";


export const hotelsApi = createApi({
  reducerPath: "hotelsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Hotel"],
  endpoints: (builder) => ({
    getHotels: builder.query<THotel[], void>({
      query: () => 'hotels',
      providesTags: ['Hotel'],
    }),
    getHotelById: builder.query<THotel, number>({
      query: (id) => `hotel/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
    createHotel: builder.mutation<THotel, Partial<THotel>>({
      query: (newHotel) => ({
        url: 'hotel',
        method: 'POST',
        body: newHotel,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation<THotel, Partial<THotel> & { hotelId: number }>({
      query: ({ hotelId, ...patch }) => ({
        url: `hotel/${hotelId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { hotelId }) => [{ type: 'Hotel', id: hotelId }],
    }),
    deleteHotel: builder.mutation<void, number>({
      query: (id) => ({
        url: `hotel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApi;