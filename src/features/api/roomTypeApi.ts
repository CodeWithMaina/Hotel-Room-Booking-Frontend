import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

// Zod schemas for validation
export const roomTypeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const updateRoomTypeSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export type RoomDetailsProps = {
  roomTypes: {
    roomTypeId: number;
    name: string;
  }[];
};

// Type definitions
export type TRoomTypeSelect = {
  roomTypeId: number;
  name: string;
  description: string | null;
  createdAt: Date;
};

export type TRoomTypeInsert = {
  roomTypeId?: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
};

// Response and request types
type RoomTypeResponse = TRoomTypeSelect;
type RoomTypesResponse = TRoomTypeSelect[];
type CreateRoomTypeRequest = z.infer<typeof roomTypeSchema>;
type UpdateRoomTypeRequest = z.infer<typeof updateRoomTypeSchema>;

export const roomTypeApi = createApi({
  reducerPath: 'roomTypeApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  tagTypes: ['RoomType'],
  endpoints: (builder) => ({
    // Get all room types
    getRoomTypes: builder.query<RoomTypesResponse, void>({
      query: () => 'room-types',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ roomTypeId }) => ({ 
                type: 'RoomType' as const, 
                id: roomTypeId 
              })),
              { type: 'RoomType', id: 'LIST' },
            ]
          : [{ type: 'RoomType', id: 'LIST' }],
    }),

    // Get single room type by ID
    getRoomTypeById: builder.query<RoomTypeResponse, number>({
      query: (id) => `room-types/${id}`,
      providesTags: (_, __, id) => [{ type: 'RoomType', id }],
    }),

    // Create new room type
    createRoomType: builder.mutation<RoomTypeResponse, CreateRoomTypeRequest>({
      query: (body) => ({
        url: 'room-type',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RoomType', id: 'LIST' }],
    }),

    // Update room type
    updateRoomType: builder.mutation<
      RoomTypeResponse, 
      { id: number; updates: UpdateRoomTypeRequest }
    >({
      query: ({ id, updates }) => ({
        url: `room-types/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'RoomType', id }],
    }),

    // Delete room type
    deleteRoomType: builder.mutation<
      { success: boolean; id: number }, 
      number
    >({
      query: (id) => ({
        url: `room-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'RoomType', id },
        { type: 'RoomType', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetRoomTypesQuery,
  useGetRoomTypeByIdQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
} = roomTypeApi;

// Export types for use in components
export type {
  RoomTypeResponse,
  RoomTypesResponse,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
};