// Google OAuth and Google Identity Services integration

declare global {
    interface Window {
        google?: any;
    }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.appdata',
].join(' ');

// Initialize Google Identity Services
export const initGoogleAuth = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (window.google) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
    });
};

// Sign in with Google
export const signInWithGoogle = (): Promise<{
    accessToken: string;
    expiresIn: number;
    user: {
        id: string;
        name: string;
        email: string;
        picture?: string;
    };
}> => {
    return new Promise((resolve, reject) => {
        if (!window.google) {
            reject(new Error('Google Identity Services not loaded'));
            return;
        }

        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.error) {
                    reject(new Error(response.error));
                    return;
                }

                try {
                    // Get user info
                    const userInfo = await fetch(
                        'https://www.googleapis.com/oauth2/v2/userinfo',
                        {
                            headers: {
                                Authorization: `Bearer ${response.access_token}`,
                            },
                        }
                    );

                    const userData = await userInfo.json();

                    resolve({
                        accessToken: response.access_token,
                        expiresIn: response.expires_in,
                        user: {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            picture: userData.picture,
                        },
                    });
                } catch (error) {
                    reject(error);
                }
            },
        });

        client.requestAccessToken();
    });
};

// Refresh access token
export const refreshAccessToken = async (_refreshToken: string): Promise<string> => {
    // Note: Google Identity Services handles token refresh automatically
    // This is a placeholder for manual refresh if needed
    throw new Error('Token refresh not implemented - use automatic refresh');
};

// Sign out
export const signOut = (): void => {
    if (window.google) {
        window.google.accounts.id.disableAutoSelect();
    }
    // Clear local auth state
    localStorage.removeItem('auth-state');
};

// Check if token is expired
export const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() >= expiresAt;
};
