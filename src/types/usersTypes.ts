// export type TUser = {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   profileImage: string;
//   bio:string;
//   email: string;
//   password?: string;
//   contactPhone?: string;
//   address?: string;
//   role: "user" | "owner" | "admin";
//   createdAt?: string;
//   updatedAt?: string;
// };

export type TUserForm = {
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio:string;
  email: string;
  contactPhone?: string;
  role?: TUserTypes;
};

export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  profileImage?: string;
  bio?: string;
  role: "user" | "owner" | string;
};

export type TUserTypes = "user" | "owner" | "admin";
