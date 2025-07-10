export type TBooking = {
  bookingId: number | undefined;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  room: {
    roomType: string;
    capacity: number;
    pricePerNight: string;
    hotelId: number;
    roomId: number;
    isAvailable: boolean;
    createdAt: string;
  };
};

export type TBookingForm = {
  bookingId?: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string | number;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  roomId: number;
  userId: number;
};
export interface TSingleBooking {
  bookingId: number | undefined;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  room: {
    roomType: string;
    capacity: number;
    pricePerNight: string;
    hotelId: number;
    roomId: number;
    isAvailable: boolean;
    createdAt: string;
  };
}
