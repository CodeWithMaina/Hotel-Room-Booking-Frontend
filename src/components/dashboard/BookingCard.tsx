import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button } from "../Button";

export const BookingCard = () => {
  const booking = {
    service: "Beach Resort Getaway",
    location: "Diani, Kenya",
    date: "2025-08-20",
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FCA311",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Booking cancelled successfully.");
      }
    });
  };

  return (
    <div className="bg-[#03071E] border border-[#14213D] text-white rounded-2xl px-6 py-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-white tracking-wide">
          {booking.service}
        </h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-[#FCA311] hover:bg-[#14213D]"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Modify
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleCancel}
            className="bg-[#FCA311] text-black hover:bg-[#e6940d]"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap gap-4 text-sm text-[#E5E5E5]/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FCA311]" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FCA311]" />
          <span>{booking.location}</span>
        </div>
      </div>
    </div>
  );
};
