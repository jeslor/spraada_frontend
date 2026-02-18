import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

/**
 * Extract plain text from HTML safely
 */
const extractPlainText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Description validation schema
 */
const descriptionSchema = z
  .string()
  .min(1, "Description is required")
  .superRefine((value, ctx) => {
    const text = extractPlainText(value);
    const length = text.length;

    if (length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must be at least 20 characters",
      });
    }

    if (length > 2000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must be less than 2000 characters",
      });
    }
  })
  .transform((value) => {
    // Sanitize HTML before storing
    return DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
    });
  });

export const addToolSchema = z.object({
  name: z
    .string()
    .min(3, "Tool name must be at least 3 characters")
    .max(100, "Tool name must be less than 100 characters"),
  description: z
    .string()
    .refine(
      (val) => extractPlainText(val).length >= 20,
      "Description must be at least 20 characters",
    )
    .refine(
      (val) => extractPlainText(val).length <= 2000,
      "Description must be less than 2000 characters",
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
