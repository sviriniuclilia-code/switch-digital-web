import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Nume prea scurt").max(100),
  email: z.string().trim().email("Email invalid").max(150),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // honeypot anti-spam: trebuie să rămână gol
  company: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email().max(150),
  password: z.string().min(1).max(200),
});
