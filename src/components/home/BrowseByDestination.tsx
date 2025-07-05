import { FadeIn } from "../animations/FadeIn";

interface Destination {
  name: string;
  image: string;
}

const destinations: Destination[] = [
  {
    name: "Nairobi",
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Mombasa",
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Diani",
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Malindi",
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Naivasha",
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const BrowseByDestination = () => {
  return (
    <section className="bg-gradient-to-br from-slate-100 to-slate-200 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-4">
            Browse by Destination
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Explore top locations across Kenya and beyond. Start your journey by
            choosing a destination.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {destinations.map((city, idx) => (
            <FadeIn key={idx} delay={0.1 * idx}>
              <div className="relative rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition duration-300 cursor-pointer">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-48 w-full object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
                <div className="absolute bottom-4 left-4 text-white z-10">
                  <h3 className="text-lg font-bold">{city.name}</h3>
                  <span className="text-sm text-gray-200">View Hotels</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
