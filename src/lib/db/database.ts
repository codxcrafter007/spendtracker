import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { SpendEntry, User, SyncState, SyncConflict } from '../types';

// Database schema
interface SpendAnalyzerDB extends DBSchema {
    users: {
        key: string;
        value: User;
    };
    expenses: {
        key: string;
        value: SpendEntry;
        indexes: {
            'by-user': string;
            'by-timestamp': string;
            'by-category': string;
        };
    };
    syncState: {
        key: string;
        value: SyncState;
    };
    conflicts: {
        key: string;
        value: SyncConflict;
        indexes: {
            'by-user': string;
        };
    };
}

const DB_NAME = 'SpendAnalyzerDB';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SpendAnalyzerDB> | null = null;

// Initialize database
export const initDatabase = async (): Promise<IDBPDatabase<SpendAnalyzerDB>> => {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await openDB<SpendAnalyzerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create users store
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id' });
            }

            // Create expenses store with indexes
            if (!db.objectStoreNames.contains('expenses')) {
                const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
                expenseStore.createIndex('by-user', 'userId');
                expenseStore.createIndex('by-timestamp', 'timestamp');
                expenseStore.createIndex('by-category', 'category');
            }

            // Create syncState store
            if (!db.objectStoreNames.contains('syncState')) {
                db.createObjectStore('syncState', { keyPath: 'userId' });
            }

            // Create conflicts store
            if (!db.objectStoreNames.contains('conflicts')) {
                const conflictStore = db.createObjectStore('conflicts', { keyPath: 'id' });
                conflictStore.createIndex('by-user', 'userId');
            }
        },
    });

    return dbInstance;
};

// Get database instance
export const getDB = async (): Promise<IDBPDatabase<SpendAnalyzerDB>> => {
    if (!dbInstance) {
        return await initDatabase();
    }
    return dbInstance;
};

// Close database
export const closeDatabase = async (): Promise<void> => {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
    const db = await getDB();
    const tx = db.transaction(['users', 'expenses', 'syncState', 'conflicts'], 'readwrite');

    await Promise.all([
        tx.objectStore('users').clear(),
        tx.objectStore('expenses').clear(),
        tx.objectStore('syncState').clear(),
        tx.objectStore('conflicts').clear(),
    ]);

    await tx.done;
};
