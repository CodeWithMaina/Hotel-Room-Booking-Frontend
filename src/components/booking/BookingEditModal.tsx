export const BookingEditModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => (
  <dialog className={`modal ${show ? 'modal-open' : ''}`}> 
    <div className="modal-box">
      <h3 className="font-bold text-lg">Edit Booking</h3>
      <p className="py-4">This is a placeholder edit form.</p>
      <div className="modal-action">
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </dialog>
);