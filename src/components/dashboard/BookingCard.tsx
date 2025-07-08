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
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Booking cancelled successfully.");
      }
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-700">{booking.service}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Pencil className="w-4 h-4 mr-1" /> Modify
          </Button>
          <Button size="sm" variant="primary" onClick={handleCancel}>
            <Trash2 className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {booking.date}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {booking.location}
        </span>
      </div>
    </div>
  );
};