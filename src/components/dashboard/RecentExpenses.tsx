import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import { getCategoryColor } from '../../utils/categories';
import type { SpendEntry } from '../../types';

interface RecentExpensesProps {
    expenses: SpendEntry[];
    lastWeekExpenses: SpendEntry[];
    monthExpenses: SpendEntry[];
    onDelete: (id: string) => void;
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
    expenses,
    lastWeekExpenses,
    monthExpenses,
    onDelete
}) => {
    const [period, setPeriod] = useState<'week' | 'lastWeek' | 'month'>('week');

    const currentExpenses =
        period === 'week' ? expenses :
            period === 'lastWeek' ? lastWeekExpenses :
                monthExpenses;

    const periodTitle =
        period === 'week' ? 'This Week\'s Expenses' :
            period === 'lastWeek' ? 'Last Week\'s Expenses' :
                'This Month\'s Expenses';

    if (currentExpenses.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {periodTitle}
                    </h3>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as 'week' | 'lastWeek' | 'month')}
                        className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100"
                    >
                        <option value="week">This Week</option>
                        <option value="lastWeek">Last Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                    No expenses for this period yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {periodTitle}
                </h3>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'week' | 'lastWeek' | 'month')}
                    className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100"
                >
                    <option value="week">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="month">This Month</option>
                </select>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {currentExpenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors group"
                    >
                        {/* Category Icon */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(expense.category) }}
                        >
                            {getCategoryEmoji(expense.category)}
                        </div>

                        {/* Expense Details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-neutral-900 dark:text-white capitalize">
                                        {expense.category}
                                    </p>
                                    {expense.notes && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                                            {expense.notes}
                                        </p>
                                    )}
                                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                        {new Date(expense.timestamp).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-neutral-900 dark:text-white">
                                            {formatCurrency(expense.amount)}
                                        </p>
                                    </div>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this expense?')) {
                                                onDelete(expense.id);
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400"
                                        aria-label="Delete expense"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
        food: '🍔',
        travel: '🚗',
        bills: '💡',
        shopping: '🛍️',
        entertainment: '🎬',
        health: '💊',
        custom: '✏️',
    };
    return emojiMap[category] || '💰';
};
