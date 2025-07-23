import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const amenitiesApi = createApi({
  reducerPath: "amenitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["Amenity"],
  endpoints: (builder) => ({
    getAmenities: builder.query({
      query: () => "amenities",
      providesTags: ["Amenity"],
    }),
    getAmenityById: builder.query({
      query: (id) => `amenity/${id}`,
      providesTags: (result, error, id) => [{ type: "Amenity", id }],
    }),
    createAmenity: builder.mutation({
      query: (newAmenity) => ({
        url: "amenity",
        method: "POST",
        body: newAmenity,
      }),
      invalidatesTags: ["Amenity"],
    }),
    updateAmenity: builder.mutation({
      query: ({ amenityId, ...patch }) => ({
        url: `amenity/${amenityId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { amenityId }) => [
        { type: "Amenity", id: amenityId },
      ],
    }),
    deleteAmenity: builder.mutation<void, number>({
      query: (id) => ({
        url: `amenity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Amenity"],
    }),
  }),
});

export const {
  useGetAmenitiesQuery,
  useGetAmenityByIdQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
} = amenitiesApi;
