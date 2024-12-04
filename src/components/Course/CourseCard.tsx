import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CourseData } from "@/models/front_models/CourseData";
import { ProfileData } from "@/models/front_models/ProfileData";
import Link from "next/link";
import { PointsComponent } from "@/components/PointsComponent/PointsComponent";
import { AvatarComponent } from "@/components/AvatarComponent/AvatarComponent";
import { StarRating } from "@/components/StarRating/StarRating";
import { useRouter } from 'next/navigation';
import React from "react";

export const CourseCard = ({ course, userProfile }: {course: CourseData, userProfile: ProfileData}) => {
    const router = useRouter();

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/profile/${userProfile.id}`);
    };

    return (
        <Link href={`/courses/course/${course.id}/frontpage`} className="block transition-transform hover:scale-[1.02]">
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2" onClick={handleAvatarClick}>
                            <AvatarComponent userProfile={userProfile} isLink={false} />
                            <span className="text-sm">{userProfile.fullName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {course.createdAt.toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {course.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <StarRating rating={course.review} ratingNumber={course.reviewNumber}/>
                        <PointsComponent points={course.price}/>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}