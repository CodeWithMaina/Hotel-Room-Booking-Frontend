import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TPayment } from "../../types/paymentsTypes";


export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<TPayment[], void>({
      query: () => 'payments',
      providesTags: ['Payment'],
    }),
    getPaymentById: builder.query<TPayment, number>({
      query: (id) => `payment/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (newPayment) => ({
        url: 'payment',
        method: 'POST',
        body: newPayment,
      }),
      invalidatesTags: ['Payment'],
    }),
    updatePayment: builder.mutation<TPayment, Partial<TPayment> & { paymentId: number }>({
      query: ({ paymentId, ...patch }) => ({
        url: `payment/${paymentId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { paymentId }) => [{ type: 'Payment', id: paymentId }],
    }),
    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `payment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;