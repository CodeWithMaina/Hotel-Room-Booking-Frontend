import { CheckCircle, ArrowRight, CreditCard, CalendarCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleViewPayment = () => {
    navigate("/user/payment");
  };

  const handleViewBooking = () => {
    navigate("/user/booking-details");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="text-green-500 w-16 h-16" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your payment. Your booking has been confirmed and a receipt has been sent to your email.
        </p>

        <div className="grid gap-4 pt-4">
          <button
            onClick={handleViewPayment}
            className="btn btn-outline btn-success flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            View Payment
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={handleViewBooking}
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
          >
            <CalendarCheck2 className="w-5 h-5" />
            View Booking Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
