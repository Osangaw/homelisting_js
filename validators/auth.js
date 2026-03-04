import * as z from "zod";

export const signUpValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(3).max(30),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(12, "Password must be at most 12 characters long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(11, "Phone number must be at most 11 digits"),
  accountType: z.enum(["user", "admin", "owner"]).default("user"), 
});

export const loginValidator = z.object({
  email: z.string().email("Invalid email format").min(3).max(30),
  password: z.string().min(6).max(12),
});