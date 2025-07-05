import { User } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";

export const Testimonials = () => {
  const reviews = [
    {
      firstName: "Jane",
      lastName: "Doe",
      testimony: "Loved the hotel. Booking was seamless!",
    },
    {
      firstName: "Brian",
      lastName: "Bree",
      testimony: "Customer support was excellent and very responsive.",
    },
    {
      firstName: "Peter",
      lastName: "Cp",
      testimony: "The booking process was intuitive and fast!",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-gray-700 mb-10 max-w-xl mx-auto">
            Our platform is trusted by hundreds of travelers. Here's what a few of them had to say.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <FadeIn key={idx} delay={0.1 * idx}>
              <div className="card bg-white shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-700">
                      {review.firstName} {review.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Verified Guest</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">“{review.testimony}”</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
