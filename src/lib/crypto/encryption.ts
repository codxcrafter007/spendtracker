// Client-side encryption using Web Crypto API
// Key derivation: OAuth token + device salt

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_KEY = 'spend-analyzer-device-salt';

// Generate or retrieve device salt
export const getDeviceSalt = (): string => {
    let salt = localStorage.getItem(SALT_KEY);
    if (!salt) {
        // Generate new salt
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        salt = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
        localStorage.setItem(SALT_KEY, salt);
    }
    return salt;
};

// Derive encryption key from OAuth token + device salt
export const deriveKey = async (oauthToken: string): Promise<CryptoKey> => {
    const salt = getDeviceSalt();
    const keyMaterial = `${oauthToken}:${salt}`;

    // Convert to ArrayBuffer
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyMaterial);

    // Import as raw key material
    const importedKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    // Derive AES-GCM key
    const saltBuffer = encoder.encode(salt);
    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256',
        },
        importedKey,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );

    return key;
};

// Encrypt data
export const encryptData = async (
    data: any,
    oauthToken: string
): Promise<{ encryptedData: string; iv: string }> => {
    const key = await deriveKey(oauthToken);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Convert data to JSON string then ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        dataBuffer
    );

    // Convert to base64
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedData = btoa(String.fromCharCode(...encryptedArray));
    const ivString = btoa(String.fromCharCode(...iv));

    return { encryptedData, iv: ivString };
};

// Decrypt data
export const decryptData = async (
    encryptedData: string,
    iv: string,
    oauthToken: string
): Promise<any> => {
    const key = await deriveKey(oauthToken);

    // Convert from base64
    const encryptedArray = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const ivArray = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv: ivArray },
        key,
        encryptedArray
    );

    // Convert back to JSON
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString);
};

// Test encryption/decryption
export const testEncryption = async (oauthToken: string): Promise<boolean> => {
    try {
        const testData = { test: 'Hello, World!', timestamp: Date.now() };
        const { encryptedData, iv } = await encryptData(testData, oauthToken);
        const decrypted = await decryptData(encryptedData, iv, oauthToken);
        return JSON.stringify(testData) === JSON.stringify(decrypted);
    } catch (error) {
        console.error('Encryption test failed:', error);
        return false;
    }
};
