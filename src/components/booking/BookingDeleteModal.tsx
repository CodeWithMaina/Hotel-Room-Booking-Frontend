export const BookingDeleteModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => (
  <dialog className={`modal ${show ? 'modal-open' : ''}`}> 
    <div className="modal-box">
      <h3 className="font-bold text-lg">Confirm Delete</h3>
      <p className="py-4">Are you sure you want to delete this booking?</p>
      <div className="modal-action">
        <button className="btn btn-error" onClick={onClose}>Delete</button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </dialog>
);