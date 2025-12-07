import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SyncState } from '../types';
import { useAuth } from './AuthContext';
import { uploadBackupToDrive, downloadBackupFromDrive } from '../lib/sync/driveSync';
import { getAllExpenses } from '../lib/db/expenseStore';

interface SyncContextType {
    syncState: SyncState;
    syncNow: () => Promise<void>;
    lastSyncTime: string | null;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useSync must be used within SyncProvider');
    }
    return context;
};

interface SyncProviderProps {
    children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
    const { user, accessToken } = useAuth();
    const [syncState, setSyncState] = useState<SyncState>({
        userId: user?.id || '',
        lastSyncTimestamp: '',
        lastSyncSuccess: false,
        pendingChanges: 0,
        syncInProgress: false,
    });
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    const syncNow = useCallback(async () => {
        if (!user || !accessToken) {
            console.warn('Cannot sync: user not authenticated');
            return;
        }

        if (syncState.syncInProgress) {
            console.warn('Sync already in progress');
            return;
        }

        setSyncState((prev) => ({ ...prev, syncInProgress: true }));

        try {
            // Get all expenses
            const expenses = await getAllExpenses(user.id);

            // Upload to Drive
            await uploadBackupToDrive(accessToken, user.id, expenses);

            const now = new Date().toISOString();
            setSyncState({
                userId: user.id,
                lastSyncTimestamp: now,
                lastSyncSuccess: true,
                pendingChanges: 0,
                syncInProgress: false,
            });
            setLastSyncTime(now);
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncState((prev) => ({
                ...prev,
                lastSyncSuccess: false,
                syncInProgress: false,
                lastError: error instanceof Error ? error.message : 'Unknown error',
            }));
        }
    }, [user, accessToken, syncState.syncInProgress]);

    return (
        <SyncContext.Provider value={{ syncState, syncNow, lastSyncTime }}>
            {children}
        </SyncContext.Provider>
    );
};
