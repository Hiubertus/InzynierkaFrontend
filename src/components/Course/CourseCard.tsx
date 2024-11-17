import { Calendar, DollarSign, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {CourseData} from "@/models/front_models/CourseData";
import {ProfileData} from "@/models/front_models/ProfileData";
import Link from "next/link";

export const CourseCard = ({ course, userProfile }: {course: CourseData, userProfile: ProfileData}) => {
    return (
        <Link href={`/courses/course/${course.id}`} className="block transition-transform hover:scale-[1.02]">
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                                { userProfile.picture ?
                                    (<AvatarImage src={URL.createObjectURL(userProfile.picture)} alt={userProfile.fullName} />) :
                                    (<AvatarFallback>{userProfile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>)
                                }
                            </Avatar>
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
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{course.review.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground ml-1">({course.reviewNumber})</span>
                        </div>
                        <div className="text-lg font-bold flex items-center">
                            <DollarSign className="h-4 w-4" />
                            {course.price.toFixed(2)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}