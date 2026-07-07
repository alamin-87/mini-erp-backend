import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");
export const registerUserValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: passwordSchema,
  }),
});

export const loginUserValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});