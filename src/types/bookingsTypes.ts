export type TBooking = {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
};