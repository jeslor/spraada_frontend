import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userPasswordRequirements = (password: string) => [
  { met: password.length >= 8, text: "At least 8 characters" },
  { met: /[a-z]/.test(password), text: "One lowercase letter" },
  { met: /[A-Z]/.test(password), text: "One uppercase letter" },
  { met: /\d/.test(password), text: "One number" },
];

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordData = z.infer<typeof newPasswordSchema>;
export type FormData = z.infer<typeof signUpSchema>;
