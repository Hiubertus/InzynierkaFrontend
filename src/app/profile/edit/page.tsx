"use client"

import {UserProfile} from "@/components";
import {withProtectedAuth,
} from "@/lib/session/withAuth";

function Page() {
    return (<UserProfile/>)
}

export default withProtectedAuth(Page)