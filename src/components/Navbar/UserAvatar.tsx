import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { ROUTES} from "@/components/Navbar/routes";

interface UserAvatarProps {
    picture: File | null;
    fullName: string;
}

export const UserAvatar = ({ picture, fullName }: UserAvatarProps) => {
    return (
        <Link href={ROUTES.PROFILE}>
            <Avatar className="cursor-pointer">
                {picture ? (
                    <AvatarImage
                        src={URL.createObjectURL(picture)}
                        alt={`Profile picture of ${fullName}`}
                    />
                ) : (
                    <AvatarFallback>
                        {fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                )}
            </Avatar>
        </Link>
    );
};