import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TRoom, TRoomWithAmenities } from "../../types/roomsTypes";

export const roomsApi = createApi({
  reducerPath: "roomsApi",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["Room", "RoomAmenity"],
  endpoints: (builder) => ({
    getRooms: builder.query<TRoom[], void>({
      query: () => "rooms",
      providesTags: ["Room"],
    }),
    getRoomById: builder.query<TRoom, number>({
      query: (id) => `room/${id}`,
      providesTags: (_, __, id) => [{ type: "Room", id }],
    }),
    getRoomByHotelId: builder.query<TRoom[], number>({
      query: (id) => `hotel/${id}/rooms`,
      providesTags: (_, __, id) => [{ type: "Room", id }],
    }),
    createRoom: builder.mutation<TRoom, Partial<TRoom>>({
      query: (newRoom) => ({
        url: "room",
        method: "POST",
        body: newRoom,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation<TRoom, Partial<TRoom> & { roomId: number }>({
      query: ({ roomId, ...patch }) => ({
        url: `room/${roomId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { roomId }) => [
        { type: "Room", id: roomId },
      ],
    }),
    deleteRoom: builder.mutation<void, number>({
      query: (id) => ({
        url: `room/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),
    getRoomWithAmenities: builder.query<TRoomWithAmenities, number>({
      query: (id) => ({
        url: `room/${id}/room-details`,
      }),
      providesTags: (_, __, id) => [{ type: "RoomAmenity", id }],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomByHotelIdQuery,
  useGetRoomWithAmenitiesQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
