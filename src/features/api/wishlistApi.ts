import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TWishlistItem } from "../../types/wishlistTypes";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlistByUserId: builder.query<TWishlistItem[], number>({
      query: (userId) => `wishlist/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ wishlistId }) => ({
                type: "Wishlist" as const,
                id: wishlistId,
              })),
              { type: "Wishlist", id: "LIST" },
            ]
          : [{ type: "Wishlist", id: "LIST" }],
    }),
    addToWishlist: builder.mutation<
      TWishlistItem,
      { userId: number; roomId: number }
    >({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    deleteFromWishlist: builder.mutation<void, number>({
      query: (wishlistId) => ({
        url: `wishlist/${wishlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, wishlistId) => [
        { type: "Wishlist", id: wishlistId },
        { type: "Wishlist", id: "LIST" },
      ],
    }),
    checkInWishlist: builder.query<
      { exists: boolean },
      { userId: number; roomId: number }
    >({
      query: ({ userId, roomId }) => ({
        url: "wishlist",
        params: { userId, roomId },
      }),
      providesTags: (result, error, { roomId }) => [
        { type: "Wishlist", id: `CHECK-${roomId}` },
      ],
    }),
  }),
});

export const {
  useGetWishlistByUserIdQuery,
  useAddToWishlistMutation,
  useDeleteFromWishlistMutation,
  useCheckInWishlistQuery,
} = wishlistApi;
