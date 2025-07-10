import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketSchema, type TCreateTicketSchema } from "../../validation/ticketSchema";
import { useCreateTicketMutation } from "../../features/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import toast from "react-hot-toast";
import { X, Send, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../loadingSpinner";

interface Props {
  onClose: () => void;
  show: boolean;
}

export const TicketFormModal = ({ onClose, show }: Props) => {
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      userId: userId ?? undefined,
    },
  });

  const [createTicket] = useCreateTicketMutation();

  const onSubmit = async (data: TCreateTicketSchema) => {
    console.log(data)
    try {
      await createTicket(data).unwrap();
      toast.success("🎫 Ticket submitted successfully!");
      onClose();
      reset();
    } catch (err) {
      toast.error("❌ Failed to create ticket.");
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <dialog open className="modal modal-open z-50">
          <motion.div
            key="ticket-form"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="modal-box bg-white max-w-lg rounded-2xl shadow-xl border border-blue-100 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                <FileText size={20} /> New Support Ticket
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="label text-gray-700 font-medium">Subject <span className="text-red-500">*</span></label>
                <input
  {...register("subject")}
  placeholder="Briefly describe your issue"
  className="input input-bordered w-full bg-slate-50 text-blue-700 placeholder-blue-400 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
/>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="label text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                <textarea
  {...register("description")}
  placeholder="Please provide detailed information about your issue"
  rows={4}
  className="textarea textarea-bordered w-full bg-slate-50 text-blue-700 placeholder-blue-400 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
/>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-sm text-gray-700 bg-slate-100 hover:bg-slate-200"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size={16} />
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
};
