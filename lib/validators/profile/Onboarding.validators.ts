import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  bio: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  // avatarUrl and coverUrl will be handled separately via upload
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
