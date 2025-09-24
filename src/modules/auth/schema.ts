import { z } from "zod";

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(3, "Password must be at least 3 characters"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(63, "Username must be less than 63 characters")
        .regex(/^[a-z0-9][a-z0-9]*[a-z0-9]+$/, "Username must contain only letters, numbers, and hyphens, and must start and end with a letter or number")
        .refine((value) => !value.includes("--"), "Username cannot contain double hyphens").
        transform((value) => value.toLowerCase()),
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
})
