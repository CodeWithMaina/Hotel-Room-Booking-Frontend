import { useNavigate, useParams } from "react-router";
import { useGetRoomWithAmenitiesQuery } from "../features/api";
import { Loading } from "./Loading";
import { Error } from "./Error";
import {
  Tv,
  Snowflake,
  GlassWater,
  Users,
  CheckCircle,
  XCircle,
  BedDouble,
  Circle
} from "lucide-react";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import type { JSX } from "react";
import { Button } from "../components/Button";

// const MySwal = withReactContent(Swal);

export const RoomDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const navigate = useNavigate();

  const {
    data: roomDetails,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomWithAmenitiesQuery(roomId, {
    skip: !roomId,
    refetchOnMountOrArgChange: true,
  });

  if (isRoomLoading) return <Loading />;
  if (isRoomError || !roomDetails) return <Error />;

  const { room, amenities } = roomDetails;

  const amenityIcons: Record<string, JSX.Element> = {
    TV: <Tv />,
    "Air Conditioning": <Snowflake />,
    "Mini Bar": <GlassWater />,
    "King Bed": <BedDouble />,
  };

  const handleBooking = () => {
    navigate(`/booking/${roomId}`)
    // MySwal.fire({
    //   title: "Confirm Booking",
    //   text: `Book ${room.roomType} for $${room.pricePerNight} per night?`,
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonColor: "#2563EB",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, Book it!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     toast.success("Room booked successfully!");
    //   }
    // });
  };

  return (
    <div className="bg-gradient-to-br lg:px-30 from-slate-100 to-slate-200 min-h-screen px-6 py-10">
      <h1 className="text-center text-3xl font-bold text-blue-600 mb-4">
        {room.roomType}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <img
          src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Main room"
          className="w-full h-64 object-cover rounded-xl col-span-2"
        />
        <div className="grid grid-rows-2 gap-2">
          <img
            src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="bed"
            className="w-full h-32 object-cover rounded-xl"
          />
          <img
            src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="bathroom"
            className="w-full h-32 object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          About this place
        </h2>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Description + Meta Info */}
          <div className="flex-1">
            <p className="text-gray-500 mb-4 leading-relaxed">
              Escape to the serene luxury of the{" "}
              <strong>{room.roomType}</strong> at Blue Origin Farms. Nestled
              over crystal waters, enjoy a king-sized bed, minibar, air
              conditioning, and modern entertainment.
            </p>

            <div className="flex flex-wrap gap-4 text-gray-700 items-center mt-2">
              <div className="flex items-center gap-2">
                <Users className="text-blue-600" size={18} />
                <span>{room.capacity} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                {room.isAvailable ? (
                  <CheckCircle className="text-green-600" size={18} />
                ) : (
                  <XCircle className="text-red-600" size={18} />
                )}
                <span>{room.isAvailable ? "Available" : "Unavailable"}</span>
              </div>
            </div>
          </div>

          {/* Booking Box */}
          <div className="mt-6 md:mt-0 md:w-1/3 flex flex-col gap-4 bg-slate-100 p-6 rounded-xl shadow-sm items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Start Booking
            </h2>
            <p className="text-blue-600 text-lg font-bold">
              ${room.pricePerNight}{" "}
              <span className="text-gray-500 font-normal text-base">
                per night
              </span>
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-40"
              onClick={handleBooking}
              disabled={!room.isAvailable}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Room Amenities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <span className="text-blue-600">
                {amenityIcons[amenity.name] || <Circle />}
              </span>
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          You might also like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Green Lake",
              img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Lagoon Walk",
              img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Egg Clubs",
              img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Sea Kelling",
              img: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          ].map((place, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={place.img}
                alt={place.title}
                className="h-32 w-full object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-gray-700">{place.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
