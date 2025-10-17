import * as z from "zod";

export const signUpValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(3).max(30),
  password: z.string().min(6, "Password must be at least 6 characters long")
  .max(12, "Password must be at most 12 characters long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
//   confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
}).required({ message: "Please fill all the fields" });

export const loginValidator = z.object({
  email: z.string().min(3).max(30),
   password: z.string().min(6, "Password must be at least 6 characters long")
  .max(12, "Password must be at most 12 characters long")
});