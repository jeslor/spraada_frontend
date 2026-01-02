import { z } from "zod";

// Helper to strip HTML tags for text length validation
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

export const addToolSchema = z.object({
  name: z
    .string()
    .min(3, "Tool name must be at least 3 characters")
    .max(100, "Tool name must be less than 100 characters"),
  description: z
    .string()
    .refine(
      (val) => stripHtml(val).length >= 20,
      "Description must be at least 20 characters"
    )
    .refine(
      (val) => stripHtml(val).length <= 1000,
      "Description must be less than 1000 characters"
    ),
  category: z.string().min(1, "Please select a category"),
  dailyPrice: z
    .number({ message: "Please enter a valid price" })
    .min(1, "Daily price must be at least $1")
    .max(10000, "Daily price cannot exceed $10,000"),
  deposit: z
    .number({ message: "Please enter a valid deposit amount" })
    .min(0, "Deposit cannot be negative")
    .max(50000, "Deposit cannot exceed $50,000"),
  replacementValue: z
    .number({ message: "Please enter a valid replacement value" })
    .min(1, "Replacement value must be at least $1")
    .max(100000, "Replacement value cannot exceed $100,000"),
});

export type EditToolFormData = z.infer<typeof addToolSchema>;
