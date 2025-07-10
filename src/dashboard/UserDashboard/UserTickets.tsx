import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserTicketsQuery } from "../../features/api";
import { HeaderCard } from "../../components/dashboard/HeaderCard";
import { TicketCard } from "../../components/ticket/TicketCard";
import { TicketFormModal } from "../../components/ticket/TicketFormModal";
import { TicketReplyModal } from "../../components/ticket/TicketReplyModal";
import { Plus, Loader } from "lucide-react";
import type { RootState } from "../../app/store";
import type { TTicket } from "../../types/ticketsTypes";

export const UserTickets = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TTicket | null>(null);
  const { userId, userType } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);
  const { data: tickets, isLoading } = useGetUserTicketsQuery(id);

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen p-6 space-y-6">
      <HeaderCard title="Your Support Tickets" />

      {/* Create Ticket Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="btn bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all duration-300 flex gap-2 items-center"
        >
          <Plus size={18} /> Create New Ticket
        </button>
      </div>

      {/* Ticket Grid */}
      <section className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        ) : tickets?.length ? (
          tickets.map((ticket: TTicket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg py-12">
            No tickets yet. You can create one above.
          </div>
        )}
      </section>

      {/* Ticket Creation Modal */}
      <TicketFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Admin Ticket Reply Modal */}
      {selectedTicket && userType === "admin" && (
        <TicketReplyModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
