import type { Category, CategoryType } from '../types';

export const CATEGORIES: Category[] = [
    { id: 'food', name: 'Food', icon: '🍔', color: '#f59e0b' },
    { id: 'travel', name: 'Travel', icon: '🚗', color: '#3b82f6' },
    { id: 'bills', name: 'Bills', icon: '💡', color: '#ef4444' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { id: 'health', name: 'Health', icon: '💊', color: '#10b981' },
    { id: 'custom', name: 'Custom', icon: '✏️', color: '#6b7280' },
];

export const getCategoryById = (id: CategoryType): Category => {
    return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

export const getCategoryColor = (id: CategoryType): string => {
    return getCategoryById(id).color;
};

export const getCategoryIcon = (id: CategoryType): string => {
    return getCategoryById(id).icon;
};

export const detectCategory = (notes: string): CategoryType => {
    const lowerNotes = notes.toLowerCase();
    if (/lunch|dinner|breakfast|food|restaurant|cafe|coffee|meal|snack|grocery/i.test(lowerNotes)) return 'food';
    if (/uber|taxi|bus|train|flight|fuel|gas|parking|toll/i.test(lowerNotes)) return 'travel';
    if (/rent|electricity|water|internet|phone|bill|utility|subscription/i.test(lowerNotes)) return 'bills';
    if (/shopping|clothes|amazon|flipkart|electronics|gadget/i.test(lowerNotes)) return 'shopping';
    if (/movie|netflix|spotify|game|concert|party|entertainment/i.test(lowerNotes)) return 'entertainment';
    if (/doctor|medicine|pharmacy|hospital|gym|fitness|health/i.test(lowerNotes)) return 'health';
    return 'custom';
};
