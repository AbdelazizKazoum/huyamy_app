import { z } from "zod";

// Define the validation schema for the checkout form
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
});

// Define the shape of the state object that our Server Action will return
export type FormState = {
  message: string;
  errors?: {
    fullName?: string[];
    phone?: string[];
    address?: string[];
  };
};
