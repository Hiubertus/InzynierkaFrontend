import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CourseCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>

                <div className="space-y-2 mb-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                </div>
            </CardContent>
        </Card>
    )
}