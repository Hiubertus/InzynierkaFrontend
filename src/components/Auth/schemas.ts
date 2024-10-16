import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
})

export const registerSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;