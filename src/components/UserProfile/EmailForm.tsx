import React, {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";
import axios from "axios";
import {initiateChangeEmail} from "@/lib/session/auth/initiateChangeEmail";
import {completeChangeEmail} from "@/lib/session/auth/completeChangeEmail";

interface EmailFormProps {
    email: string;
    accessToken: string;

}

export const EmailForm: React.FC<EmailFormProps> = ({
                                                        email,
                                                        accessToken,
                                                    }) => {
    const {toast} = useToast();
    const [newEmail, setNewEmail] = useState<string>(email);
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [resendTimeout, setResendTimeout] = useState<number>(0);

    const timeoutDuration = 5
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

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendCode = async () => {
        if (!newEmail) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Email is required",
            });
            return;
        }

        if (!validateEmail(newEmail)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid email address",
            });
            return;
        }

        try {
            setIsSendingCode(true);
            await initiateChangeEmail(accessToken);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEmail) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Email is required",
            });
            return;
        }

        if (!validateEmail(newEmail)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid email address",
            });
            return;
        }

        if (!verificationCode) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Verification code is required",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await completeChangeEmail(newEmail, verificationCode, accessToken);

            toast({
                title: "Success",
                description: "Email has been successfully updated",
                variant: "success"
            });
            setIsCodeSent(false);
            setVerificationCode("");
            setResendTimeout(0);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to update email"
                    : "Failed to update email",
            });
        } finally {
            setIsSubmitting(false);
            window.location.reload();

        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">New email address</Label>
                <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={isSendingCode || isSubmitting || newEmail === email || resendTimeout > 0}
                >
                    {isSendingCode ? "Sending..." : isCodeSent ?
                        resendTimeout > 0 ? `Resend in ${resendTimeout}s` : "Resend Code"
                        : "Send Verification Code"}
                </Button>
            </div>

            {isCodeSent && (
                <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                        id="verificationCode"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                        disabled={isSubmitting}
                    />
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isCodeSent || newEmail === email}
            >
                {isSubmitting ? "Updating..." : "Update email"}
            </Button>
        </form>
    );
};