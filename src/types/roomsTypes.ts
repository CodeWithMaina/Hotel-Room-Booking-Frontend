export type TRoom = {
  roomId: number;
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  amenities?: string[];
  isAvailable: boolean;
  createdAt: string;
};