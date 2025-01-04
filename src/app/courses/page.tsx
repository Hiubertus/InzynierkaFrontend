'use client'

import {useState, useEffect, useCallback} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { useCourseStore } from "@/lib/stores/courseStore"
import { useProfileStore } from "@/lib/stores/profileStore"
import {CourseGrid} from "@/components/Course/CoursesGrid"
import {useUserStore} from "@/lib/stores/userStore"
import {useAuthStore} from "@/lib/stores/authStore"
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import PaginationControls from "@/components/Pagination/Pagination";
import {ROUTES} from "@/components/Navbar/routes";
import {useRouter} from "next/navigation";

type CourseType = 'shop' | 'owned' | 'created'

const TAB_CONFIG: Array<{
    value: CourseType
    label: string
    requiredRole?: 'USER' | 'TEACHER'
}> = [
    {value: 'created', label: 'Created Courses', requiredRole: 'TEACHER'},
    {value: 'owned', label: 'Owned Courses', requiredRole: 'USER'},
    {value: 'shop', label: 'Courses Shop'}
]

export default function Page() {
    // const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<CourseType>('shop')
    const [isLoading, setIsLoading] = useState(false)

    const {
        courses,
        error,
        fetchShopCourses,
        fetchOwnedCourses,
        fetchCreatedCourses,
        setCourses,
        currentPage,
        totalPages,
        resetPage
    } = useCourseStore()
    const {userData} = useUserStore()
    const {profiles} = useProfileStore()
    const {isInitialized: isAuthInitialized} = useAuthStore()
    const router = useRouter();

    const hasAccessToTab = useCallback((type: CourseType) => {
        const config = TAB_CONFIG.find(tab => tab.value === type)
        if (!config?.requiredRole) return true
        return userData?.roles?.includes(config.requiredRole)
    }, [userData?.roles])

    const fetchTabData = useCallback(async (tab: CourseType) => {
        setCourses([])

        if (!hasAccessToTab(tab)) {
            return
        }

        setIsLoading(true)
        try {
            switch(tab) {
                case 'shop':
                    await fetchShopCourses()
                    break
                case 'owned':
                    await fetchOwnedCourses()
                    break
                case 'created':
                    await fetchCreatedCourses()
                    break
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setIsLoading(false)
        }
    }, [hasAccessToTab, fetchShopCourses, fetchOwnedCourses, fetchCreatedCourses, setCourses])

    useEffect(() => {
        if (isAuthInitialized) {
            resetPage();
            fetchTabData(activeTab)
        }
    }, [activeTab, isAuthInitialized, fetchTabData, resetPage])

    const handleTabChange = (value: CourseType) => {
        if (!isLoading) {
            resetPage();
            setActiveTab(value)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Tabs
                defaultValue="shop"
                className="w-full"
                onValueChange={(value) => handleTabChange(value as CourseType)}
            >
                <TabsList className="grid w-full grid-cols-3">
                    {TAB_CONFIG.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            disabled={isLoading}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {TAB_CONFIG.map(tab => (
                    <TabsContent key={tab.value} value={tab.value}>
                        {courses.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <PaginationControls
                                    currentPage={currentPage + 1}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        switch(activeTab) {
                                            case 'shop':
                                                fetchShopCourses(page - 1);
                                                break;
                                            case 'owned':
                                                fetchOwnedCourses(page - 1);
                                                break;
                                            case 'created':
                                                fetchCreatedCourses(undefined, page - 1);
                                                break;
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <CourseGrid
                            gridType={tab.value}
                            userData={userData}
                            courses={courses}
                            profiles={profiles}
                            isLoading={isLoading && hasAccessToTab(tab.value)}
                            error={error}
                        />
                        {tab.value === 'created' && userData?.roles.includes('TEACHER') && (
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
                ))}
            </Tabs>
        </div>
    )
}