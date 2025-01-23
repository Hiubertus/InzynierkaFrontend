import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Mountain} from "lucide-react";
import {ROUTES} from "@/components/Navbar/routes";
import {Roles} from "@/lib/stores/userStore";


export const NavLinks = ({roles}: { roles: Roles[] | undefined }) => {
    return (
        <div className="flex items-center space-x-4">
            <Link href={ROUTES.HOME} prefetch={true} className="flex-shrink-0">
                <Mountain className="h-8 w-8 text-black" aria-hidden="true"/>
                <span className="sr-only">Home</span>
            </Link>
            <Link href={ROUTES.COURSES}>
                <Button variant="ghost">
                    Courses
                </Button>
            </Link>
            { roles?.includes('USER') && !roles?.includes('TEACHER') &&
                (<Link href={ROUTES.BECOME_TEACHER}>
                    <Button variant="ghost">
                        Become Teacher
                    </Button>
                </Link>)
            }

        </div>
    );
};