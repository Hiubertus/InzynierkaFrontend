"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PointsCard } from "@/components/Cart/PointsCard";
import { PointsSkeleton } from "@/components/Cart/PointsSkeleton";
import type { PointOffer, PointsApiResponse} from "@/models/backend_models/pointsData";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUserStore } from "@/lib/stores/userStore";

export const Cart = () => {
    const router = useRouter();
    const [pointPackages, setPointPackages] = useState<PointOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken } = useAuthStore();
    const { userData, updateUserField } = useUserStore();
    const { toast } = useToast();

    useEffect(() => {
        const fetchPointPackages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/points/get-offers`);

                if (!response.ok) throw new Error('Failed to fetch offers');
                const data: PointsApiResponse = await response.json();

                setPointPackages(data.data.offers);
            } catch {
                toast({
                    title: "Błąd",
                    description: "Nie udało się pobrać ofert punktów",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPointPackages().then();
    }, [toast]);

    const handleBuyPoints = async (offer: PointOffer) => {
        if (!accessToken) {
            toast({
                title: "Błąd",
                description: "Musisz być zalogowany by kupić punkty",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/points/buy/${offer.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!response.ok) throw new Error('Failed to purchase points');

            if (userData) {
                const newPoints = userData.points + offer.points;
                updateUserField('points', newPoints);
            }

            toast({
                title: "Sukces!",
                description: `Zakupiono ${offer.points} punktów`,
            });

            // Przekierowanie na stronę główną po udanym zakupie
            router.push('/');
        } catch {
            toast({
                title: "Błąd",
                description: "Nie udało się zakupić punktów",
                variant: "destructive",
            });
        }
    };

    const skeletonArray = Array(6).fill(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Kup Punkty</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                    ? skeletonArray.map((_, index) => (
                        <PointsSkeleton key={index}/>
                    ))
                    : pointPackages.map((offer) => (
                        <PointsCard
                            key={offer.id}
                            offer={offer}
                            onBuy={handleBuyPoints}
                        />
                    ))
                }
            </div>
        </div>
    );
};