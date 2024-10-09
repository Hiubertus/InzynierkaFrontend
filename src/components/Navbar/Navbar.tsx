"use client"

import { useState } from 'react'
import { Menu, X, Mountain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const ROUTES = {
    AUTH: '/auth',
    HOME: "/"
} as const;

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 left-0">
            <div className="container mx-auto px-5 sm:px-7 lg:px-9">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href={ROUTES.HOME} prefetch={true} className="flex-shrink-0">
                            <Mountain className="h-8 w-8 text-black" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <Link href={ROUTES.AUTH} prefetch={true}>
                            <Button variant="outline" className="ml-4">
                                Logowanie
                            </Button>
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href={ROUTES.AUTH} className="w-full">
                            <Button variant="outline" className="w-full justify-center">
                                Logowanie
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}