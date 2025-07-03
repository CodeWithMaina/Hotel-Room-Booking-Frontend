export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone?: string;
  address?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: string;
  updatedAt: string;
};