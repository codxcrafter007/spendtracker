import { getDB } from './database';
import type { SpendEntry, CategoryType } from '../../types';
import { generateId, getDateRange, isDateInRange } from '../../utils/helpers';

export const addExpense = async (
    userId: string,
    amount: number,
    category: CategoryType,
    timestamp: string,
    notes?: string,
    customCategory?: string
): Promise<SpendEntry> => {
    const db = await getDB();
    const now = new Date().toISOString();

    const expense: SpendEntry = {
        id: generateId(),
        userId,
        amount,
        category,
        customCategory,
        notes,
        timestamp,
        createdAt: now,
        updatedAt: now,
    };

    await db.add('expenses', expense);
    return expense;
};

export const updateExpense = async (
    id: string,
    updates: Partial<Omit<SpendEntry, 'id' | 'userId' | 'createdAt'>>
): Promise<SpendEntry> => {
    const db = await getDB();
    const expense = await db.get('expenses', id);

    if (!expense) {
        throw new Error(`Expense with id ${id} not found`);
    }

    const updatedExpense: SpendEntry = {
        ...expense,
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    await db.put('expenses', updatedExpense);
    return updatedExpense;
};

export const deleteExpense = async (id: string): Promise<void> => {
    const db = await getDB();
    const expense = await db.get('expenses', id);

    if (!expense) {
        throw new Error(`Expense with id ${id} not found`);
    }

    const deletedExpense: SpendEntry = {
        ...expense,
        deleted: true,
        updatedAt: new Date().toISOString(),
    };

    await db.put('expenses', deletedExpense);
};

export const hardDeleteExpense = async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('expenses', id);
};

export const getExpenseById = async (id: string): Promise<SpendEntry | undefined> => {
    const db = await getDB();
    return await db.get('expenses', id);
};

export const getAllExpenses = async (userId: string): Promise<SpendEntry[]> => {
    const db = await getDB();
    const expenses = await db.getAllFromIndex('expenses', 'by-user', userId);
    return expenses.filter((e) => !e.deleted);
};

export const getExpensesByDateRange = async (
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<SpendEntry[]> => {
    const expenses = await getAllExpenses(userId);
    return expenses.filter((expense) => isDateInRange(expense.timestamp, startDate, endDate));
};

export const getExpensesByCategory = async (
    userId: string,
    category: CategoryType
): Promise<SpendEntry[]> => {
    const db = await getDB();
    const expenses = await db.getAllFromIndex('expenses', 'by-category', category);
    return expenses.filter((e) => e.userId === userId && !e.deleted);
};

export const getTodayTotal = async (userId: string): Promise<number> => {
    const { start, end } = getDateRange('today');
    const expenses = await getExpensesByDateRange(userId, start, end);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getWeekTotal = async (userId: string): Promise<number> => {
    const { start, end } = getDateRange('week');
    const expenses = await getExpensesByDateRange(userId, start, end);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getMonthTotal = async (userId: string): Promise<number> => {
    const { start, end } = getDateRange('month');
    const expenses = await getExpensesByDateRange(userId, start, end);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getPreviousWeekTotal = async (userId: string): Promise<number> => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    const expenses = await getExpensesByDateRange(userId, startOfLastWeek, endOfLastWeek);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getPreviousMonthTotal = async (userId: string): Promise<number> => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfThisMonth);
    endOfLastMonth.setMilliseconds(-1);

    const expenses = await getExpensesByDateRange(userId, startOfLastMonth, endOfLastMonth);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getYearTotal = async (userId: string): Promise<number> => {
    const { start, end } = getDateRange('year');
    const expenses = await getExpensesByDateRange(userId, start, end);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getCategoryBreakdown = async (
    userId: string,
    filter: 'today' | 'week' | 'month' | 'year' = 'month'
): Promise<{ category: CategoryType; total: number; count: number }[]> => {
    const { start, end } = getDateRange(filter);
    const expenses = await getExpensesByDateRange(userId, start, end);

    const breakdown = expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
            acc[category] = { category, total: 0, count: 0 };
        }
        acc[category].total += expense.amount;
        acc[category].count += 1;
        return acc;
    }, {} as Record<CategoryType, { category: CategoryType; total: number; count: number }>);

    return Object.values(breakdown);
};

export const getTopCategory = async (
    userId: string,
    filter: 'today' | 'week' | 'month' | 'year' = 'month'
): Promise<{ category: CategoryType; total: number } | null> => {
    const breakdown = await getCategoryBreakdown(userId, filter);
    if (breakdown.length === 0) return null;

    return breakdown.reduce((top, current) => (current.total > top.total ? current : top));
};

export const getTrendData = async (
    userId: string,
    filter: 'week' | 'month' | 'year'
): Promise<{ date: string; amount: number }[]> => {
    const { start, end } = getDateRange(filter);
    const expenses = await getExpensesByDateRange(userId, start, end);

    const grouped = expenses.reduce((acc, expense) => {
        const date = expense.timestamp.split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));
};

export const getExpenseCount = async (userId: string): Promise<number> => {
    const expenses = await getAllExpenses(userId);
    return expenses.length;
};
