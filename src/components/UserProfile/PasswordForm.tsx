import React from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldInput } from './FormFieldInput';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z.string().min(1, { message: "Password confirmation is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordForm: React.FC = () => {
    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (values: PasswordFormValues) => {
        console.log('Password updated:', values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldInput<PasswordFormValues> control={form.control} name="currentPassword" label="Current password" type="password" />
                <FormFieldInput<PasswordFormValues> control={form.control} name="newPassword" label="New password" type="password" />
                <FormFieldInput<PasswordFormValues> control={form.control} name="confirmPassword" label="Confirm new password" type="password" />
                <Button type="submit" className="w-full">
                    Update password
                </Button>
            </form>
        </Form>
    );
};