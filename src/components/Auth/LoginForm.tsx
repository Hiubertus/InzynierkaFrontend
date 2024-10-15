"use client"

import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useAuthStore } from "@/lib/stores/authStore";
import { AuthCard } from './AuthCard';
import { FormFieldInput } from './FormFieldInput';
import { loginSchema, LoginFormValues } from './schemas';

export const LoginForm: React.FC = memo(() => {
    const { setUser, setAccessToken, setRefreshToken } = useAuthStore();
    const [backendError, setBackendError] = useState<string | null>(null);
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                    id: data.data.user.id,
                    fullName: data.data.user.fullName,
                    email:  data.data.user.email,
                    picture: data.data.user.picture,
                    points: data.data.user.points,
                    role: data.data.user.role,
                    badges: data.data.user.badges,
                    description: data.data.user.description,
                    achievementsVisible: data.data.user.achievementsVisible,
                });
                setAccessToken(data.data.user.accessToken)
                setRefreshToken(data.data.user.refreshToken)
                console.log('Login successful');
                setBackendError(null);
            } else {
                const errorData = await response.json();
                setBackendError(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setBackendError('An unexpected error occurred');
        }
    }

    return (
        <AuthCard
            footerContent={
                <Button type="submit" className="w-[200px] text-sm md:text-base lg:text-lg py-2 md:py-3 mt-3 mx-auto" onClick={form.handleSubmit(onSubmit)}>
                    Log In
                </Button>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-8">
                        <FormFieldInput<LoginFormValues> control={form.control} name="email" label="Email" type="email" />
                        <FormFieldInput<LoginFormValues> control={form.control} name="password" label="Password" type="password" />
                    </div>
                    {backendError && (
                        <div className="text-red-500 text-sm mt-2">
                            {backendError}
                        </div>
                    )}
                </form>
            </Form>
        </AuthCard>
    )
});
LoginForm.displayName = "LoginForm";
