"use client"

import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import {UserProfileCard} from "@/components";

export default function Home() {
    const { isAuthenticated, setUser, setAuthenticated, clearAuth } = useAuthStore()

    const handleSetUser = () => {
        setUser({
            id: 1,
            fullName: "Jan Kowalski",
            email: "jan.kowalski@example.com",
            picture: "https://i.pravatar.cc/150?u=jan.kowalski@example.com",
            description: "Entuzjasta nowych technologii i miłośnik górskich wycieczek.",
            badges: [
                "Stowrzenie 5 kursów",
                "Sprzedaż kursu 100 osobom",
                "Nauczyciel"
            ],
            points: 0,
            role: 'user'
        });
        setAuthenticated(true)
    }
    return (
        <div className="container mx-auto p-5 sm:p-7 lg:p-9">
            <h1 className="text-2xl font-bold mb-4">Stan autentykacji</h1>
            <p className="mb-4">
                Stan zalogowania: {isAuthenticated ? "zalogowany" : "nie zalogowany"}
            </p>
            <div className="flex gap-4">
                <Button onClick={handleSetUser} className="w-[250px]">
                    Ustaw użytkownika
                </Button>
                <Button onClick={clearAuth} className="w-[250px]">
                    Wyczyść autentykację
                </Button>
            </div>
            <UserProfileCard/>
        </div>
    );
}