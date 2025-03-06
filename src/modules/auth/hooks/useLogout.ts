import { useState } from 'react';
import { logoutUser, refreshToken } from '../services/auth'; // Ensure your auth service exports a properly named logout function

export function useLogout() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function logout() {
        const TOKEN = localStorage.getItem('accessToken')?.toString();
        //console.log(TOKEN);
        setLoading(true);
        try {
        if (!TOKEN) {
            throw new Error('No access token found');
        }
        const response = await logoutUser(TOKEN);
        //jscookie.remove('x-refresh-token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        return response;
    } catch (err) {
        console.log(err);
        if (err instanceof Error && err.message === 'Invalid token') {
            try {
                console.log('Refreshing token');

                await refreshToken();
                return logout();
            } catch (err) {
                console.error(err);
                setError('Failed to logout');
            }
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
