import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategoryColor } from '../../utils/categories';
import type { CategoryType } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownChartProps {
    data: { category: CategoryType; total: number; count: number }[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-neutral-400">
                No expenses yet. Add some to see the breakdown!
            </div>
        );
    }

    const chartData = {
        labels: data.map((item) => item.category),
        datasets: [
            {
                data: data.map((item) => item.total),
                backgroundColor: data.map((item) => getCategoryColor(item.category)),
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="h-64">
            <Pie data={chartData} options={options} />
        </div>
    );
};
