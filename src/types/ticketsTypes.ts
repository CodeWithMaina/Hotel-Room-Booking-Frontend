export type TTicket = {
  ticketId: number;
  userId: number;
  subject: string;
  description: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
  updatedAt: string;
};