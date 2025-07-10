import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareReply, SendHorizonal, Info } from "lucide-react";

import {
  replyTicketSchema,
  type TReplyTicketSchema,
} from "../../validation/ticketSchema";
import type { TTicket } from "../../types/ticketsTypes";
import { useUpdateTicketMutation } from "../../features/api";
import { LoadingSpinner } from "../loadingSpinner";

interface Props {
  ticket: TTicket;
  onClose: () => void;
}

export const TicketReplyModal = ({ ticket, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TReplyTicketSchema>({
    resolver: zodResolver(replyTicketSchema),
    defaultValues: {
      reply: ticket.reply || "",
      status: ticket.status,
    },
  });

  const [updateTicket] = useUpdateTicketMutation();

  const onSubmit = async (data: TReplyTicketSchema) => {
    const submitData = {
      ticketId: ticket.ticketId,
      ticketData: {
        reply: data.reply,
        status: data.status,
      },
    };

    try {
      await updateTicket(submitData).unwrap();
      toast.success("✅ Ticket updated successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error("❌ Failed to update ticket.");
      console.error(err);
    }
  };

  // Close on outside click
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <dialog className="modal modal-open z-50 bg-black/30">
      <AnimatePresence>
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="modal-box max-w-2xl rounded-xl p-6 shadow-lg bg-white border border-blue-100"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <MessageSquareReply size={20} />
              Reply to Ticket #{ticket.ticketId}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Ticket Info */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-700 font-medium">{ticket.subject}</p>
            <p className="text-sm text-gray-500">{ticket.description}</p>

            {ticket.reply && (
              <div className="mt-3 bg-slate-100 border border-blue-100 p-4 rounded-md">
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                  <Info size={16} />
                  Previous Reply
                </div>
                <p className="text-sm text-blue-600 mt-1 whitespace-pre-line">
                  {ticket.reply}
                </p>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label text-gray-700 font-medium">Reply</label>
              <textarea
                {...register("reply")}
                placeholder="Type your response..."
                rows={4}
                className="textarea textarea-bordered w-full bg-slate-50 text-gray-700 border-blue-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.reply && (
                <p className="text-red-500 text-sm mt-1">{errors.reply.message}</p>
              )}
            </div>

            <div>
              <label className="label text-gray-700 font-medium">Status</label>
              <select
                {...register("status")}
                className="select select-bordered w-full bg-slate-50 text-gray-700 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm bg-slate-100 text-gray-700 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
              >
                <SendHorizonal size={16} />
                {isSubmitting ? <LoadingSpinner/> : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </dialog>
  );
};
