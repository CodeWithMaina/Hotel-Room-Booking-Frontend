import { useState } from "react";
import { BookingCard } from "../../components/booking/BookingCard";
import { BookingEditModal } from "../../components/booking/BookingEditModal";
import { BookingDeleteModal } from "../../components/booking/BookingDeleteModal";
// import HeaderCard from "../../components/dashboard/HeaderCard";

export const Bookings = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* <HeaderCard/> */}
      <section className="px-6 py-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Booking List</h2>
          <p className="text-sm text-gray-500">Lorem ipsum lorem ayuhn</p>
        </div>
        <BookingCard
          onEdit={() => setShowEdit(true)}
          onDelete={() => setShowDelete(true)}
        />
      </section>
      <BookingEditModal show={showEdit} onClose={() => setShowEdit(false)} />
      <BookingDeleteModal show={showDelete} onClose={() => setShowDelete(false)} />
    </main>
  );
};
