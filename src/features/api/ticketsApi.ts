import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TTicket } from "../../types/ticketsTypes";


export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    getTickets: builder.query<TTicket[], void>({
      query: () => 'tickets',
      providesTags: ['Ticket'],
    }),
    getTicketById: builder.query<TTicket, number>({
      query: (id) => `ticket/${id}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    createTicket: builder.mutation<TTicket, Partial<TTicket>>({
      query: (newTicket) => ({
        url: 'ticket',
        method: 'POST',
        body: newTicket,
      }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicket: builder.mutation<TTicket, Partial<TTicket> & { ticketId: number }>({
      query: ({ ticketId, ...patch }) => ({
        url: `ticket/${ticketId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `ticket/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;