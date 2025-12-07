// User types
export interface User {
    id: string; // Google sub
    name: string;
    email: string;
    profilePicUrl?: string;
    preferences: UserPreferences;
    createdAt: string; // ISO8601
    updatedAt: string; // ISO8601
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    currency: string;
    dateFormat: string;
}

// Spend Entry types
export interface SpendEntry {
    id: string; // UUID
    userId: string;
    amount: number;
    category: CategoryType;
    customCategory?: string;
    notes?: string;
    timestamp: string; // ISO8601
    createdAt: string; // ISO8601
    updatedAt: string; // ISO8601
    deleted?: boolean; // Soft delete flag
}

export type CategoryType =
    | 'food'
    | 'travel'
    | 'bills'
    | 'shopping'
    | 'entertainment'
    | 'health'
    | 'custom';

export interface Category {
    id: CategoryType;
    name: string;
    icon: string;
    color: string;
}

// Sync types
export interface SyncState {
    userId: string;
    lastSyncTimestamp: string; // ISO8601
    lastSyncSuccess: boolean;
    pendingChanges: number;
    syncInProgress: boolean;
    lastError?: string;
}

export interface SyncConflict {
    id: string;
    entryId: string;
    localVersion: SpendEntry;
    remoteVersion: SpendEntry;
    detectedAt: string; // ISO8601
    resolved: boolean;
}

export interface EncryptedBackup {
    version: string;
    encryptedData: string; // Base64 encoded encrypted JSON
    iv: string; // Initialization vector for AES-GCM
    timestamp: string; // ISO8601
    userId: string;
}

// Analytics types
export interface CategorySummary {
    category: CategoryType;
    total: number;
    count: number;
    percentage: number;
}

export interface TimePeriodSummary {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
}

export interface TrendDataPoint {
    date: string; // YYYY-MM-DD
    amount: number;
}

// Auth types
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    expiresAt: number | null;
}

export interface GoogleAuthResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
}

// UI types
export type TimeFilter = 'today' | 'week' | 'month' | 'year';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

export interface ModalState {
    isOpen: boolean;
    mode: 'add' | 'edit';
    entry?: SpendEntry;
}
