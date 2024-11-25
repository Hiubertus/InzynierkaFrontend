'use client'

import {Calendar, Clock, Pencil, Star, Tag, User} from 'lucide-react'
import {Avatar} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CourseData} from "@/models/front_models/CourseData"
import {ProfileData} from "@/models/front_models/ProfileData"
import {MediaContent} from "@/components/Course/MediaContent"
import {PointsComponent} from "@/components/PointsComponent/PointsComponent"
import {AvatarComponent} from "@/components/AvatarComponent/AvatarComponent";
import {useRouter} from "next/navigation";
import useCourseStore from "@/lib/stores/courseStore";
import {useToast} from "@/hooks/use-toast";
import {ToastAction} from "@/components/ui/toast";


interface CoursePageProps {
    course: CourseData
    owner: ProfileData
}

export const CourseFrontPage = ({course, owner}: CoursePageProps) => {
    const { buyCourseAction } = useCourseStore()
    const router = useRouter()
    const { toast } = useToast()

    const handlePurchase = async () => {
        try {
            await buyCourseAction(course.id)
            toast({
                title: "Success",
                description: "Course purchased successfully",
            })

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('log in')) {
                    toast({
                        variant: "destructive",
                        title: "Authentication Required",
                        description: "Please log in to purchase this course",
                        action: (
                            <ToastAction altText="Login" onClick={() => router.push('/auth')}>
                                Login
                            </ToastAction>
                        )
                    })
                } else if (error.message.includes('funds')) {
                    toast({
                        variant: "destructive",
                        title: "Insufficient Funds",
                        description: "You don't have enough points to purchase this course"
                    })
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.message
                    })
                }
            }
        }
    }

    const renderActionButton = () => {
        switch (course.relationshipType) {
            case 'AVAILABLE':
                return (
                    <Button onClick={handlePurchase}>
                        Purchase Course
                    </Button>
                )
            case 'OWNER':
                return (
                    <Button
                        variant="secondary"
                        onClick={() => router.push(`/courses/course/${course.id}/edit`)}
                    >
                        <Pencil className="mr-2 h-4 w-4"/>
                        Edit Course
                    </Button>
                )
            case 'PURCHASED':
                return (
                    <Button
                        variant="default"
                        onClick={() => router.push(`/courses/course/${course.id}/content`)}
                    >
                        Enter Course
                    </Button>
                )
            case null:
                return null
            default:
                return null
        }
    }
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
                            <PointsComponent points={course.price}/>
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
                                <AvatarComponent userProfile={owner}/>
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
                    {renderActionButton()}
                </CardFooter>
            </Card>

        </div>
    )
}