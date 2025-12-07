import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../types';
import { signInWithGoogle, signOut as googleSignOut, initGoogleAuth } from '../lib/auth/googleAuth';

interface AuthContextType extends AuthState {
    signIn: () => Promise<void>;
    signOut: () => void;
    loading: boolean;
    demoSignIn: () => void; // Add demo mode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        expiresAt: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Google Auth
        initGoogleAuth().catch(console.error);

        // Load auth state from localStorage
        const savedAuth = localStorage.getItem('auth-state');
        if (savedAuth) {
            try {
                const parsed = JSON.parse(savedAuth);
                // Check if token is still valid
                if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
                    setAuthState(parsed);
                } else {
                    localStorage.removeItem('auth-state');
                }
            } catch (error) {
                console.error('Failed to parse saved auth state:', error);
                localStorage.removeItem('auth-state');
            }
        }
        setLoading(false);
    }, []);

    const signIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithGoogle();

            const user: User = {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                profilePicUrl: result.user.picture,
                preferences: {
                    theme: 'light',
                    currency: 'INR',
                    dateFormat: 'en-IN',
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const newAuthState: AuthState = {
                isAuthenticated: true,
                user,
                accessToken: result.accessToken,
                expiresAt: Date.now() + result.expiresIn * 1000,
            };

            setAuthState(newAuthState);
            localStorage.setItem('auth-state', JSON.stringify(newAuthState));
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Demo sign-in for testing without Google OAuth
    const demoSignIn = () => {
        const demoUser: User = {
            id: 'demo-user-123',
            name: 'Demo User',
            email: 'demo@spendanalyzer.app',
            profilePicUrl: undefined,
            preferences: {
                theme: 'light',
                currency: 'INR',
                dateFormat: 'en-IN',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const demoAuthState: AuthState = {
            isAuthenticated: true,
            user: demoUser,
            accessToken: 'demo-token',
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        setAuthState(demoAuthState);
        localStorage.setItem('auth-state', JSON.stringify(demoAuthState));
    };

    const signOut = () => {
        googleSignOut();
        setAuthState({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            expiresAt: null,
        });
        localStorage.removeItem('auth-state');
    };

    return (
        <AuthContext.Provider value={{ ...authState, signIn, signOut, loading, demoSignIn }}>
            {children}
        </AuthContext.Provider>
    );
};
