import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfileSkeleton = () => {
    return (
        <div className="container mx-auto">
            <div className="space-y-4">
                <div className="w-full h-10 rounded-lg bg-muted flex gap-1 p-1">
                    <Skeleton className="h-8 w-[120px] rounded-md" />
                    <Skeleton className="h-8 w-[150px] rounded-md" />
                    <Skeleton className="h-8 w-[140px] rounded-md" />
                    <Skeleton className="h-8 w-[140px] rounded-md" />
                </div>

                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="text-center sm:text-left w-full flex justify-between items-start">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-9 w-48" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-48" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <Skeleton className="h-9 w-[120px]" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Skeleton className="h-7 w-32 mb-2" />
                            <Skeleton className="h-20 w-full" />
                        </div>

                        <div>
                            <Skeleton className="h-7 w-36 mb-2" />
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3].map((index) => (
                                    <Skeleton key={index} className="h-8 w-32" />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};