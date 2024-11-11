"use client"

import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { AuthCard } from './AuthCard';
import { FormFieldInput } from './FormFieldInput';
import {registerSchema, RegisterFormValues} from './schemas';

export const RegisterForm: React.FC = memo(() => {
    const [backendError, setBackendError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: RegisterFormValues) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    fullName: values.fullName,
                }),
            });

            if (response.ok) {
                setBackendError(null);
                setIsSuccess(true);
                form.reset();
            } else {
                const errorData = await response.json();
                setBackendError(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setBackendError('An unexpected error occurred');
        }
    }

    return (
        <AuthCard
            footerContent={
                <Button type="submit" className="w-[200px] text-sm md:text-base lg:text-lg py-2 md:py-3 mt-3 mx-auto" onClick={form.handleSubmit(onSubmit)} disabled={isSuccess}>
                    Register
                </Button>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-8">
                        <FormFieldInput<RegisterFormValues> control={form.control} name="fullName" label="Full Name" placeholder="John Doe" disabled={isSuccess} />
                        <FormFieldInput<RegisterFormValues> control={form.control} name="email" label="Email" type="email" placeholder="john.doe@example.com" disabled={isSuccess} />
                        <FormFieldInput<RegisterFormValues> control={form.control} name="password" label="Password" type="password" disabled={isSuccess} />
                        <FormFieldInput<RegisterFormValues> control={form.control} name="confirmPassword" label="Confirm Password" type="password" disabled={isSuccess} />
                    </div>
                    {backendError && (
                        <div className="text-red-500 text-sm mt-2">
                            {backendError}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="text-green-500 text-sm mt-2">
                            Registration successful!
                        </div>
                    )}
                </form>
            </Form>
        </AuthCard>
    )
});
RegisterForm.displayName = "RegisterForm";