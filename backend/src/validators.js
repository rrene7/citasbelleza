import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const salonSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  image_url: z.string().url().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional()
});

export const serviceSchema = z.object({
  salon_id: z.number().int(),
  name: z.string().min(2),
  description: z.string().optional(),
  duration_minutes: z.number().int().optional(),
  price: z.number().nonnegative()
});

export const workerSchema = z.object({
  salon_id: z.number().int(),
  name: z.string().min(2),
  specialty: z.string().optional(),
  image_url: z.string().url().optional(),
  rating: z.number().optional(),
  experience: z.string().optional(),
  availability: z.array(z.string()).optional()
});

export const bookingSchema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().optional(),
  salon_id: z.number().int(),
  worker_id: z.number().int(),
  service_id: z.number().int(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional()
});
