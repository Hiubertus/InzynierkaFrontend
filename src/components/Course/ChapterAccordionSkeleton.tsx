import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent} from "@/components/ui/card";

export const ChapterAccordionSkeleton = () => {
    return (
        <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="w-full">
                    <CardContent className="p-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1">
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 flex-1 max-w-[200px]" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Skeleton key={star} className="h-4 w-4" />
                                ))}
                                <Skeleton className="h-4 w-16 ml-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};