export type TRoomType = {
    roomTypeId: number;
    name: string;
    description: string;
    createdAt: string;
  };
export type TRoom = {
  roomId: number;
  hotelId: number;
  roomType: TRoomType;
  thumbnail: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities?: string[];
  isAvailable: boolean;
  createdAt: string;
  gallery: string[];
};

export type TEditRoomForm = {
  roomType: TRoomType;
  capacity: number;
  thumbnail: string;
  description: string;
  pricePerNight: number;
  isAvailable: boolean;
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
