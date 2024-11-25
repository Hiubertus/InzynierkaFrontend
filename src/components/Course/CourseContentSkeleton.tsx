import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CourseContentSkeleton = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-[250px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[85%]" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-[200px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-[180px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-[80%]" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}