// src/api/users/usersApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TUser } from "../../types/usersTypes";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<TUser[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<TUser, number>({
      query: (id) => `user/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: "user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<TUser, Partial<TUser> & { userId: number }>({
      query: ({ userId, ...patch }) => ({
        url: `user/${userId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
