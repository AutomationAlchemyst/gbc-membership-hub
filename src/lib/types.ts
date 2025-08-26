import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(1, { message: "Name is required." }),
  designation: z.string().min(1, { message: "Designation is required." }),
  business: z.string().min(1, { message: "Business name is required." }),
  businessRegistrationType: z.enum([
    "Home-based",
    "Sole-Proprietor",
    "LP / LLP / Pte Ltd / Private Company / Public Company",
  ], {
    required_error: "You need to select a business registration type.",
  }),
  whatsappNumber: z.string().min(1, { message: "WhatsApp number is required." }),
  businessWebsite: z.string().optional(),
  socialHandle: z.string().min(1, { message: "Instagram/TikTok/Facebook Handle is required." }),
  businessType: z.enum([
    "F&B (dine in)",
    "F&B (delivery / pick up)",
    "On Site Retail",
    "Online Retail",
    "Service",
    "Sales & Consultation",
  ], {
    required_error: "You need to select a business type.",
  }),
  businessSummary: z.string().min(10, { message: "Summary must be at least 10 characters." }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export interface Member extends RegistrationFormValues {
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
