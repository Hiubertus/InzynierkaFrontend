import {FC, memo, ReactNode} from 'react';
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

interface AuthCardProps {
    children?: ReactNode;
    footerContent?: ReactNode;
}

export const AuthCard: FC<AuthCardProps> = memo(({ children, footerContent }) => (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
        <CardContent className="space-y-4 md:space-y-6">
            {children}
        </CardContent>
        <CardFooter>
            {footerContent}
        </CardFooter>
    </Card>
));
AuthCard.displayName = "AuthCard"