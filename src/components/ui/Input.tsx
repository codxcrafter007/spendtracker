import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-3 py-2 border rounded-md
          bg-white dark:bg-neutral-800
          border-neutral-300 dark:border-neutral-600
          text-neutral-900 dark:text-neutral-100
          placeholder-neutral-400 dark:placeholder-neutral-500
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};
