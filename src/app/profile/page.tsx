"use client"

import React, { useEffect, useState } from 'react';
import {useAuthStore, UserData} from "@/lib/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trophy} from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, UseFormReturn, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, X, Check, Pencil, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
    email: z.string().min(1, { message: "Email jest wymagany" }).email({ message: "Nieprawidłowy adres email" }),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Aktualne hasło jest wymagane" }),
    newPassword: z.string().min(8, { message: "Nowe hasło musi mieć co najmniej 8 znaków" }),
    confirmPassword: z.string().min(1, { message: "Potwierdzenie hasła jest wymagane" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface FormFieldInputProps<T extends FieldValues> {
    control: UseFormReturn<T>['control'];
    name: Path<T>;
    label: string;
    type?: string;
}

const FormFieldInput = <T extends FieldValues>({ control, name, label, type = "text" }: FormFieldInputProps<T>) => {
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
                            className={cn(
                                "text-sm md:text-base lg:text-lg p-2 md:p-3",
                                fieldState.error && "border-red-500 focus:ring-red-500"
                            )}
                            onFocus={() => setIsActive(true)}
                            onBlur={() => setIsActive(false)}
                        />
                    </FormControl>
                    {fieldState.error && isActive && (
                        <div className="text-red-500 text-sm mt-1 absolute -bottom-[30px] left-0 right-0">
                            <div className="px-2 py-1 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                                <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <FormMessage />
                                </div>
                            </div>
                        </div>
                    )}
                </FormItem>
            )}
        />
    );
};

interface EmailFormProps {
    user: UserData;
    setUser: (user: UserData) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ user, setUser }) => {
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
                <FormFieldInput<EmailFormValues> control={form.control} name="email" label="Nowy adres e-mail" type="email" />
                <Button type="submit" className="w-full">
                    Zaktualizuj email
                </Button>
            </form>
        </Form>
    );
};

const PasswordForm: React.FC = () => {
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
                <FormFieldInput<PasswordFormValues> control={form.control} name="currentPassword" label="Aktualne hasło" type="password" />
                <FormFieldInput<PasswordFormValues> control={form.control} name="newPassword" label="Nowe hasło" type="password" />
                <FormFieldInput<PasswordFormValues> control={form.control} name="confirmPassword" label="Potwierdź nowe hasło" type="password" />
                <Button type="submit" className="w-full">
                    Zaktualizuj hasło
                </Button>
            </form>
        </Form>
    );
};

interface EditableFieldProps {
    value: string;
    onSave: (value: string) => void;
    fieldName: string;
    inputType: 'input' | 'textarea';
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, fieldName, inputType }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    const handleSave = () => {
        onSave(editedValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedValue(value);
        setIsEditing(false);
    };

    const InputComponent = inputType === 'input' ? Input : Textarea;

    return (
        <div className="relative">
            <InputComponent
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                disabled={!isEditing}
                className={cn(
                    "w-full",
                    !isEditing && "cursor-default"
                )}
            />
            {!isEditing ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            ) : (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                    <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default function UserProfilePage()  {
    const { user, updateUserField } = useAuthStore();
    const [achievementsVisible, setAchievementsVisible] = useState(user?.achievementsVisible ?? true);

    useEffect(() => {
        if (user) {
            setAchievementsVisible(user.achievementsVisible);
        }
    }, [user]);


    const badges: string[] = [
        "Stowrzenie 5 kursów",
        "Sprzedaż kursu 100 osobom",
        "Nauczyciel"
    ];

    const toggleAchievementsVisibility = (visible: boolean) => {
        setAchievementsVisible(visible);
        updateUserData('achievementsVisible', visible);
    };

    const updateUserData = async <K extends keyof UserData>(field: K, value: UserData[K]) => {
        try {
            const response = await fetch(`/api/user/${field}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            updateUserField(field, value);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.picture} alt={`Zdjęcie profilowe ${user.fullName}`} />
                        <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left w-full">
                        <h2 className="text-3xl font-bold mb-2">
                            <EditableField
                                value={user.fullName}
                                onSave={(value) => updateUserData('fullName', value)}
                                fieldName="fullName"
                                inputType="input"
                            />
                        </h2>
                        <p className="text-lg text-muted-foreground">{user.email}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Opis:</h3>
                        <EditableField
                            value={user.description}
                            onSave={(value) => updateUserData('description', value)}
                            fieldName="description"
                            inputType="textarea"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">Osiągnięcia:</h3>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={achievementsVisible}
                                    onCheckedChange={toggleAchievementsVisibility}
                                    id="achievements-visibility"
                                />
                                <label htmlFor="achievements-visibility" className="text-sm text-muted-foreground cursor-pointer">
                                    {achievementsVisible ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </label>
                            </div>
                        </div>
                        {achievementsVisible && (
                            <div className="flex flex-wrap gap-2">
                                {user.badges.map((achievement, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1 text-sm py-1 px-2">
                                        <Trophy className="h-4 w-4" />
                                        {achievement}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Zmień email</TabsTrigger>
                            <TabsTrigger value="password">Zmień hasło</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email">
                            <EmailForm user={user} setUser={(updatedUser) => updateUserField('email', updatedUser.email)} />
                        </TabsContent>
                        <TabsContent value="password">
                            <PasswordForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}