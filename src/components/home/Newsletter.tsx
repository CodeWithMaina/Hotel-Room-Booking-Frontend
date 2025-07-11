export const Newsletter = () => (
  <div className="py-16 px-6 bg-white text-center">
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl text-black font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-sm text-gray-600 mb-6">Don't miss this opportunity. Subscribe now</p>
      <div className="flex flex-col text-gray-900 sm:flex-row items-center gap-3">
        <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-2 rounded border border-gray-300 text-sm outline-none w-full" />
        <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold rounded w-full sm:w-auto">SUBSCRIBE</button>
      </div>
    </div>
  </div>
);