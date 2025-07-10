import { useState } from "react";
import { useGetTicketsQuery } from "../../features/api";
import { HeaderCard } from "../../components/dashboard/HeaderCard";
import { TicketCard } from "../../components/ticket/TicketCard";
import { TicketReplyModal } from "../../components/ticket/TicketReplyModal";
import { TicketFilters } from "../../components/ticket/TicketFilters";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Loader } from "lucide-react";

export const Ticket = () => {
  const { data: tickets, isLoading } = useGetTicketsQuery();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { userType } = useSelector((state: RootState) => state.auth);
  const [filters, setFilters] = useState({ status: "", user: "" });

  const filteredTickets = tickets?.filter((ticket: any) => {
    const matchesStatus = filters.status
      ? ticket.status === filters.status
      : true;

    const matchesUser = filters.user
      ? `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`
          .toLowerCase()
          .includes(filters.user.toLowerCase())
      : true;

    return matchesStatus && matchesUser;
  });

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen p-6 space-y-6">
      {/* Page Header */}
      <HeaderCard title="Manage Customer Tickets" />

      {/* Filters */}
      <div className="rounded-xl bg-white shadow p-4 border border-slate-200">
        <TicketFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Ticket List */}
      <div className="grid gap-4 mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredTickets?.length ? (
          filteredTickets.map((ticket: any) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 text-lg">
            No tickets match the current filters.
          </div>
        )}
      </div>

      {/* Reply Modal for Admins */}
      {selectedTicket && userType === "admin" && (
        <TicketReplyModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
