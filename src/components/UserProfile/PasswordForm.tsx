import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldInput } from './FormFieldInput';
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {initiateChangePassword} from "@/lib/session/auth/initiateChangePassword";
import {completeChangePassword} from "@/lib/session/auth/completeChangePassword";

const passwordSchema = z.object({
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z.string().min(1, { message: "Password confirmation is required" }),
    verificationCode: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
    accessToken: string;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
                                                              accessToken,
                                                          }) => {
    const { toast } = useToast();
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [resendTimeout, setResendTimeout] = useState<number>(0);
    const timeoutDuration = 5

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
            verificationCode: '',
        },
    });

    useEffect(() => {
        let timer: number;
        if (resendTimeout > 0) {
            timer = window.setInterval(() => {
                setResendTimeout(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) window.clearInterval(timer);
        };
    }, [resendTimeout]);

    const handleSendCode = async () => {
        if (!form.getValues('newPassword') || !form.getValues('confirmPassword')) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in new password fields first",
            });
            return;
        }

        try {
            setIsSendingCode(true);
            await initiateChangePassword(accessToken);

            setIsCodeSent(true);
            toast({
                title: "Success",
                description: "Verification code has been sent to your email",
            });
            setResendTimeout(timeoutDuration);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to send verification code"
                    : "Failed to send verification code",
            });
        } finally {
            setIsSendingCode(false);
        }
    };

    const onSubmit = async (values: PasswordFormValues) => {
        try {
            if (!isCodeSent) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please request a verification code first",
                });
                return;
            }

            if (!values.verificationCode) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Verification code is required",
                });
                return;
            }

            await completeChangePassword(values.newPassword, values.verificationCode, accessToken);

            toast({
                title: "Success",
                description: "Password has been successfully updated",
                variant: "success"
            });
            form.reset();
            setIsCodeSent(false);
            setResendTimeout(0);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to update password"
                    : "Failed to update password",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldInput<PasswordFormValues>
                    control={form.control}
                    name="newPassword"
                    label="New password"
                    type="password"
                />

                <FormFieldInput<PasswordFormValues>
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm new password"
                    type="password"
                />

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={isSendingCode ||
                            !form.getValues('newPassword') ||
                            !form.getValues('confirmPassword') ||
                            resendTimeout > 0}
                    >
                        {isSendingCode ? "Sending..." : isCodeSent ?
                            resendTimeout > 0 ? `Resend in ${resendTimeout}s` : "Resend Code"
                            : "Send Verification Code"}
                    </Button>
                </div>

                {isCodeSent && (
                    <FormFieldInput<PasswordFormValues>
                        control={form.control}
                        name="verificationCode"
                        label="Verification code"
                        type="text"
                    />
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={!isCodeSent || form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Updating..." : "Update password"}
                </Button>
            </form>
        </Form>
    );
};