import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-gray-700 p-4">
      <AlertTriangle className="w-16 h-16 text-blue-600 mb-4" />
      <h1 className="text-3xl font-bold text-blue-600 mb-2">Oops! Something went wrong.</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};
