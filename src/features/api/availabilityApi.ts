import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TRoom } from "../../types/roomsTypes";
import type { AvailabilityParams, AvailabilityResponse } from "../../types/availabilityTypes";

export const availabilityApi = createApi({
  reducerPath: "availabilityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["Availability"],
  endpoints: (builder) => ({
    checkAvailability: builder.query<TRoom[], AvailabilityParams>({
      query: ({ checkInDate, checkOutDate, capacity }) => {
        const params: Record<string, string> = {
          checkInDate,
          checkOutDate,
        };

        if (capacity !== undefined) {
          params.capacity = String(capacity);
        }

        return {
          url: "rooms/availability",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: AvailabilityResponse) => response.data,
      providesTags: ["Availability"],
    }),
  }),
});

export const {
  useCheckAvailabilityQuery,
  useLazyCheckAvailabilityQuery,
} = availabilityApi;
