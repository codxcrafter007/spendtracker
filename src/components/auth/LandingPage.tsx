import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const LandingPage: React.FC = () => {
    const { signIn, loading, demoSignIn } = useAuth();

    const handleGoogleSignIn = () => {
        signIn();
    };

    const handleDemoMode = () => {
        demoSignIn();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent mb-3 uppercase" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.02em' }}>
                        Spend Analyzer
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">
                        Track expenses, stay in control
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Sign in to manage your expenses
                            </p>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 px-6 py-4 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                                    or
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDemoMode}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Try Demo Mode
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Your data stays private and secure on your device
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>100% Offline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Fast</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
