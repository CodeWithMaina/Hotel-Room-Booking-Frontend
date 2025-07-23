import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface NewsletterPayload {
  email: string;
}

interface NewsletterResponse {
  message: string;
}

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  }),
  tagTypes: ["Newsletter"],
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation<NewsletterResponse, NewsletterPayload>({
      query: (payload) => ({
        url: "subscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    unsubscribeFromNewsletter: builder.mutation<NewsletterResponse, NewsletterPayload>({
      query: (payload) => ({
        url: "unsubscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
} = newsletterApi;
