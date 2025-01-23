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
import { getWithdrawOffers} from "@/lib/session/cart/getWithdraws";
import { withdrawPoints} from "@/lib/session/cart/withdrawPoints";
import { ROUTES } from "@/components/Navbar/routes";
import { WithdrawCard } from '@/components/Cart/WithdrawCard';

interface WithdrawOffer {
    id: number;
    points: number;
    price: number;
}

export const Cart = () => {
    const router = useRouter();
    const [pointPackages, setPointPackages] = useState<PointOffer[]>([]);
    const [withdrawOffers, setWithdrawOffers] = useState<WithdrawOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken } = useAuthStore();
    const { userData, updateUserField } = useUserStore();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const offers: PointOffer[] = await getPointOffers();
                setPointPackages(offers);

                // Fetch withdraw offers only if user is a teacher
                if (accessToken && userData?.roles.includes('TEACHER')) {
                    const withdrawOffers = await getWithdrawOffers(accessToken);
                    setWithdrawOffers(withdrawOffers);
                }
            } catch {
                toast({
                    title: "Error",
                    description: "We couldn't fetch the offers",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast, accessToken, userData?.roles]);

    const handleBuyPoints = async (offer: PointOffer) => {
        if (!accessToken) {
            toast({
                title: "Error",
                description: "You must be log in to buy points",
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
                title: "Success!",
                description: `${offer.points} points bought!`,
            });

            router.push(ROUTES.HOME);
        } catch {
            toast({
                title: "Error",
                description: "There was a problem while buying points",
                variant: "destructive",
            });
        }
    };

    const handleWithdraw = async (offer: WithdrawOffer) => {
        if (!accessToken || !userData) {
            toast({
                title: "Error",
                description: "You must be logged in to withdraw points",
                variant: "destructive",
            });
            return;
        }

        if (!userData.roles.includes('TEACHER')) {
            toast({
                title: "Error",
                description: "Only teachers can withdraw points",
                variant: "destructive",
            });
            return;
        }

        if (userData.points < offer.points) {
            toast({
                title: "Error",
                description: "You don't have enough points to withdraw",
                variant: "destructive",
            });
            return;
        }

        try {
            await withdrawPoints(offer.id, accessToken);

            const newPoints = userData.points - offer.points;
            updateUserField('points', newPoints);

            toast({
                title: "Success!",
                description: `${offer.points} points withdrawn!`,
            });

            router.push(ROUTES.HOME);
        } catch {
            toast({
                title: "Error",
                description: "There was a problem while withdrawing points",
                variant: "destructive",
            });
        }
    };

    const skeletonArray = Array(6).fill(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Point Shop</h1>
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

            {/* Withdraw section - only visible for teachers */}
            {userData?.roles.includes('TEACHER') && !isLoading && withdrawOffers.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold text-center my-8">Withdraw Points</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {withdrawOffers.map((offer) => (
                            <WithdrawCard
                                key={offer.id}
                                offer={offer}
                                onWithdraw={handleWithdraw}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};