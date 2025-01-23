"use client"
import { withProtectedAuth } from "@/lib/session/withAuth";
import { History } from "@/components/History/History";

function Page() {
    return (
        <div className="container mx-auto py-8">
            <History />
        </div>
    );
}

export default withProtectedAuth(Page);