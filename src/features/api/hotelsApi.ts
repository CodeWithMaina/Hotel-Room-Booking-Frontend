import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  THotel,
  THotelAddress,
  THotelAmenityDetail,
  THotelEntityAmenity,
} from "../../types/hotelsTypes";

export const hotelsApi = createApi({
  reducerPath: "hotelsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["Hotel", "HotelAddress", "HotelAmenity"],
  endpoints: (builder) => ({
    getHotels: builder.query<THotel[], void>({
      query: () => "hotels",
      providesTags: ["Hotel"],
    }),
    getHotelById: builder.query({
      query: (id) => `hotel/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotel", id }],
    }),
    createHotel: builder.mutation({
      query: (newHotel) => ({
        url: "hotel",
        method: "POST",
        body: newHotel,
      }),
      invalidatesTags: ["Hotel"],
    }),
    updateHotel: builder.mutation<
      THotel,
      { hotelId: number } & Partial<THotel>
    >({
      query: ({ hotelId, ...patch }) => ({
        url: `hotel/${hotelId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { hotelId }) => [
        { type: "Hotel", id: hotelId },
      ],
    }),

    deleteHotel: builder.mutation<void, number>({
      query: (id) => ({
        url: `hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotel"],
    }),
    // Hotel Address endpoint
    getHotelAddress: builder.query({
      query: (hotelId) => `hotel/${hotelId}/address`,
      providesTags: (result, error, hotelId) => [
        { type: "HotelAddress", id: hotelId },
      ],
    }),

    // Hotel Entity Amenities endpoint
    getHotelEntityAmenities: builder.query({
      query: (hotelId) => `hotel/${hotelId}/entity-amenities`,
      providesTags: (result, error, hotelId) => [
        { type: "HotelAmenity", id: hotelId },
      ],
    }),

    // Hotel Amenity Details endpoint
    getHotelAmenityDetails: builder.query({
      query: (hotelId) => `hotel/${hotelId}/amenities`,
      providesTags: (result, error, hotelId) => [
        { type: "HotelAmenity", id: hotelId },
      ],
    }),

    // Combined Hotel Details endpoint(Used)
    getHotelFullDetails: builder.query<
      {
        hotel: THotel;
        address: THotelAddress;
        amenities: THotelAmenityDetail[];
        entityAmenities: THotelEntityAmenity[];
      },
      number
    >({
      query: (hotelId) => `hotel/${hotelId}/details`,
      providesTags: (result, error, hotelId) => [
        { type: "Hotel", id: hotelId },
        { type: "HotelAddress", id: hotelId },
        { type: "HotelAmenity", id: hotelId },
      ],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetHotelFullDetailsQuery,
} = hotelsApi;
