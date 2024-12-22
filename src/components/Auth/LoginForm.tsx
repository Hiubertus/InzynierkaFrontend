"use client"

import {FC, memo, useState} from 'react';
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { AuthCard } from './AuthCard';
import { FormFieldInput } from './FormFieldInput';
import { loginSchema, LoginFormValues } from './schemas';
import { login } from "@/lib/session/auth/login";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useUserStore } from '@/lib/stores/userStore';
import { ROUTES } from "@/components/Navbar/routes";
import { useProfileStore } from "@/lib/stores/profileStore";
import { useCourseStore } from "@/lib/stores/courseStore";

export const LoginForm: FC = memo(() => {
    const router = useRouter();
    const { setAccessToken, setInitialized: setAuthInitialized } = useAuthStore();
    const { setUserData, setInitialized: setUserInitialized } = useUserStore();
    const { fetchProfile } = useProfileStore();
    const [backendError, setBackendError] = useState<string | null>(null);
    const { resetData: resetCourseData } = useCourseStore()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
        try {
            const result = await login(values.email, values.password);

            if (result.success && result.accessToken && result.userData) {
                setAuthInitialized(false);
                setUserInitialized(false);

                fetchProfile(result.userData.id)

                resetCourseData();
                setAccessToken(result.accessToken);
                setUserData(result.userData);
                setAuthInitialized(true);
                setUserInitialized(true);
                router.push(ROUTES.HOME);

            } else if (result.error) {
                setBackendError(result.error);
            }
        } catch (error) {
            setBackendError('An unexpected error occurred');
            console.error('Login error:', error);
        } finally {

        }
    }


    return (
        <AuthCard
            footerContent={
                <Button
                    type="submit"
                    className="w-[200px] text-sm md:text-base lg:text-lg py-2 md:py-3 mt-3 mx-auto"
                    onClick={form.handleSubmit(onSubmit)}
                >
                    Log In
                </Button>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-8">
                        <FormFieldInput<LoginFormValues>
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                        />
                        <FormFieldInput<LoginFormValues>
                            control={form.control}
                            name="password"
                            label="Password"
                            type="password"
                        />
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