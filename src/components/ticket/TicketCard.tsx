import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Reply,
  UserRound,
  ChevronDown,
  Mail,
  Trash2,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDeleteTicketMutation } from "../../features/api";
import { cn } from "../../lib/utils";
import type { TTicket } from "../../types/ticketsTypes";

const MySwal = withReactContent(Swal);

interface Props {
  ticket: TTicket;
  onClick: () => void;
}

export const TicketCard = ({ ticket, onClick }: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [deleteTicket] = useDeleteTicketMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const toastId = toast.loading("Deleting...");
      try {
        await deleteTicket(ticket.ticketId).unwrap();
        toast.success("Deleted successfully", {
          id: toastId,
          icon: <CheckCircle2 className="text-green-600" />,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Failed to delete ticket", {
          id: toastId,
          icon: <XCircle className="text-red-600" />,
        });
      }
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className={cn(
          "bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 cursor-pointer group",
          ticket.status === "Open"
            ? "border-blue-600 hover:bg-blue-50"
            : "border-green-600 hover:bg-green-50"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={22} />
            <h3 className="text-lg font-semibold text-gray-700">
              {ticket.subject}
            </h3>
          </div>
          <div className="text-xs text-gray-500 text-right">
            #{ticket.ticketId}
            <br />
            {format(new Date(ticket.createdAt), "PPp")}
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {ticket.description}
        </p>

        {/* User Info */}
        {ticket.user && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
            <UserRound size={14} className="text-gray-400" />
            {ticket.user.firstName} {ticket.user.lastName}
            <Mail size={12} className="ml-2 text-gray-400" />
            <span className="ml-1 truncate">{ticket.user.email}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {ticket.status === "Open" ? (
              <AlertCircle className="text-blue-600" size={16} />
            ) : (
              <CheckCircle2 className="text-green-600" size={16} />
            )}
            <span
              className={cn(
                "font-medium",
                ticket.status === "Open" ? "text-blue-600" : "text-green-600"
              )}
            >
              {ticket.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {ticket.reply && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReplyModalOpen(true);
                }}
                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition"
              >
                <Reply size={14} />
                View Reply
                <ChevronDown size={14} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && ticket.reply && (
        <dialog
          className="modal modal-open"
          onClick={() => setIsReplyModalOpen(false)}
        >
          <div
            className="modal-box max-w-lg bg-white rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="text-green-600" size={20} />
              <h3 className="text-lg font-bold text-gray-700">Admin Reply</h3>
            </div>

            <div className="text-sm text-gray-700 whitespace-pre-line bg-green-100 p-4 rounded-lg shadow-inner">
              {ticket.reply}
            </div>

            <p className="text-right text-xs text-green-600 mt-2">— Admin</p>

            <form method="dialog" className="mt-4">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="btn btn-sm btn-outline w-full"
              >
                Close
              </button>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};
