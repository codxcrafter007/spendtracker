import React, { useState, useEffect } from 'react';
import { FAB } from '../ui/FAB';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { getTodayTotal, getWeekTotal, getMonthTotal, getTopCategory, getCategoryBreakdown, getTrendData, getPreviousWeekTotal, getPreviousMonthTotal, getExpensesByDateRange } from '../../lib/db/expenseStore';
import { CategoryBreakdownChart } from '../charts/CategoryBreakdownChart';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { DatePickerInput } from '../ui/DatePicker';
import { CongratulationsCard } from './CongratulationsCard';
import { RecentExpenses } from './RecentExpenses';
import type { CategoryType, SpendEntry } from '../../types';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todayTotal, setTodayTotal] = useState(0);
    const [weekTotal, setWeekTotal] = useState(0);
    const [monthTotal, setMonthTotal] = useState(0);
    const [topCategory, setTopCategory] = useState<{ category: CategoryType; total: number } | null>(null);
    const [categoryData, setCategoryData] = useState<{ category: CategoryType; total: number; count: number }[]>([]);
    const [trendData, setTrendData] = useState<{ date: string; amount: number }[]>([]);
    const [previousWeekTotal, setPreviousWeekTotal] = useState(0);
    const [previousMonthTotal, setPreviousMonthTotal] = useState(0);
    const [weekExpenses, setWeekExpenses] = useState<SpendEntry[]>([]);
    const [lastWeekExpenses, setLastWeekExpenses] = useState<SpendEntry[]>([]);
    const [monthExpenses, setMonthExpenses] = useState<SpendEntry[]>([]);

    useEffect(() => {
        if (user) {
            loadSummary();
        }
    }, [user]);

    const loadSummary = async () => {
        if (!user) return;

        try {
            // Get week date range
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date();

            // Get last week date range
            const startOfLastWeek = new Date(startOfWeek);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
            const endOfLastWeek = new Date(startOfWeek);
            endOfLastWeek.setMilliseconds(-1);

            // Get month date range
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const [today, week, month, top, categories, trend, prevWeek, prevMonth, weekExp, lastWeekExp, monthExp] = await Promise.all([
                getTodayTotal(user.id),
                getWeekTotal(user.id),
                getMonthTotal(user.id),
                getTopCategory(user.id, 'month'),
                getCategoryBreakdown(user.id, 'month'),
                getTrendData(user.id, 'month'),
                getPreviousWeekTotal(user.id),
                getPreviousMonthTotal(user.id),
                getExpensesByDateRange(user.id, startOfWeek, endOfWeek),
                getExpensesByDateRange(user.id, startOfLastWeek, endOfLastWeek),
                getExpensesByDateRange(user.id, startOfMonth, endOfWeek),
            ]);

            setTodayTotal(today);
            setWeekTotal(week);
            setMonthTotal(month);
            setTopCategory(top);
            setCategoryData(categories);
            setTrendData(trend);
            setPreviousWeekTotal(prevWeek);
            setPreviousMonthTotal(prevMonth);
            setWeekExpenses(weekExp.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setLastWeekExpenses(lastWeekExp.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setMonthExpenses(monthExp.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (error) {
            console.error('Failed to load summary:', error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            const { deleteExpense } = await import('../../lib/db/expenseStore');
            await deleteExpense(id);
            await loadSummary(); // Refresh all data
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 dark:from-black dark:via-neutral-950 dark:to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Congratulations Cards */}
                {weekTotal > 0 && previousWeekTotal > 0 && weekTotal < previousWeekTotal && (
                    <CongratulationsCard
                        type="week"
                        currentAmount={weekTotal}
                        previousAmount={previousWeekTotal}
                        savings={previousWeekTotal - weekTotal}
                        savingsPercentage={((previousWeekTotal - weekTotal) / previousWeekTotal) * 100}
                    />
                )}
                {monthTotal > 0 && previousMonthTotal > 0 && monthTotal < previousMonthTotal && (
                    <CongratulationsCard
                        type="month"
                        currentAmount={monthTotal}
                        previousAmount={previousMonthTotal}
                        savings={previousMonthTotal - monthTotal}
                        savingsPercentage={((previousMonthTotal - monthTotal) / previousMonthTotal) * 100}
                    />
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard title="Today" amount={todayTotal} index={0} />
                    <SummaryCard title="This Week" amount={weekTotal} index={1} />
                    <SummaryCard title="This Month" amount={monthTotal} index={2} />
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <h3 className="text-sm font-medium opacity-90 mb-1">
                            Top Category
                        </h3>
                        <p className="text-3xl font-bold capitalize">
                            {topCategory ? topCategory.category : '-'}
                        </p>
                        {topCategory && (
                            <p className="text-sm opacity-90 mt-2">
                                {formatCurrency(topCategory.total)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Category Breakdown
                            </h3>
                        </div>
                        <CategoryBreakdownChart data={categoryData} />
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Spending Trend
                            </h3>
                        </div>
                        <SpendingTrendChart data={trendData} />
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="mb-8">
                    <RecentExpenses
                        expenses={weekExpenses}
                        lastWeekExpenses={lastWeekExpenses}
                        monthExpenses={monthExpenses}
                        onDelete={handleDeleteExpense}
                    />
                </div>

                {/* FAB */}
                <FAB onClick={() => setIsModalOpen(true)} />

                {/* Add Expense Modal */}
                <AddExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={loadSummary}
                />
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ title: string; amount: number; index?: number }> = ({ title, amount, index = 0 }) => {
    const gradients = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-emerald-500 to-emerald-600',
    ];

    const gradient = gradients[index % gradients.length];

    return (
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
            <h3 className="text-sm font-medium opacity-90 mb-2">
                {title}
            </h3>
            <p className="text-4xl font-bold mb-3">
                {formatCurrency(amount)}
            </p>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
            </div>
        </div>
    );
};

const AddExpenseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<CategoryType>('food');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !amount) return;

        setLoading(true);
        try {
            const { addExpense } = await import('../../lib/db/expenseStore');
            const dateTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                new Date().getHours(),
                new Date().getMinutes(),
                new Date().getSeconds()
            ).toISOString();

            await addExpense(
                user.id,
                parseFloat(amount),
                category,
                dateTime,
                notes
            );

            setAmount('');
            setNotes('');
            setDate(new Date());
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add expense:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                />

                <DatePickerInput
                    label="Date"
                    selected={date}
                    onChange={(newDate) => setDate(newDate)}
                    maxDate={new Date()}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CategoryType)}
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100"
                    >
                        <option value="food">🍔 Food</option>
                        <option value="travel">🚗 Travel</option>
                        <option value="bills">💡 Bills</option>
                        <option value="shopping">🛍️ Shopping</option>
                        <option value="entertainment">🎬 Entertainment</option>
                        <option value="health">💊 Health</option>
                        <option value="custom">✏️ Custom</option>
                    </select>
                </div>

                <Input
                    label="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                />

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
