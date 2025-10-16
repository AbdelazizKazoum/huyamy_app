import { z } from "zod";

// Client-side schema with confirmPassword
export const signUpSchema = z
  .object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// API schema without confirmPassword
export const signUpApiSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  displayName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .optional(),
  phoneNumber: z.string().optional(),
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
