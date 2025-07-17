import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TRoom, TRoomWithAmenities } from "../../types/roomsTypes";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/",credentials: 'include', }),
  tagTypes: ["Room", "RoomAmenity"],
  endpoints: (builder) => ({
    getRooms: builder.query<TRoom[], void>({
      query: () => "rooms",
      providesTags: ["Room"],
    }),
    getRoomById: builder.query<TRoom, number>({
      query: (id) => `room/${id}`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),
    getRoomByHotelId: builder.query<TRoom[], number>({
      query: (id) => `hotel/${id}/rooms`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
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
      invalidatesTags: (result, error, { roomId }) => [
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
        url:`room/${id}/room-details`}),
      providesTags: (result, error, id) => [
        { type: 'RoomAmenity', id }
      ],
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
