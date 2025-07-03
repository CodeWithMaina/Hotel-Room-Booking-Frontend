import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => 'addresses',
      providesTags: ['Address'],
    }),
    getAddressById: builder.query({
      query: (id) => `address/${id}`,
      providesTags: (result, error, id) => [{ type: 'Address', id }],
    }),
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: 'address',
        method: 'POST',
        body: newAddress,
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, ...patch }) => ({
        url: `address/${addressId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { addressId }) => [{ type: 'Address', id: addressId }],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `address/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;