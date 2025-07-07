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

export type TRoomWithAmenities = {
  room:TRoom
  amenities: TRoomAmenity[];
  entityAmenities: TRoomEntityAmenity[];
};

export type TRoomAmenity = {
  amenityId: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string | Date;
};

export type TRoomEntityAmenity = {
  id: number;
  amenityId: number;
  entityId: number;
  entityType: "room";
  createdAt: string | Date;
};
