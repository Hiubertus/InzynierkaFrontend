"use client"

import { Mountain, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useAuthStore } from "@/lib/stores/authStore";
import { useUserStore } from "@/lib/stores/userStore";
import { logout } from '@/lib/session/auth'
import { useRouter } from 'next/navigation'
import React from "react";

const ROUTES = {
    AUTH: '/auth',
    HOME: "/",
    PROFILE: "/profile/edit",
    CART: "/cart",
    COURSES: "/courses",
    TASKS: "/tasks"
} as const;

export const Navbar = () => {
    const { accessToken, setAccessToken, clearAuth } = useAuthStore()
    const { userData, clearUserData } = useUserStore()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const result = await logout()
            if (result.success) {
                setAccessToken(null);
                clearUserData();
                clearAuth();
                router.push(ROUTES.HOME)
            } else {
                console.error('Logout failed:', result.error)
            }
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const renderAuthSection = () => {
        if (accessToken && userData) {
            return (
                <div className="flex items-center">
                    <Link href={ROUTES.PROFILE}>
                        <Avatar className="cursor-pointer">
                            {(userData.picture)
                                ? (<AvatarImage
                                    src={URL.createObjectURL(userData.picture)}
                                    alt={`Profile picture of ${userData.fullName}`}
                                />)
                                : (<AvatarFallback>
                                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>)
                            }
                        </Avatar>
                    </Link>
                    <Button
                        variant="outline"
                        className="ml-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            )
        }

        return (
            <Link href={ROUTES.AUTH}>
                <Button variant="outline" className="ml-4">
                    Login
                </Button>
            </Link>
        )
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 left-0 z-50">
            <div className="container mx-auto px-5 sm:px-7 lg:px-9">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link href={ROUTES.HOME} prefetch={true} className="flex-shrink-0">
                            <Mountain className="h-8 w-8 text-black" aria-hidden="true"/>
                            <span className="sr-only">Home</span>
                        </Link>
                        <Link href={ROUTES.COURSES}>
                            <Button variant="ghost">
                                Courses
                            </Button>
                        </Link>
                        <Link href={ROUTES.TASKS}>
                            <Button variant="ghost">
                                Tasks
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href={ROUTES.CART}>
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-5 w-5"/>
                                <span className="sr-only">Koszyk</span>
                            </Button>
                        </Link>
                        {renderAuthSection()}
                    </div>
                </div>
            </div>
        </nav>
    )
}