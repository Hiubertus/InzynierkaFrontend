import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CourseFrontPageSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                <div className="relative">
                    <Skeleton className="w-full h-64" />
                </div>

                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Skeleton className="h-9 w-64 mb-3" />
                            <div className="flex items-center mt-2">
                                <Skeleton className="h-4 w-4 mr-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end mb-2">
                                <Skeleton className="h-6 w-6 mr-2" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <div className="flex items-center justify-end">
                                <Skeleton className="h-4 w-4 mr-1" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-6 w-20" />
                        ))}
                    </div>

                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    <div className="flex items-center mb-4">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <Skeleton className="h-5 w-40" />
                    </div>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="flex items-center">
                            <Skeleton className="h-12 w-12 rounded-full mr-4" />
                            <div>
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardFooter className="flex justify-between mt-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    )
}