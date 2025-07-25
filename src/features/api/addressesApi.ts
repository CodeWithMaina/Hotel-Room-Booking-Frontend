import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TAddressEntity } from "../../types/entityTypes";
import type { TAddress } from "../../types/addressTypes";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL}),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => "addresses",
      providesTags: ["Address"],
    }),
    getAddressById: builder.query({
      query: (id) => `address/${id}`,
      providesTags: (_, __, id) => [{ type: "Address", id }],
    }),
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: "address",
        method: "POST",
        body: newAddress,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, ...patch }) => ({
        url: `address/${addressId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_, __, { addressId }) => [
        { type: "Address", id: addressId },
      ],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    getEntityAddress: builder.query<
      TAddress[],
      { entityId: number; entityType: TAddressEntity }
    >({
      query: ({ entityId, entityType }) => `address/${entityType}/${entityId}`,
      providesTags: (_, __, { entityId, entityType }) => [
        { type: "Address", entityId: entityId, entityType: entityType },
      ],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetEntityAddressQuery,
} = addressesApi;
