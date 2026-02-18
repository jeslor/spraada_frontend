import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

/**
 * Robust plain text extraction for production environments
 */
const extractPlainText = (html: string | null | undefined): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ") // Replace tags with space to avoid merging words
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ") // Collapse all whitespace
    .trim();
};

export const addToolSchema = z.object({
  name: z
    .string()
    .min(3, "Tool name must be at least 3 characters")
    .max(100, "Tool name must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .transform((val) => {
      // 1. Sanitize
      const sanitized = DOMPurify.sanitize(val, {
        USE_PROFILES: { html: true },
      });
      // 2. Remove leading/trailing empty paragraph breaks that cause "empty lines"
      return sanitized.replace(/^(<p><br><\/p>)+|(<p><br><\/p>)+$/g, "").trim();
    })
    .refine((val) => {
      // Validate against the cleaned text length
      return extractPlainText(val).length >= 20;
    }, "Description must be at least 20 characters")
    .refine((val) => {
      return extractPlainText(val).length <= 2000;
    }, "Description must be less than 2000 characters"),

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
