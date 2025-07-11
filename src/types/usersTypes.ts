export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  password?: string;
  contactPhone?: string;
  address?: string;
  role: "user" | "owner" | "admin";
  createdAt?: string;
  updatedAt?: string;
};

export type TUserForm = {
  firstName: string;
  lastName: string;
  profileImage?: string;
  email: string;
  contactPhone?: string;
  role?: TUserTypes;
};

export type TUserTypes = "user" | "owner" | "admin";
