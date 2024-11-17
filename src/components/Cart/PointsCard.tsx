

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PointOffer} from "@/models/backend_models/pointsData";

interface PointsCardProps {
    offer: PointOffer;
    onBuy: (offer: PointOffer) => Promise<void>;
}

export const PointsCard = ({ offer, onBuy }: PointsCardProps) => {
    const { points, price } = offer;

    return (
        <Card className="flex flex-col transition-transform hover:scale-105">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{points} Punktów</CardTitle>
                <CardDescription className="text-center">Najlepsza wartość!</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-4xl font-bold">{price} zł</p>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => onBuy(offer)}
                >
                    Kup Teraz
                </Button>
            </CardFooter>
        </Card>
    );
};