import { z } from "zod";

export const authSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const locationInputSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  label: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  placeId: z.string().optional(),
});

export const registerSchema = authSchema
  .extend({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    bio: z
      .string()
      .trim()
      .max(500, "Bio must be at most 500 characters")
      .optional(),
    locationLabel: z.string().optional(),
    location: locationInputSchema.optional(),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const hasTypedLabel = Boolean(data.locationLabel?.trim());
      return !hasTypedLabel || Boolean(data.location);
    },
    {
      message: "Select a location from the suggestions",
      path: ["locationLabel"],
    },
  );

export type AuthFormValues = z.infer<typeof authSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LocationInputValues = z.infer<typeof locationInputSchema>;
