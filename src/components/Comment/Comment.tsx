import { Star, StarHalf } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { ProfileData } from "@/models/front_models/ProfileData"
import {AvatarComponent} from "@/components/AvatarComponent/AvatarComponent";

interface CommentProps {
    profile: ProfileData
    rating: number
    comment: string
    createdAt: Date
}

export const Comment = ({ profile, rating, comment, createdAt }: CommentProps) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <AvatarComponent userProfile={profile}/>
                    <div className="space-y-1">
                        <h3 className="font-semibold">{profile.fullName}</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date(createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                    {i < fullStars ? (
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ) : i === fullStars && hasHalfStar ? (
                                        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ) : (
                                        <Star className="h-4 w-4 text-gray-300" />
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-sm">{comment}</p>
            </CardContent>
        </Card>
    )
}