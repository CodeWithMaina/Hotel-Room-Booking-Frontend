import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ---------------- TYPES ----------------
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  message: string; // e.g., "Message sent successfully"
}

export interface ContactError {
  status: number;
  data?: {
    error?: string;
    message?: string;
    [key: string]: unknown;
  };
}

// ---------------- API ----------------
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<ContactResponse, ContactFormData>({
      query: (formData) => ({
        url: "contact", // Final URL: `${VITE_API_BASE_URL}/contact`
        method: "POST",
        body: formData,
      }),
      transformErrorResponse: (response: ContactError) => {
        return {
          status: response.status,
          data: {
            error: response.data?.error || response.data?.message || "An error occurred while sending your message.",
          },
        };
      },
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
