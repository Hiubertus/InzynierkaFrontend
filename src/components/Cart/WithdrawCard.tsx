
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface WithdrawOffer {
    id: number;
    points: number;
    price: number;
}

interface WithdrawCardProps {
    offer: WithdrawOffer;
    onWithdraw: (offer: WithdrawOffer) => Promise<void>;
}

export const WithdrawCard = ({ offer, onWithdraw }: WithdrawCardProps) => {
    const { points, price } = offer;

    return (
        <Card className="flex flex-col transition-transform hover:scale-105">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{points} Points</CardTitle>
                <CardDescription className="text-center">Withdraw now!</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-4xl font-bold">{price} zł</p>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => onWithdraw(offer)}
                >
                    Withdraw
                </Button>
            </CardFooter>
        </Card>
    );
};