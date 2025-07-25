// src/features/payment/paymentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mpaymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/payments',
    prepareHeaders: (headers) => {
      // Add authorization header if needed
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    confirmPayment: builder.mutation({
      query: (sessionId) => ({
        url: '/confirm',
        method: 'POST',
        body: { sessionId },
      }),
      invalidatesTags: ['Payment'],
    }),
    getPaymentDetails: builder.query({
      query: (paymentId) => `/${paymentId}`,
      providesTags: (paymentId) => [{ type: 'Payment', id: paymentId }],
    }),
  }),
});

export const { 
  useConfirmPaymentMutation, 
  useGetPaymentDetailsQuery 
} = mpaymentApi;