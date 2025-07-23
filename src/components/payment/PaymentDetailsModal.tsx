// PaymentDetailsModal.tsx
import { X } from "lucide-react";
import type { TPaymentSelect } from "../../types/paymentsTypes";

interface Props {
  payment: TPaymentSelect;
  open: boolean;
  onClose: () => void;
  onExport: () => void; // 🆕
}

export const PaymentDetailsModal = ({ payment, open, onClose, onExport }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-base-100 w-full max-w-md p-6 rounded-lg relative shadow-xl animate-fade-in border border-base-200">
        <button className="absolute top-3 right-3 text-muted hover:text-base-content transition" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-heading font-semibold text-base-content mb-4">
          Payment Details
        </h3>

        <ul className="space-y-2 text-sm text-base-content">
          <li><strong>Transaction ID:</strong> {payment.transactionId}</li>
          <li><strong>Amount:</strong> ${payment.amount}</li>
          <li><strong>Status:</strong> {payment.paymentStatus}</li>
          <li><strong>Method:</strong> {payment.paymentMethod}</li>
          <li><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</li>
          <li><strong>Booking ID:</strong> {payment.booking.bookingId}</li>
          <li><strong>Check-in:</strong> {payment.booking.checkInDate}</li>
          <li><strong>Check-out:</strong> {payment.booking.checkOutDate}</li>
        </ul>

        {/* 🆕 PDF Download Button */}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-sm btn-outline btn-success" onClick={onExport}>
            Download PDF
          </button>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
