import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Eye, Trash2, FileDown } from "lucide-react";

import {
  useDeletePaymentMutation,
  useGetPaymentsByUserIdQuery,
} from "../../features/api/paymentsApi";
import type { RootState } from "../../app/store";
import type { TPaymentSelect, TPaymentStatus } from "../../types/paymentsTypes";
import { PaymentDetailsModal } from "../../components/payment/PaymentDetailsModal";
import { parseRTKError } from "../../utils/parseRTKError";
import { SkeletonLoader } from "../../components/payment/skeleton/SkeletonLoader";
import { SearchBar } from "../../components/common/SearchBar";
import {
  exportSinglePaymentToPDF,
  exportMultiplePaymentsToPDF,
} from "../../utils/exportPDF";
import { Error } from "../../components/common/Error";

export const UserPayment = () => {
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isError, error, refetch } =
    useGetPaymentsByUserIdQuery(Number(userId));

  const [query, setQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<TPaymentSelect | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  const handleViewDetails = (payment: TPaymentSelect) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleDelete = async (paymentId: number) => {
    const confirm = await Swal.fire({
      title: "Delete Payment?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePayment(paymentId).unwrap();
      toast.success("Payment deleted successfully.");
      refetch();
    } catch (err) {
      const errorMsg = parseRTKError(err);
      toast.error(errorMsg);
    }
  };

  const payments = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const filteredPayments = useMemo(() => {
    const q = query.toLowerCase();
    return payments.filter(
      (p) =>
        p.transactionId?.toLowerCase().includes(q) ||
        p.paymentMethod?.toLowerCase().includes(q) ||
        p.paymentStatus?.toLowerCase().includes(q) ||
        p.booking.bookingId.toString().includes(q)
    );
  }, [query, payments]);

  const handleExportAll = async () => {
    if (filteredPayments.length === 0) {
      toast.error("No payments to export.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Export All Payments?",
      text: `This will download ${filteredPayments.length} payment(s) as a PDF file.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, export",
    });

    if (!confirm.isConfirmed) return;

    exportMultiplePaymentsToPDF(filteredPayments);
    toast.success("PDF export started.");
  };

  if (isLoading) return <SkeletonLoader count={5} />;
  if (isError)
    return <Error message={parseRTKError(error)} showRetry onRetry={refetch} />;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 bg-white rounded-xl shadow-sm border border-base-200 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold font-heading text-base-content">
          Payment History
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Search by ID, method, status..."
              onSearch={setQuery}
              isLoading={isLoading}
            />
          </div>
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={handleExportAll}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-center text-muted py-10">
          No matching payments found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-base-200">
          <table className="table table-zebra w-full text-sm">
            <thead className="bg-base-200 text-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.paymentId} className="hover:bg-base-100">
                  <td className="px-4 py-2 truncate max-w-[160px]">
                    {payment.transactionId ?? "N/A"}
                  </td>
                  <td className="text-primary font-medium">
                    ${payment.amount}
                  </td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-sm border bg-base-200 text-muted">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm capitalize text-white ${
                        payment.paymentStatus ===
                        ("Confirmed" as TPaymentStatus)
                          ? "bg-success"
                          : payment.paymentStatus === "Pending"
                          ? "bg-warning text-base-content"
                          : "bg-error"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-xs btn-outline btn-info"
                        onClick={() => handleViewDetails(payment)}
                        disabled={isDeleting}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-xs btn-outline btn-error"
                        onClick={() => handleDelete(payment.paymentId)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          open={showModal}
          onClose={() => setShowModal(false)}
          onExport={() => exportSinglePaymentToPDF(selectedPayment)}
        />
      )}
    </div>
  );
};
