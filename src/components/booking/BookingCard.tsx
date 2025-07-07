export const BookingCard = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div className="card w-full max-w-sm bg-white shadow-md">
    <figure className="relative">
      <img
        src="https://i.ibb.co/pzZ49vC/blue-origin-farms.jpg"
        alt="Blue Origin Farms"
        className="object-cover h-48 w-full"
      />
      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
        $200 per night
      </span>
    </figure>
    <div className="card-body text-gray-700">
      <h2 className="card-title">Blue Origin Farms</h2>
      <p className="text-sm text-gray-500 mb-2">Galle, Sri Lanka</p>
      <p className="text-sm">20 Jan - 22 Jan</p>
      <p className="text-sm">02 Days</p>
      <p className="text-sm">Galle to Colombo Road 245, Main Street, Galle.</p>
      <p className="text-sm">Initial Payment $200</p>
      <p className="text-sm">Total Payment $400</p>
      <div className="card-actions justify-end mt-2">
        <button className="btn btn-sm btn-outline btn-primary" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm btn-outline btn-error" onClick={onDelete}>Delete</button>
      </div>
    </div>
  </div>
);