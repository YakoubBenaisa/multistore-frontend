import { useState } from 'react';
import { logoutUser } from '../service/auth'; // Ensure your auth service exports a properly named logout function

export function useLogout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function logout() {
        const TOKEN = localStorage.getItem('accessToken')?.toString();
        setLoading(true);
        try {
        if (!TOKEN) {
            throw new Error('No refresh token found');
        }
        const response = await logoutUser(TOKEN);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        return response;
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Failed to logout');
        }
        throw err;
    } finally {
        setLoading(false);
    }
    }

    return { logout, loading, error };
    }
