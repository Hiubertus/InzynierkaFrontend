import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";

export const PointsSkeleton = () => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <Skeleton className="h-12 w-24" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
};