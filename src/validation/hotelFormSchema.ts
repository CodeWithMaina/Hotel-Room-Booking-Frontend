import { z } from "zod";

export const hotelFormSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  thumbnail: z.string().url("Enter a valid image URL").optional(),
});

export type HotelFormData = z.infer<typeof hotelFormSchema>;