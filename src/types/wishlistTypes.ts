export interface TWishlistItem {
  wishlistId: number;
  userId: number;
  roomId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  room: {
    roomId: number;
    hotelId: number;
    roomType: string;
    pricePerNight: string;
    capacity: number;
    thumbnail: string;
    gallery: string[];
    isAvailable: boolean;
    createdAt: string | Date;
  };
};