"use client"

import React from 'react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const Auth = () => {
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