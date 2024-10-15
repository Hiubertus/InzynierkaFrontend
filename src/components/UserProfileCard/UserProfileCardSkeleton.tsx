import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";


export const UserProfileCardSkeleton = () => {
    return (
        <Card className="w-[350px]">
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}