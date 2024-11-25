import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent} from "@/components/ui/card";

export const CommentSkeleton = () => {
    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>
        </Card>
    )
}