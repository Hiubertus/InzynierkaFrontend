import { NextResponse } from 'next/server';
import { getRefreshToken } from '@/lib/session/session';
import axios from 'axios';

export async function POST() {
    try {
        const token = await getRefreshToken();

        if (!token) {
            return NextResponse.json(
                { error: 'No refresh token' },
                { status: 401 }
            );
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/access-token`,
            { token },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json({
            accessToken: response.data.data.accessToken
        });
    } catch (error) {
        console.error('Error in refresh API route:', error);
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 401 }
        );
    }
}