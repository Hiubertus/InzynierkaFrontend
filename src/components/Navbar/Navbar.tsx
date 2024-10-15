"use client"

import { Mountain, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useAuthStore } from "@/lib/stores/authStore"

const ROUTES = {
    AUTH: '/auth',
    HOME: "/",
    PROFILE: "/profile",
    CART: "/cart"
} as const;

export const Navbar = () => {
    const { accessToken, user } = useAuthStore()

    const getProfileLink = () => {
        if (user) {
            return `${ROUTES.PROFILE}`
        }
        return ROUTES.AUTH
    }

    const renderAuthSection = () => {
        if (accessToken && user) {
            return (
                <Link href={getProfileLink()}>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={user.picture} alt={user.fullName} />
                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                </Link>
            )
        } else {
            return (
                <Link href={ROUTES.AUTH}>
                    <Button variant="outline" className="ml-4">
                        Logowanie
                    </Button>
                </Link>
            )
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 left-0 z-50">
            <div className="container mx-auto px-5 sm:px-7 lg:px-9">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href={ROUTES.HOME} prefetch={true} className="flex-shrink-0">
                            <Mountain className="h-8 w-8 text-black" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href={ROUTES.CART}>
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-5 w-5" />
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