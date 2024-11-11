"use client"

import {Auth} from "@/components";
import {withPublicAuth} from "@/lib/session/withAuth";

function Page() {
    return (<Auth/>)
}

export default withPublicAuth(Page)