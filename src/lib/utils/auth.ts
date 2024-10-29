export async function refreshAccessToken(refreshToken: string) {
    try {
        const response = await fetch('localhost:8080/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) throw new Error('Failed to refresh token');

        const data = await response.json();
        console.log(data);
        return data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}