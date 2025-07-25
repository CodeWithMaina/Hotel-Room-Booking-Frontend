import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TPayment, TPaymentResponse } from "../../types/paymentsTypes";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<TPaymentResponse, void>({
      query: () => "payments",
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<TPayment, number>({
      query: (id) => `payment/${id}`,
      providesTags: (_, __, id) => [{ type: "Payment", id }],
    }),
    getPaymentsByUserId: builder.query<TPaymentResponse, number>({
      query: (userId) => `/payment/user/${userId}`,
    }),
    createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (newPayment) => ({
        url: "payment",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation<
      TPayment,
      Partial<TPayment> & { paymentId: number }
    >({
      query: ({ paymentId, ...patch }) => ({
        url: `payment/${paymentId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { paymentId }) => [
        { type: "Payment", id: paymentId },
      ],
    }),
    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentsByUserIdQuery,
} = paymentsApi;
