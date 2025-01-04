"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Trophy, Pencil, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CourseGrid} from "@/components/Course/CoursesGrid";
import {StarRating} from "@/components/StarRating/StarRating";
import { useProfileStore } from "@/lib/stores/profileStore";
import { useCourseStore } from "@/lib/stores/courseStore";
import {useRouter, useParams} from 'next/navigation';
import {ROUTES} from "@/components/Navbar/routes";
import {useUserStore} from "@/lib/stores/userStore";
import {formatDate} from "@/lib/utils/formatDate";
import {getRoleDisplay} from "@/lib/utils/roleDisplay";
import {useEffect} from "react";
import PaginationControls from "@/components/Pagination/Pagination";
import {UserProfileSkeleton} from "@/components/UserProfile/UserProfileSkeleton";
import {ReviewList} from "@/components/Review/ReviewList";

export const UserProfile = () => {
    const router = useRouter();
    const params = useParams();
    const profileId = Number(params.id);
    const {profiles, fetchProfile, isLoading: isProfileLoading} = useProfileStore();
    const {userData} = useUserStore();
    const {
        courses,
        currentPage,
        totalPages,
        error,
        fetchProfileCourses,
        resetPage,
        fetchOwnedCourses,
        setCourses,
        isLoading: isCoursesLoading
    } = useCourseStore();

    const userProfile = profiles.find(profile => profile.id === profileId);
    const isOwnProfile = userData?.id === profileId;
    const isTeacher = userProfile?.roles?.includes('TEACHER') || (isOwnProfile && userData?.roles?.includes('TEACHER'));


    useEffect(() => {
        fetchProfile(profileId);
    }, [profileId, fetchProfile]);

    if (isProfileLoading || !userProfile) return <UserProfileSkeleton/>;

    const handleTabChange = (value: string) => {
        resetPage();
        setCourses([]);

        if (value === 'purchased' && isOwnProfile) {
            fetchOwnedCourses(0);
        } else if (value === 'created' && isTeacher) {
            fetchProfileCourses(profileId, 0);
        }
    };

    const getTabsCount = () => {
        if (isTeacher && isOwnProfile) return 4;
        if (isTeacher) return 3;
        if (isOwnProfile) return 2;
        return 1;
    };

    const getGridClass = (count: number) => {
        switch (count) {
            case 4:
                return "grid-cols-4";
            case 3:
                return "grid-cols-3";
            case 2:
                return "grid-cols-2";
            default:
                return "grid-cols-1";
        }
    };

    const UserInfoContent = () => (
        <Card className={"w-full max-w-4xl mx-auto"}>
            <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-24 w-24">
                    {userProfile.picture ? (
                        <AvatarImage
                            src={URL.createObjectURL(userProfile.picture)}
                            alt={`Profile picture of ${userProfile.fullName}`}
                        />
                    ) : (
                        <AvatarFallback>
                            {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="text-center sm:text-left w-full flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{userProfile.fullName}</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{getRoleDisplay(userProfile.roles)}</Badge>
                                <span className="text-sm text-muted-foreground">
                                    Member since {formatDate(userProfile.createdAt)}
                                </span>
                            </div>
                            {userProfile.review !== null && userProfile.reviewNumber !== null && (
                                <StarRating
                                    rating={userProfile.review}
                                    ratingNumber={userProfile.reviewNumber}
                                />
                            )}
                        </div>
                    </div>
                    {isOwnProfile && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => router.push(ROUTES.PROFILE_EDIT)}
                        >
                            <Pencil className="h-4 w-4"/>
                            Edit Profile
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Description:</h3>
                    <p className="text-muted-foreground">
                        {userProfile.description || "No description provided."}
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Achievements:</h3>
                    {userProfile.badgesVisible ? (
                        <div className="flex flex-wrap gap-2">
                            {userProfile.badges.length > 0 ? (
                                userProfile.badges.map((achievement, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 text-sm py-1 px-2"
                                    >
                                        <Trophy className="h-4 w-4"/>
                                        {achievement}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-muted-foreground">
                                    No achievements yet!
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            Achievements are hidden
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div>
            <Tabs defaultValue="info" className="w-full" onValueChange={handleTabChange}>
                <TabsList className={`grid w-full ${getGridClass(getTabsCount())}`}>
                    <TabsTrigger value="info">Profile Info</TabsTrigger>
                    {isOwnProfile && (
                        <TabsTrigger value="purchased">Purchased Courses</TabsTrigger>
                    )}
                    {isTeacher && (
                        <>
                            <TabsTrigger value="created">Created Courses</TabsTrigger>
                            <TabsTrigger value="reviews">Teacher Reviews</TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="info">
                    <UserInfoContent/>
                </TabsContent>

                {isOwnProfile && (
                    <TabsContent value="purchased">
                        <CourseGrid
                            gridType="owned"
                            userData={userData}
                            courses={courses}
                            profiles={profiles}
                            isLoading={isCoursesLoading}
                            error={error}
                        />
                        {courses.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <PaginationControls
                                    currentPage={currentPage + 1}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        fetchOwnedCourses(page - 1);
                                    }}
                                />
                            </div>
                        )}
                    </TabsContent>
                )}

                {isTeacher && (
                    <>
                        <TabsContent value="created">
                            {courses.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <PaginationControls
                                        currentPage={currentPage + 1}
                                        totalPages={totalPages}
                                        onPageChange={(page) => {
                                            fetchProfileCourses(profileId, page - 1);
                                        }}
                                    />
                                </div>
                            )}
                            <CourseGrid
                                gridType="teacherCourses"
                                userData={userData}
                                courses={courses}
                                profiles={profiles}
                                isLoading={isCoursesLoading}
                                error={error}
                            />
                            {isOwnProfile && (
                                <div className="flex items-center justify-center mt-6">
                                    <Button
                                        variant="default"
                                        className="flex items-center gap-2"
                                        onClick={() => router.push(`${ROUTES.COURSES}/creator`)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Course
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="reviews">
                            <ReviewList
                                contentId={profileId}
                                type="teacher"
                                ownerId={profileId}
                                isReadyForReviews={!isProfileLoading}
                            />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
};