import {Card, CardContent, CardHeader} from "@/components/ui/card";

export const UserProfileSkeleton = () => {
    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="skeleton h-24 w-24 rounded-full" />
                    <div className="text-center sm:text-left w-full">
                        <div className="skeleton h-9 w-3/4 mb-2" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="skeleton h-7 w-1/4 mb-2" />
                        <div className="skeleton h-20 w-full" />
                    </div>

                    <div className="mb-6">
                        <div className="skeleton h-7 w-1/4 mb-2" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="skeleton h-8 w-24" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};