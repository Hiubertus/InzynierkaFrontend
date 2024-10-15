import React from 'react';
import { UserData } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldInput } from './FormFieldInput';

const emailSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailFormProps {
    user: UserData;
    setUser: (user: UserData) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ user, setUser }) => {
    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: user?.email || '',
        },
    });

    const onSubmit = (values: EmailFormValues) => {
        setUser({ ...user, email: values.email });
        console.log('Email updated:', values.email);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldInput<EmailFormValues> control={form.control} name="email" label="New email address" type="email" />
                <Button type="submit" className="w-full">
                    Update email
                </Button>
            </form>
        </Form>
    );
};