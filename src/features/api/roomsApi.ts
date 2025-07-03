import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TRoom } from "../../types/roomsTypes";


export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    getRooms: builder.query<TRoom[], void>({
      query: () => 'rooms',
      providesTags: ['Room'],
    }),
    getRoomById: builder.query<TRoom, number>({
      query: (id) => `room/${id}`,
      providesTags: (result, error, id) => [{ type: 'Room', id }],
    }),
    createRoom: builder.mutation<TRoom, Partial<TRoom>>({
      query: (newRoom) => ({
        url: 'room',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation<TRoom, Partial<TRoom> & { roomId: number }>({
      query: ({ roomId, ...patch }) => ({
        url: `room/${roomId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),
    deleteRoom: builder.mutation<void, number>({
      query: (id) => ({
        url: `room/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;