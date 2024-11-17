'use client'

import {Calendar, Clock, DollarSign, Star, Tag, User} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CourseData} from "@/models/front_models/CourseData";
import {ProfileData} from "@/models/front_models/ProfileData";
import {MediaContent} from "@/components/Course/MediaContent";

interface CoursePageProps {
    course: CourseData
    owner: ProfileData
}

export const CourseFrontPage = ({course, owner}: CoursePageProps) => {

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                <div className="relative">
                    {course.banner ? (
                        <MediaContent content={{
                            file: course.banner,
                            mimeType: course.mimeType
                        }}/>
                    ) : (
                        <div className="w-full h-64 bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No banner available</span>
                        </div>
                    )}
                </div>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold">{course.name}</CardTitle>
                            <CardDescription className="mt-2 flex items-center">
                                <Calendar className="mr-2 h-4 w-4"/>
                                Created on {course.createdAt.toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold flex items-center">
                                <DollarSign className="h-6 w-6"/>
                                {course.price.toFixed(2)}
                            </div>
                            <div className="flex items-center mt-2">
                                <Star className="h-4 w-4 text-yellow-400 mr-1"/>
                                <span>{course.review.toFixed(1)}</span>
                                <span className="text-muted-foreground ml-1">({course.reviewNumber} reviews)</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                                <Tag className="h-3 w-3 mr-1"/>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex items-center mb-4">
                        <Clock className="h-5 w-5 mr-2"/>
                        <span>{course.duration} hours of content</span>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Course Instructor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                {owner.picture
                                    ? (<AvatarImage src={URL.createObjectURL(owner.picture)} alt={owner.fullName}/>)
                                    : (<AvatarFallback>{owner.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>)
                                }
                            </Avatar>
                            <div>
                                <div className="font-semibold">{owner.fullName}</div>
                                <div className="text-sm text-muted-foreground">Course Creator</div>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">
                        <User className="mr-2 h-4 w-4"/> View Instructor Profile
                    </Button>
                    <Button>Enroll Now</Button>
                </CardFooter>
            </Card>
        </div>
    )
}