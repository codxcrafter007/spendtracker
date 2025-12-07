import React from 'react';

interface CongratulationsCardProps {
    type: 'week' | 'month';
    currentAmount: number;
    previousAmount: number;
    savings: number;
    savingsPercentage: number;
}

export const CongratulationsCard: React.FC<CongratulationsCardProps> = ({
    type,
    currentAmount,
    previousAmount,
    savings,
    savingsPercentage,
}) => {
    const periodText = type === 'week' ? 'this week' : 'this month';
    const comparisonText = type === 'week' ? 'last week' : 'last month';

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                        Congratulations! Great Job! 🌟
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mb-3">
                        You spent <span className="font-bold">₹{savings.toLocaleString()}</span> ({savingsPercentage.toFixed(1)}%) less {periodText} compared to {comparisonText}!
                    </p>
                    <div className="flex gap-4 text-sm">
                        <div>
                            <span className="text-green-600 dark:text-green-500">This {type}:</span>{' '}
                            <span className="font-semibold text-green-800 dark:text-green-300">₹{currentAmount.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-green-600 dark:text-green-500">Last {type}:</span>{' '}
                            <span className="font-semibold text-green-800 dark:text-green-300">₹{previousAmount.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-3">
                        Keep up the excellent work! You're doing amazing! 💪
                    </p>
                </div>
            </div>
        </div>
    );
};
