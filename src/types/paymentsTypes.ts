export type TPayment = {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
};