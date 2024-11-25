"use client"

import {UserProfileEdit} from "@/components";
import {withProtectedAuth,
} from "@/lib/session/withAuth";

function Page() {
    return (<UserProfileEdit/>)
}

export default withProtectedAuth(Page)