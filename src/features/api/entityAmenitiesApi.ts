import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const entityAmenitiesApi = createApi({
  reducerPath: "entityAmenitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  tagTypes: ["EntityAmenity"],
  endpoints: (builder) => ({
    getEntityAmenities: builder.query({
      query: () => "entity-amenities",
      providesTags: ["EntityAmenity"],
    }),
    getEntityAmenityById: builder.query({
      query: (id) => `entity-amenity/${id}`,
      providesTags: (_, __, id) => [{ type: "EntityAmenity", id }],
    }),
    createEntityAmenity: builder.mutation({
      query: (newEntityAmenity) => ({
        url: "entity-amenity",
        method: "POST",
        body: newEntityAmenity,
      }),
      invalidatesTags: ["EntityAmenity"],
    }),
    updateEntityAmenity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `entity-amenity/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "EntityAmenity", id },
      ],
    }),
    deleteEntityAmenity: builder.mutation<void, number>({
      query: (id) => ({
        url: `entity-amenity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EntityAmenity"],
    }),
  }),
});

export const {
  useGetEntityAmenitiesQuery,
  useGetEntityAmenityByIdQuery,
  useCreateEntityAmenityMutation,
  useUpdateEntityAmenityMutation,
  useDeleteEntityAmenityMutation,
} = entityAmenitiesApi;
