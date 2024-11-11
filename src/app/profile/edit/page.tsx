"use client"

import {UserProfile} from "@/components";
import {withProtectedAuth,
    // withTeacherAuth
} from "@/lib/session/withAuth";

function Page() {
    return (<UserProfile/>)
}

export default withProtectedAuth(Page)
// export default withTeacherAuth(Page)