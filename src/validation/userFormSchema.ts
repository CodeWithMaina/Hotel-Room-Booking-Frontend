import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  contactPhone: z.string().optional(),
  role: z.enum(["user", "owner", "admin"]),
});

export type TUserForm = z.infer<typeof userFormSchema>;
