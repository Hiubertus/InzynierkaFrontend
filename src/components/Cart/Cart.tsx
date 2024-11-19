"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useUserStore } from '@/lib/stores/userStore';
import { useToast} from "@/hooks/use-toast";
import { PointOffer} from "@/models/backend_models/pointsData";
import { PointsCard } from "@/components/Cart/PointsCard";
import { PointsSkeleton} from "@/components/Cart/PointsSkeleton";
import { getPointOffers} from "@/lib/session/cart/getOffers";
import { buyPoints } from "@/lib/session/cart/buyPoints";
import {ROUTES} from "@/components/Navbar/routes";

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
                const offers: PointOffer[] = await getPointOffers();
                setPointPackages(offers);
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

        fetchPointPackages();
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
            await buyPoints(offer.id, accessToken);

            if (userData) {
                const newPoints = userData.points + offer.points;
                updateUserField('points', newPoints);
            }

            toast({
                title: "Sukces!",
                description: `Zakupiono ${offer.points} punktów`,
            });

            router.push(ROUTES.HOME);
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