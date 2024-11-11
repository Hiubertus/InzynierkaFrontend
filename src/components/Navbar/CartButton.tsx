import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ROUTES } from "@/components/Navbar/routes";

export const CartButton = () => {
    return (
        <Link href={ROUTES.CART}>
            <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5"/>
                <span className="sr-only">Koszyk</span>
            </Button>
        </Link>
    );
};