import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserProfilePageSkeleton: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="text-center sm:text-left w-full">
                        <Skeleton className="h-9 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Skeleton className="h-7 w-1/4 mb-2" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-7 w-1/4" />
                            <Skeleton className="h-6 w-10" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((index) => (
                                <Skeleton key={index} className="h-8 w-24" />
                            ))}
                        </div>
                    </div>

                    <Skeleton className="h-10 w-full mb-6" />

                    <Skeleton className="h-8 w-1/3 mb-4" />

                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">
                                <Skeleton className="h-5 w-24" />
                            </TabsTrigger>
                            <TabsTrigger value="password">
                                <Skeleton className="h-5 w-32" />
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="email">
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </TabsContent>
                        <TabsContent value="password">
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};