import { z } from "zod";

// Client-side schema with confirmPassword
export const signUpSchema = z
  .object({
    displayName: z.string().min(2, { message: "auth.nameRequired" }),
    email: z.string().email({ message: "auth.emailRequired" }),
    password: z.string().min(6, { message: "auth.passwordRequired" }),
    confirmPassword: z
      .string()
      .min(6, { message: "auth.confirmPasswordRequired" }),
    address: z.string().min(2, { message: "auth.addressRequired" }),
    city: z.string().min(2, { message: "auth.cityRequired" }),
    phone: z.string().min(6, { message: "auth.phoneRequired" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.passwordsDontMatch",
    path: ["confirmPassword"],
  });

// API schema without confirmPassword
export const signUpApiSchema = z.object({
  displayName: z.string().min(2, { message: "auth.nameRequired" }),
  email: z.string().email({ message: "auth.emailRequired" }),
  password: z.string().min(6, { message: "auth.passwordRequired" }),
  address: z.string().min(2, { message: "auth.addressRequired" }),
  city: z.string().min(2, { message: "auth.cityRequired" }),
  phone: z.string().min(6, { message: "auth.phoneRequired" }),
});

export const signInSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignUpApiData = z.infer<typeof signUpApiSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
