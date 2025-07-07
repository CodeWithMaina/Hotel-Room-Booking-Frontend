export type TBooking = {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  // createdAt: string;
  // updatedAt: string;
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
