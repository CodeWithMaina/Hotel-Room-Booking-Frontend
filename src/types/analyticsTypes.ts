export interface MonthlyBooking {
  month: string;
  bookings: number;
}

export interface RoomOccupancy {
  available: number;
  occupied: number;
}

export interface RecentBooking {
  id: number;
  guest: string;
  room: string;
  date: string;
}

export interface NewUser {
  name: string;
  email: string;
  joined: string;
}

export interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: string;
  totalHotels: number;
}

export interface MonthlyBookingsData {
  rows: MonthlyBooking[];
}

export interface Charts {
  monthlyBookings: MonthlyBookingsData;
  roomOccupancy: RoomOccupancy;
}

export interface RecentActivity {
  newUsers: NewUser[];
  recentBookings: RecentBooking[];
}

export interface SystemHealth {
  uptime: string;
  securityStatus: string;
  serverLoad: string;
}

export interface AdminAnalyticsSummary {
  success: boolean;
  data: Data;
}

export interface Data {
  stats: Stats;
  charts: Charts;
  recentActivity: RecentActivity;
  systemHealth?: SystemHealth;
}