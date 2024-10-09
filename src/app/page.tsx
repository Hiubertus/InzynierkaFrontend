import {UserProfile} from "@/components";
import {useAuthStore} from "@/lib/stores/authStore";


export default function Home() {
    const { isAuthenticated} = useAuthStore()
  return (
    <div className={"container mx-auto p-5 sm:p-7 lg:p-9"}>
        {/*<UserProfile/>*/}
        Stan zalogowania: {isAuthenticated}
    </div>
  );
}
