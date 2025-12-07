// Google Drive API integration for sync

import type { SpendEntry, EncryptedBackup } from '../types';
import { encryptData, decryptData } from '../crypto/encryption';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';
const BACKUP_FILENAME = 'spend-analyzer-backup.json';

// Upload encrypted backup to Google Drive appDataFolder
export const uploadBackupToDrive = async (
    accessToken: string,
    userId: string,
    expenses: SpendEntry[]
): Promise<void> => {
    // Encrypt data
    const { encryptedData, iv } = await encryptData(expenses, accessToken);

    const backup: EncryptedBackup = {
        version: '2.0.0',
        encryptedData,
        iv,
        timestamp: new Date().toISOString(),
        userId,
    };

    // Check if backup file already exists
    const existingFileId = await findBackupFile(accessToken);

    if (existingFileId) {
        // Update existing file
        await updateFile(accessToken, existingFileId, backup);
    } else {
        // Create new file
        await createFile(accessToken, backup);
    }
};

// Download and decrypt backup from Google Drive
export const downloadBackupFromDrive = async (
    accessToken: string,
    userId: string
): Promise<SpendEntry[] | null> => {
    const fileId = await findBackupFile(accessToken);

    if (!fileId) {
        return null; // No backup found
    }

    // Download file content
    const response = await fetch(
        `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to download backup from Drive');
    }

    const backup: EncryptedBackup = await response.json();

    // Verify userId matches
    if (backup.userId !== userId) {
        throw new Error('Backup belongs to different user');
    }

    // Decrypt data
    const expenses = await decryptData(
        backup.encryptedData,
        backup.iv,
        accessToken
    );

    return expenses;
};

// Find backup file in appDataFolder
const findBackupFile = async (accessToken: string): Promise<string | null> => {
    const response = await fetch(
        `${DRIVE_API_BASE}/files?spaces=appDataFolder&q=name='${BACKUP_FILENAME}'`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to search for backup file');
    }

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
};

// Create new file in appDataFolder
const createFile = async (
    accessToken: string,
    backup: EncryptedBackup
): Promise<void> => {
    const metadata = {
        name: BACKUP_FILENAME,
        parents: ['appDataFolder'],
        mimeType: 'application/json',
    };

    const form = new FormData();
    form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append(
        'file',
        new Blob([JSON.stringify(backup)], { type: 'application/json' })
    );

    const response = await fetch(
        `${UPLOAD_API_BASE}/files?uploadType=multipart`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: form,
        }
    );

    if (!response.ok) {
        throw new Error('Failed to create backup file in Drive');
    }
};

// Update existing file
const updateFile = async (
    accessToken: string,
    fileId: string,
    backup: EncryptedBackup
): Promise<void> => {
    const response = await fetch(
        `${UPLOAD_API_BASE}/files/${fileId}?uploadType=media`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backup),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update backup file in Drive');
    }
};

// Delete backup file from Drive
export const deleteBackupFromDrive = async (accessToken: string): Promise<void> => {
    const fileId = await findBackupFile(accessToken);

    if (!fileId) {
        return; // No file to delete
    }

    const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete backup from Drive');
    }
};

// Get backup metadata (without downloading)
export const getBackupMetadata = async (
    accessToken: string
): Promise<{ timestamp: string; size: number } | null> => {
    const fileId = await findBackupFile(accessToken);

    if (!fileId) {
        return null;
    }

    const response = await fetch(
        `${DRIVE_API_BASE}/files/${fileId}?fields=modifiedTime,size`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return {
        timestamp: data.modifiedTime,
        size: parseInt(data.size, 10),
    };
};
