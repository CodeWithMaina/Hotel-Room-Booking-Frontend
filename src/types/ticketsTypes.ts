export interface TTicket {
  ticketId: number;
  userId: number;
  subject: string;
  description: string;
  reply?: string | null;
  status: "Open" | "Resolved";
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    contactPhone?: string | null;
    role: "user" | "owner" | "admin";
  };
}