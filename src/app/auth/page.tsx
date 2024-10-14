"use client"

import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm, UseFormReturn, FieldValues, Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
})

const registerSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface FormFieldProps<T extends FieldValues> {
    control: UseFormReturn<T>['control'];
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}

const FormFieldInput = <T extends FieldValues>({
                                                   control,
                                                   name,
                                                   label,
                                                   type = "text",
                                                   placeholder = "",
                                                   disabled = false
                                               }: FormFieldProps<T>) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="col-span-2 md:col-span-1 relative">
                    <FormLabel className="text-sm md:text-base lg:text-lg">{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            className={cn(
                                "text-sm md:text-base lg:text-lg p-2 md:p-3",
                                fieldState.error && "border-red-500 focus:ring-red-500"
                            )}
                            onFocus={() => setIsActive(true)}
                            onBlur={() => setIsActive(false)}
                            disabled={disabled}
                        />
                    </FormControl>
                    {fieldState.error && isActive && (
                        <div className="text-red-500 text-sm mt-1 absolute -bottom-[30px] left-0 right-0">
                            <div className="px-2 py-1 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                                <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <FormMessage/>
                                </div>
                            </div>
                        </div>
                    )}
                </FormItem>
            )}
        />
    );
};

interface AuthCardProps {
    children?: React.ReactNode;
    footerContent?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = memo(({  children, footerContent }) => (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
        <CardContent className="space-y-4 md:space-y-6">
            {children}
        </CardContent>
        <CardFooter>
            {footerContent}
        </CardFooter>
    </Card>
));
AuthCard.displayName = "AuthCard"

const LoginForm: React.FC = memo(() => {
    const { setAuthenticated, setUser, setTokens } = useAuthStore();
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
                setAuthenticated(true);
                setUser({
                    id: data.data.user.id,
                    fullName: data.data.user.fullName,
                    email:  data.data.user.email,
                    picture: data.data.user.picture,
                    points: data.data.user.points,
                    role: data.data.user.role,
                    badges: data.data.user.badges,
                    description: data.data.user.description
                });
                setTokens(data.data.user.accessToken, data.data.user.refreshToken);
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

const RegisterForm: React.FC = memo(() => {
    const { setAuthenticated, setUser, setTokens } = useAuthStore();
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
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthenticated(true);
                setUser(data.user);
                setTokens(data.accessToken, data.refreshToken);
                console.log('Registration successful');
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

export default function Page() {
    return (
        <div className="container mx-auto p-5 sm:p-7 lg:p-9">
            <Tabs
                defaultValue="login"
                className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-5">
                <TabsList className="grid grid-cols-2 py-2 mb-2 md:mb-4 h-[42px] md:h-[46px] lg:h-[50px]">
                    <TabsTrigger value="login" className="text-sm md:text-base lg:text-lg">Login</TabsTrigger>
                    <TabsTrigger value="register" className="text-sm md:text-base lg:text-lg">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}