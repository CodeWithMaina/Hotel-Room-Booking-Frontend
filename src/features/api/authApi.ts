import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi ({
    reducerPath: "authApi",
    tagTypes: ["Auth"],
    baseQuery:  fetchBaseQuery({baseUrl: "http://localhost:5000/api/"}),
    endpoints: (builder) => ({
        // Login User
        loginUser : builder.mutation({
            query: (userData) => ({
                url: "login",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Auth"]
        }),
        // Register User
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Auth"]
        })
    })
});