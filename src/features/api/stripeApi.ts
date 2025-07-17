// stripeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse, WebhookEvent, WebhookResponse } from '../../types/stripeTypes';


export const stripeApi = createApi({
  reducerPath: 'stripeApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<
      CreateCheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (body) => ({
        url: '/create-checkout-session',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payment'],
    }),

    handleWebhook: builder.mutation<
      WebhookResponse,
      WebhookEvent
    >({
      query: (event) => ({
        url: '/webhook',
        method: 'POST',
        body: event,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { 
  useCreateCheckoutSessionMutation,
  useHandleWebhookMutation,
} = stripeApi;