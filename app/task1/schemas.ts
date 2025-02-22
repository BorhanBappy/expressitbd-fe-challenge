import { z } from "zod";

export const StoreSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters")
    .refine((val) => !val.includes(" "), "Domain cannot contain spaces")
    .refine(
      (val) => /^[a-z0-9-]+$/.test(val),
      "Domain can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Domain cannot start or end with a hyphen"
    ),
  country: z.string().min(1, "Please select a country"),
  category: z.string().min(1, "Please select a category"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  email: z.string().email("Invalid email address"),
});

export type StoreFormData = z.infer<typeof StoreSchema>;
