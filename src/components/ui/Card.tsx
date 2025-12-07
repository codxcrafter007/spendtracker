import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`
        bg-white dark:bg-neutral-800
        rounded-lg shadow-md
        p-6
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01]' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
