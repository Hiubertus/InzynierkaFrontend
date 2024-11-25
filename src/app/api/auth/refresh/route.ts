import { NextResponse } from 'next/server';
import { getRefreshToken } from "@/lib/session/auth/getRefreshToken";
import { getAccessToken } from "@/lib/session/auth/getAccessToken";

export async function POST() {
    try {
        const token = await getRefreshToken();

        if (!token) {
            return NextResponse.json(
                { error: 'No refresh token' },
                { status: 401 }
            );
        }

        const response = await getAccessToken(token);

        return NextResponse.json({
            accessToken: response.data.accessToken
        });
    } catch {
        console.error('Error in refresh API route:');
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 401 }
        );
    }
}