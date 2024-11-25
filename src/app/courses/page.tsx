'use client'

import {useState, useEffect, useCallback} from 'react'
import {Input} from "@/components/ui/input"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import useCourseStore from "@/lib/stores/courseStore"
import useProfileStore from "@/lib/stores/profileStore"
import {CourseGrid} from "@/components/Course/CoursesGrid"
import {useUserStore} from "@/lib/stores/userStore"
import {useAuthStore} from "@/lib/stores/authStore"

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
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<CourseType>('shop')
    const [isLoading, setIsLoading] = useState(false)

    const {
        courses,
        error,
        fetchShopCourses,
        fetchOwnedCourses,
        fetchCreatedCourses,
        setCourses
    } = useCourseStore()
    const {userData} = useUserStore()
    const {profiles} = useProfileStore()
    const {isInitialized: isAuthInitialized} = useAuthStore()

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
            fetchTabData(activeTab)
        }
    }, [activeTab, isAuthInitialized, fetchTabData])

    const handleTabChange = (value: CourseType) => {
        if (!isLoading) {
            setActiveTab(value)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
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
                        <CourseGrid
                            gridType={tab.value}
                            userData={userData}
                            courses={courses}
                            profiles={profiles}
                            isLoading={isLoading && hasAccessToTab(tab.value)}
                            error={error}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}