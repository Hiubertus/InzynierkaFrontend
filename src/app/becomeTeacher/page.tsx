'use client'

import { useAuthStore } from "@/lib/stores/authStore";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { useToast} from "@/hooks/use-toast";
import { FaChalkboardTeacher } from "react-icons/fa";
import {withProtectedAuth} from "@/lib/session/withAuth";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/components/Navbar/routes";
import {becomeTeacherComplete} from "@/lib/session/userData/becomeTeacher";
import {fetchUserData} from "@/lib/session/userData/fetchUserData";

function Page() {
    const { accessToken } = useAuthStore();
    const { userData, setUserData } = useUserStore();
    const { toast } = useToast();
    const router = useRouter();

    const becomeTeacher = async () => {
        if (!userData?.roles) {
            toast({
                variant: "destructive",
                title: "Login required",
                description: "You must be logged in and verified to become a teacher!."
            });
        }
        else if(!userData?.roles.includes('VERIFIED')) {
            toast({
                variant: "destructive",
                title: "Verification Required",
                description: "You must be verified to become a teacher. Please verify your account first."
            });
            return;
        }
        else if(userData?.roles.includes('TEACHER')) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "You are already a teacher!"
            });
            return;
        }
        else if (userData?.points < 1000) {
            toast({
                variant: "destructive",
                title: "Insufficient funds",
                description: "You need to pay 1000 points to become a Teacher"
            });
            return;
        }

        try {
            await becomeTeacherComplete(accessToken);

            toast({
                title: "Success!",
                description: "You are now a teacher. You can start creating courses.",
            });
            router.push(ROUTES.HOME);

        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong while upgrading your account."
            });
        } finally {
            const data = await fetchUserData(accessToken)
            if(data) {
                setUserData(data);
            }

        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center space-y-6 p-8 rounded-lg bg-white shadow-lg max-w-md w-full">
                <FaChalkboardTeacher className="w-16 h-16 mx-auto text-blue-500" />
                <h1 className="text-3xl font-bold tracking-tight">Become a Teacher</h1>
                <p className="text-gray-600">
                    Share your knowledge with the world. Create engaging courses and help others learn.
                </p>
                <Button
                    size="lg"
                    className="w-full"
                    onClick={becomeTeacher}
                >
                    Start Teaching Today
                </Button>
            </div>
        </div>
    );
}

export default withProtectedAuth(Page)