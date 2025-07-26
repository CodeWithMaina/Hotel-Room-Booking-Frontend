import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const reviewSchema = z.object({
  userId: z.number(),
  bookingId: z.number(),
  rating: z.number().min(0).max(5),
  hotelId: z.number().nullable().optional(),
  roomId: z.number().nullable().optional(),
  comment: z.string().optional(),
});

const _reviewUpdateSchema = reviewSchema.partial();
type TReviewUpdateInput = z.infer<typeof _reviewUpdateSchema>;

export type TReviewSelect = {
  reviewId: number;
  userId: number;
  bookingId: number;
  roomId: number | null;
  hotelId: number | null;
  rating: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TReviewInsert = {
  reviewId?: number;
  userId: number;
  bookingId: number;
  roomId?: number | null;
  hotelId?: number | null;
  rating: string;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type ReviewsResponse = TReviewSelect[];
type ReviewResponse = TReviewSelect;
type ReviewsByRoomTypeResponse = TReviewSelect[];

export const validateReviewUpdate = (data: unknown): TReviewUpdateInput => {
  return _reviewUpdateSchema.parse(data);
};

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    // Get all reviews
    getReviews: builder.query<ReviewsResponse, void>({
      query: () => 'reviews',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({ type: 'Review' as const, id: reviewId })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    // Get review by ID
    getReviewById: builder.query<ReviewResponse, number>({
      query: (id) => `reviews/${id}`,
      providesTags: (_, __, id) => [{ type: 'Review', id }],
    }),

    // Create new review
    createReview: builder.mutation<ReviewResponse, TReviewInsert>({
      query: (body) => ({
        url: 'reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),

    // Update review
    updateReview: builder.mutation<ReviewResponse, { id: number; updates: TReviewUpdateInput }>({
      query: ({ id, updates }) => ({
        url: `reviews/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Review', id }],
    }),

    // Delete review
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Review', id }],
    }),

    // Get reviews by room type
    getReviewsByRoomType: builder.query<ReviewsByRoomTypeResponse, number>({
      query: (roomTypeId) => `reviews/room-type/${roomTypeId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({ type: 'Review' as const, id: reviewId })),
              { type: 'Review', id: 'ROOM_TYPE_LIST' },
            ]
          : [{ type: 'Review', id: 'ROOM_TYPE_LIST' }],
    }),

    // Get reviews by user (considering user association)
    getReviewsByUser: builder.query<ReviewsResponse, number>({
      query: (userId) => `reviews/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reviewId }) => ({ type: 'Review' as const, id: reviewId })),
              { type: 'Review', id: 'USER_LIST' },
            ]
          : [{ type: 'Review', id: 'USER_LIST' }],
    }),

    // Get reviews by booking (considering booking association)
    getReviewsByBooking: builder.query<ReviewResponse | null, number>({
      query: (bookingId) => `reviews/booking/${bookingId}`,
      providesTags: (_, __, bookingId) => [
        { type: 'Review', id: `BOOKING_${bookingId}` },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByRoomTypeQuery,
  useGetReviewsByUserQuery,
  useGetReviewsByBookingQuery,
} = reviewApi;