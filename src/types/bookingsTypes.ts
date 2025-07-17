// export type TBooking = {
//   bookingId: number | undefined;
//   bookingStatus: string;
//   checkInDate: string;
//   checkOutDate: string;
//   totalAmount: string;
//   room: {
//     roomType: string;
//     capacity: number;
//     pricePerNight: string;
//     thumbnail: string;
//     hotelId: number;
//     roomId: number;
//     isAvailable: boolean;
//     createdAt: string;
//   };
// };

import type { TRoom } from "./roomsTypes";

export type TBookingForm = {
  bookingId?: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string | number;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  roomId: number;
  userId: number;
  gallery: string[];
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
    pricePerNight: number;
    thumbnail: string;
    hotelId: number;
    roomId: number;
    isAvailable: boolean;
    createdAt: string;
    gallery: string[];
  };
}

export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  role: string;
};

// export type TRoom = {
//   roomId: number;
//   roomType: string;
//   pricePerNight: string;
//   capacity: number;
//   thumbnail: string;
//   isAvailable: boolean;
//   hotelId: number;
// };

export type TBooking = {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string; // ISO format
  checkOutDate: string; // ISO format
  bookingStatus: "Confirmed" | "Pending" | "Cancelled"; // Optional: Expand if more statuses
  totalAmount: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  user: TUser;
  room: TRoom;
};

// types/paginationTypes.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type TBookingsResponse = Array<{
  bookingId: number;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  totalAmount: string;
  bookingStatus: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactPhone: string;
    address: string;
    role: string;
  };
  room: {
    roomId: number;
    roomType: string;
    hotelId: number;
    pricePerNight: string;
    capacity: number;
    amenities: string;
    isAvailable: boolean;
    gallery: string[];
  };
}>;

export type TBookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface BookingStatusFilterParams extends PaginationParams {
  status?: TBookingStatus[];
}
